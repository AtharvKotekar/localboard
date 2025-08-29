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
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Always return static data for public access
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

export function useUserStats(userId?: string) {
  const [stats, setStats] = useState({
    totalPoints: 0,
    activityCount: 0,
    streakDays: 0,
    rank: 0,
    recentActivities: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Always return static stats for public access
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