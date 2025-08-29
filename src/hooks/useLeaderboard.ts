'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LeaderboardEntry } from '@/types/database'

// Mock leaderboard data for demo mode
const mockLeaderboardData: LeaderboardEntry[] = [
  {
    user_id: 'demo-alice',
    name: 'Alice Chen',
    avatar_url: undefined,
    role: 'coder',
    tagline: 'Full-stack wizard building the next unicorn',
    total_points: 285,
    activity_count: 23,
    streak_days: 12,
    last_activity: '2024-01-15T10:30:00Z'
  },
  {
    user_id: 'demo-admin',
    name: 'Admin User',
    avatar_url: undefined,
    role: 'misc',
    tagline: 'Managing the house like a boss',
    total_points: 150,
    activity_count: 8,
    streak_days: 10,
    last_activity: '2024-01-14T18:00:00Z'
  }
]

export function useLeaderboard() {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  if (isDemo) {
    // Return demo data
    useEffect(() => {
      setLeaderboard(mockLeaderboardData)
      setLoading(false)
    }, [])
    
    return {
      leaderboard: mockLeaderboardData,
      loading: false,
      error: null,
      refresh: () => {}
    }
  }

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use the leaderboard view/function
      const { data, error } = await (supabase as any)
        .from('leaderboard')
        .select('*')
        .order('total_points', { ascending: false })

      if (error) {
        throw error
      }

      setLeaderboard(data || [])
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()

    // Set up real-time subscription
    const subscription = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities'
        },
        () => {
          // Refresh leaderboard when activities change
          fetchLeaderboard()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users'
        },
        () => {
          // Refresh leaderboard when users change
          fetchLeaderboard()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    leaderboard,
    loading,
    error,
    refresh: fetchLeaderboard
  }
}

export function useUserStats(userId?: string) {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  const [stats, setStats] = useState({
    totalPoints: 0,
    activityCount: 0,
    streakDays: 0,
    rank: 0,
    recentActivities: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  if (isDemo) {
    // Return demo stats
    useEffect(() => {
      if (!userId) {
        setLoading(false)
        return
      }

      const user = mockLeaderboardData.find(u => u.user_id === userId)
      if (user) {
        const rank = mockLeaderboardData.findIndex(u => u.user_id === userId) + 1
        setStats({
          totalPoints: Number(user.total_points),
          activityCount: Number(user.activity_count),
          streakDays: user.streak_days,
          rank,
          recentActivities: []
        })
      }
      setLoading(false)
    }, [userId])

    return { stats, loading: false, error: null }
  }

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchUserStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get user's total points and activities
        const { data: activities, error: activitiesError } = await (supabase as any)
          .from('activities')
          .select('*')
          .eq('user_id', userId)
          .eq('approved', true)
          .order('created_at', { ascending: false })

        if (activitiesError) throw activitiesError

        const totalPoints = activities?.reduce((sum: number, activity: any) => sum + (activity.points || 0), 0) || 0
        
        // Calculate streak (simplified - check consecutive days with activities)
        let streakDays = 0
        const today = new Date()
        const activities_by_date = new Map()
        
        activities?.forEach((activity: any) => {
          const date = new Date(activity.created_at).toDateString()
          if (!activities_by_date.has(date)) {
            activities_by_date.set(date, true)
          }
        })

        for (let i = 0; i < 50; i++) {
          const checkDate = new Date(today)
          checkDate.setDate(checkDate.getDate() - i)
          
          if (activities_by_date.has(checkDate.toDateString())) {
            streakDays++
          } else if (i > 0) {
            break
          }
        }

        // Get user's rank from leaderboard
        const { data: leaderboard, error: leaderboardError } = await (supabase as any)
          .from('leaderboard')
          .select('user_id, total_points')
          .order('total_points', { ascending: false })

        if (leaderboardError) throw leaderboardError

        const rank = leaderboard?.findIndex((entry: any) => entry.user_id === userId) + 1 || 0

        setStats({
          totalPoints,
          activityCount: activities?.length || 0,
          streakDays,
          rank,
          recentActivities: activities?.slice(0, 5) || []
        })

      } catch (err) {
        console.error('Error fetching user stats:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch user stats')
      } finally {
        setLoading(false)
      }
    }

    fetchUserStats()
  }, [userId])

  return { stats, loading, error }
}