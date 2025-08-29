export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string
          avatar_url?: string
          role: 'coder' | 'biz' | 'design' | 'content' | 'misc'
          tagline?: string
          is_admin: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          name: string
          avatar_url?: string
          role: 'coder' | 'biz' | 'design' | 'content' | 'misc'
          tagline?: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string
          avatar_url?: string
          role?: 'coder' | 'biz' | 'design' | 'content' | 'misc'
          tagline?: string
          is_admin?: boolean
        }
      }
      activities: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          category: 'code' | 'biz' | 'content' | 'design' | 'misc'
          description: string
          evidence_link?: string
          points: number
          approved: boolean
          approved_by?: string
          approved_at?: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          category: 'code' | 'biz' | 'content' | 'design' | 'misc'
          description: string
          evidence_link?: string
          points?: number
          approved?: boolean
          approved_by?: string
          approved_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          category?: 'code' | 'biz' | 'content' | 'design' | 'misc'
          description?: string
          evidence_link?: string
          points?: number
          approved?: boolean
          approved_by?: string
          approved_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          source: 'twitter' | 'instagram' | 'manual' | 'linkedin'
          content: string
          content_link?: string
          likes: number
          retweets: number
          external_id?: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          source: 'twitter' | 'instagram' | 'manual' | 'linkedin'
          content: string
          content_link?: string
          likes?: number
          retweets?: number
          external_id?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          source?: 'twitter' | 'instagram' | 'manual' | 'linkedin'
          content?: string
          content_link?: string
          likes?: number
          retweets?: number
          external_id?: string
        }
      }
    }
    Views: {
      leaderboard: {
        Row: {
          user_id: string
          name: string
          avatar_url?: string
          role: string
          tagline?: string
          total_points: number
          activity_count: number
          streak_days: number
          last_activity: string
        }
      }
    }
    Functions: {
      calculate_user_streak: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      get_leaderboard: {
        Args: {}
        Returns: {
          user_id: string
          name: string
          avatar_url?: string
          role: string
          tagline?: string
          total_points: number
          activity_count: number
          streak_days: number
          last_activity: string
        }[]
      }
    }
  }
}

// Helper types
export type User = Database['public']['Tables']['users']['Row']
export type Activity = Database['public']['Tables']['activities']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type LeaderboardEntry = Database['public']['Views']['leaderboard']['Row']

export type UserInsert = Database['public']['Tables']['users']['Insert']
export type ActivityInsert = Database['public']['Tables']['activities']['Insert']
export type PostInsert = Database['public']['Tables']['posts']['Insert']

export type UserUpdate = Database['public']['Tables']['users']['Update']
export type ActivityUpdate = Database['public']['Tables']['activities']['Update']
export type PostUpdate = Database['public']['Tables']['posts']['Update']