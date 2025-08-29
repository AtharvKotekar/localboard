-- Hacker House Dashboard Database Schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('coder', 'biz', 'design', 'content', 'misc')),
    tagline TEXT,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('code', 'biz', 'content', 'design', 'misc')),
    description TEXT NOT NULL,
    evidence_link TEXT,
    points INTEGER DEFAULT 0,
    approved BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    source TEXT NOT NULL CHECK (source IN ('twitter', 'instagram', 'manual', 'linkedin')),
    content TEXT NOT NULL,
    content_link TEXT,
    likes INTEGER DEFAULT 0,
    retweets INTEGER DEFAULT 0,
    external_id TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);
CREATE INDEX IF NOT EXISTS idx_activities_approved ON activities(approved);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);

-- Function to calculate user streak
CREATE OR REPLACE FUNCTION calculate_user_streak(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    streak_count INTEGER := 0;
    current_date DATE := CURRENT_DATE;
    check_date DATE;
BEGIN
    -- Check each day backwards from today
    FOR i IN 0..50 LOOP
        check_date := current_date - i;
        
        -- Check if user has activity on this date
        IF EXISTS (
            SELECT 1 FROM activities 
            WHERE activities.user_id = $1 
            AND DATE(activities.created_at) = check_date 
            AND activities.approved = TRUE
        ) THEN
            streak_count := streak_count + 1;
        ELSE
            -- Break streak if no activity found
            IF i > 0 THEN
                EXIT;
            END IF;
        END IF;
    END LOOP;
    
    RETURN streak_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get leaderboard data
CREATE OR REPLACE FUNCTION get_leaderboard()
RETURNS TABLE (
    user_id UUID,
    name TEXT,
    avatar_url TEXT,
    role TEXT,
    tagline TEXT,
    total_points BIGINT,
    activity_count BIGINT,
    streak_days INTEGER,
    last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.role,
        u.tagline,
        COALESCE(SUM(a.points), 0) as total_points,
        COUNT(a.id) as activity_count,
        calculate_user_streak(u.id) as streak_days,
        MAX(a.created_at) as last_activity
    FROM users u
    LEFT JOIN activities a ON u.id = a.user_id AND a.approved = TRUE
    GROUP BY u.id, u.name, u.avatar_url, u.role, u.tagline
    ORDER BY total_points DESC, activity_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Create leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT * FROM get_leaderboard();

-- Function to automatically calculate points based on activity category
CREATE OR REPLACE FUNCTION calculate_activity_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Only calculate points if not manually set
    IF NEW.points = 0 OR NEW.points IS NULL THEN
        CASE NEW.category
            WHEN 'code' THEN
                -- Default points for code activities
                NEW.points := 10;
            WHEN 'biz' THEN
                -- Default points for business activities
                NEW.points := 15;
            WHEN 'content' THEN
                -- Default points for content activities
                NEW.points := 12;
            WHEN 'design' THEN
                -- Default points for design activities
                NEW.points := 15;
            WHEN 'misc' THEN
                -- Default points for misc activities
                NEW.points := 5;
        END CASE;
    END IF;
    
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_calculate_activity_points
    BEFORE INSERT OR UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION calculate_activity_points();

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles
CREATE POLICY "Public profiles are viewable by everyone" ON users
    FOR SELECT USING (true);

-- Users can update own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Activities are viewable by everyone
CREATE POLICY "Activities are viewable by everyone" ON activities
    FOR SELECT USING (true);

-- Users can insert own activities
CREATE POLICY "Users can insert own activities" ON activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update own activities (until approved)
CREATE POLICY "Users can update own activities" ON activities
    FOR UPDATE USING (auth.uid() = user_id AND approved = false);

-- Admins can approve activities
CREATE POLICY "Admins can approve activities" ON activities
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = true
        )
    );

-- Posts are viewable by everyone
CREATE POLICY "Posts are viewable by everyone" ON posts
    FOR SELECT USING (true);

-- Users can insert own posts
CREATE POLICY "Users can insert own posts" ON posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update own posts
CREATE POLICY "Users can update own posts" ON posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Sample data (optional - remove in production)
-- INSERT INTO users (email, name, role, tagline, is_admin) VALUES
--     ('admin@hackerhouse.dev', 'Admin User', 'misc', 'House Manager', true),
--     ('alice@hackerhouse.dev', 'Alice Chen', 'coder', 'Full-stack wizard building the next unicorn', false),
--     ('bob@hackerhouse.dev', 'Bob Martinez', 'biz', 'Closing deals and building partnerships', false),
--     ('clara@hackerhouse.dev', 'Clara Johnson', 'design', 'Pixel perfectionist & UX evangelist', false),
--     ('david@hackerhouse.dev', 'David Kim', 'content', 'Content creator extraordinaire', false);