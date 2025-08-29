# 🏠 Hacker House Digital Dashboard

A cyberpunk-themed digital accountability board for tracking progress, leaderboards, and community engagement in a 50-day sprint to Demo Day.

![Dashboard Preview](preview.png)

## 🎯 Overview

The Hacker House Dashboard is designed for 20 builders collaborating in a high-intensity environment. It provides:

- **Real-time Leaderboard**: Track points across different roles (coders, business, designers, creators)
- **Progress Submission**: Daily activity logging with automatic point calculation
- **Countdown Timer**: 50-day sprint countdown to Demo Day
- **Community Feed**: Social media integration and manual post sharing
- **TV Display Mode**: Fullscreen mode optimized for large displays
- **User Authentication**: Secure login/signup with role-based features

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

### 1. Clone & Install

```bash
git clone <repository-url>
cd hacker-house-dashboard
npm install
```

### 2. Environment Setup

Create `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Demo Day Configuration
NEXT_PUBLIC_DEMO_DAY_DATE=2025-10-18T00:00:00

# Optional: Twitter API
TWITTER_BEARER_TOKEN=your-twitter-bearer-token
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) on all tables
4. Configure authentication settings in Supabase dashboard

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Features

### 🏆 Leaderboard System

**Role-Based Scoring:**
- **Coders**: 5 commits = 10pts, 1 feature = 20pts, bug fix = 8pts
- **Business**: 1 partnership = 20pts, 1 customer = 30pts, meeting = 15pts  
- **Creators**: 1 blog/video = 15pts, 1 tweet thread = 10pts, social post = 5pts
- **Designers**: 1 prototype = 15pts, 1 shipped design = 25pts, component = 12pts
- **Everyone**: Daily check-in = 5pts, helping teammate = 8pts

**Smart Scoring:**
- Automatic point calculation based on keywords in descriptions
- Evidence link bonuses (+1-3 points for GitHub, Twitter, etc.)
- Role multipliers for category alignment
- Streak bonuses for consistent daily activity

### 📊 User Dashboard

- Personal stats (points, rank, activities, streak)
- Level progression system (Newbie → Builder → Hustler → Achiever → Legend → Unicorn → Mythical)
- Activity submission form with real-time point estimation
- Recent activity history with approval status

### ⏱️ Countdown Timer

- Dynamic countdown to Demo Day
- Rotating inspirational quotes
- Progress ring showing sprint completion
- Customizable target date

### 📡 Community Feed

- Twitter integration with hashtag monitoring
- Manual post submission
- Auto-refresh every 5 minutes
- Engagement metrics display

### 🖥️ TV Display Mode

- One-click fullscreen button
- Optimized for 1080p+ displays
- Auto-rotating content options
- No browser chrome in kiosk mode

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Deployment**: Vercel (recommended)

## 🎨 Design Philosophy

**Cyberpunk Aesthetic:**
- Dark backgrounds with neon accents
- Glowing text effects and animations  
- Monospace fonts (Orbitron, Courier New)
- Neon color palette (green, cyan, pink, purple)
- Subtle background gradients and effects

**User Experience:**
- Responsive design (mobile to 85" TV screens)
- Smooth animations and transitions
- Real-time updates via Supabase subscriptions
- Intuitive navigation and clear visual hierarchy

## 🔧 Configuration

### Demo Day Date

Update the countdown target in your `.env.local`:

```env
NEXT_PUBLIC_DEMO_DAY_DATE=2025-12-31T00:00:00
```

### Supabase Setup

1. **Create Project**: New project in Supabase dashboard
2. **Run Schema**: Execute `supabase-schema.sql` in SQL editor
3. **Configure Auth**: Enable email/password auth
4. **Set RLS**: Row Level Security policies are included in schema
5. **Get Credentials**: Copy URL and anon key to `.env.local`

### Adding Users

Users can self-register, or admins can create accounts:

```sql
INSERT INTO users (email, name, role, tagline, is_admin) 
VALUES ('user@example.com', 'John Doe', 'coder', 'Building the future', false);
```

## 📈 Usage Guide

### For Builders

1. **Sign Up**: Create account with your role (coder/biz/design/content)
2. **Daily Logging**: Click profile → "Log Progress" to submit activities
3. **Track Stats**: Monitor your points, rank, and streak
4. **Evidence Links**: Include GitHub commits, tweets, etc. for bonus points

### For Admins

1. **Approve Activities**: Review and approve submitted activities
2. **Manage Users**: Update roles, taglines, admin status
3. **Monitor Stats**: Track overall house progress and engagement

### For TV Display

1. **Open Dashboard**: Navigate to main dashboard
2. **Fullscreen Mode**: Click "TV MODE" button (top-right)
3. **Auto-Refresh**: Dashboard updates automatically every 10 seconds
4. **Kiosk Setup**: Configure browser to start in fullscreen mode

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**: Import project in Vercel dashboard
2. **Environment Variables**: Add all `.env.local` variables
3. **Deploy**: Automatic deployments on git push
4. **Domain**: Configure custom domain if desired

### Manual Deployment

```bash
npm run build
npm run start
```

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **JWT Authentication**: Secure user sessions via Supabase
- **Input Validation**: Form validation and sanitization
- **Rate Limiting**: API rate limiting via Supabase
- **No Exposed Secrets**: Environment variables for all credentials

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style

- TypeScript for type safety
- ESLint + Prettier for code formatting
- Conventional commits for clear history
- Component-based architecture
- Custom hooks for data fetching

## 📝 API Reference

### Database Schema

**Users Table:**
- `id`, `name`, `email`, `role`, `tagline`, `is_admin`

**Activities Table:**
- `user_id`, `category`, `description`, `evidence_link`, `points`, `approved`

**Posts Table:**
- `user_id`, `source`, `content`, `content_link`, `likes`, `retweets`

### Key Functions

- `get_leaderboard()`: Returns ranked user stats
- `calculate_user_streak(user_id)`: Calculates consecutive activity days
- `calculate_activity_points()`: Auto-calculates points on activity insert

## 🐛 Troubleshooting

### Common Issues

**Database Connection:**
- Verify Supabase credentials in `.env.local`
- Check if RLS policies are properly configured
- Ensure database schema was executed correctly

**Authentication:**
- Confirm email/password auth is enabled in Supabase
- Check if user exists in users table
- Verify JWT secret configuration

**Deployment:**
- Ensure all environment variables are set
- Check build logs for TypeScript errors
- Verify Supabase project is not paused

### Debug Mode

Enable detailed logging:

```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## 📧 Support

- **Issues**: Open GitHub issue for bugs/features
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact maintainers directly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the Hacker House community**

*"Move fast, ship things, stay accountable"*