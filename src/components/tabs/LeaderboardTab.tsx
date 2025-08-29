'use client'

import { useState, useEffect } from 'react'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { calculateLevel } from '@/lib/scoring'

const roleColors = {
  coder: 'neon-green',
  biz: 'neon-purple',
  design: 'neon-pink',
  content: 'neon-cyan',
  misc: 'neon-green'
}

const roleIcons = {
  coder: '⚡',
  biz: '💼',
  design: '🎨',
  content: '📱',
  misc: '🚀'
}

export default function LeaderboardTab() {
  const [sortBy, setSortBy] = useState<'points' | 'streak'>('points')
  const { leaderboard, loading, error, refresh } = useLeaderboard()

  const sortedUsers = [...leaderboard].sort((a, b) => {
    if (sortBy === 'points') return Number(b.total_points) - Number(a.total_points)
    return b.streak_days - a.streak_days
  })

  const getTrophyIcon = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  const maxPoints = Math.max(...leaderboard.map(u => Number(u.total_points)), 1)

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-neon-green/30 border-t-neon-green rounded-full mx-auto mb-4"></div>
          <p className="text-neon-green cyber-glow">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center cyber-border rounded-lg p-8 bg-red-500/20">
          <p className="text-red-300 mb-4">Error loading leaderboard: {error}</p>
          <button 
            onClick={refresh}
            className="px-6 py-2 bg-neon-green/20 border border-neon-green rounded-lg text-neon-green hover:bg-neon-green/30 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-4xl font-bold font-display cyber-glow mb-2">
            🏆 LEADERBOARD
          </h2>
          <p className="text-neon-green/70">
            Real-time rankings of our incredible builders
          </p>
        </div>
        
        {/* Sort Controls */}
        <div className="flex space-x-2">
          <button
            onClick={() => setSortBy('points')}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-300
              ${sortBy === 'points' 
                ? 'bg-neon-green/20 text-neon-green cyber-border' 
                : 'bg-cyber-gray/20 text-neon-green/70 hover:bg-cyber-blue/10'
              }
            `}
          >
            By Points
          </button>
          <button
            onClick={() => setSortBy('streak')}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-300
              ${sortBy === 'streak' 
                ? 'bg-neon-green/20 text-neon-green cyber-border' 
                : 'bg-cyber-gray/20 text-neon-green/70 hover:bg-cyber-blue/10'
              }
            `}
          >
            By Streak
          </button>
          <button
            onClick={refresh}
            className="px-4 py-2 rounded-lg font-medium bg-cyber-gray/20 text-neon-cyan hover:bg-cyber-blue/10 transition-all duration-300"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Top 3 Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {sortedUsers.slice(0, 3).map((user, index) => {
          const levelInfo = calculateLevel(Number(user.total_points))
          return (
            <div
              key={user.user_id}
              className={`
                cyber-border rounded-lg p-6 text-center relative overflow-hidden
                ${index === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10' :
                  index === 1 ? 'bg-gradient-to-br from-gray-400/20 to-gray-500/10' :
                  'bg-gradient-to-br from-orange-600/20 to-orange-700/10'
                }
              `}
            >
              <div className="text-4xl mb-2">{getTrophyIcon(index)}</div>
              <div className="text-2xl mb-1">{roleIcons[user.role as keyof typeof roleIcons] || '🚀'}</div>
              <h3 className="font-bold text-lg cyber-glow">{user.name}</h3>
              <p className="text-xs text-neon-green/70 mb-2">{user.tagline || 'Building the future'}</p>
              <div className="flex justify-center space-x-4 text-sm">
                <span className="text-neon-cyan">{user.total_points} pts</span>
                <span className="text-neon-pink">🔥 {user.streak_days}</span>
              </div>
              <div className="text-xs text-neon-purple mt-1">{levelInfo.title}</div>
            </div>
          )
        })}
      </div>

      {/* Full Leaderboard */}
      <div className="space-y-3">
        {sortedUsers.map((user, index) => {
          const levelInfo = calculateLevel(Number(user.total_points))
          return (
            <div
              key={user.user_id}
              className={`
                cyber-border rounded-lg p-4 bg-cyber-darker/30 backdrop-blur-sm
                hover:bg-cyber-blue/10 transition-all duration-300
                ${index < 3 ? 'ring-2 ring-neon-cyan/20' : ''}
              `}
            >
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <div className="text-2xl font-bold w-12 text-center">
                  {getTrophyIcon(index)}
                </div>

                {/* Avatar & Info */}
                <div className="flex items-center space-x-3 flex-grow">
                  <div className="text-3xl">{roleIcons[user.role as keyof typeof roleIcons] || '🚀'}</div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-lg cyber-glow">{user.name}</h3>
                      <span className={`text-${roleColors[user.role as keyof typeof roleColors]} text-sm`}>
                        {roleIcons[user.role as keyof typeof roleIcons]} {user.role}
                      </span>
                    </div>
                    <p className="text-sm text-neon-green/70">{user.tagline || 'Building the future'}</p>
                    <p className="text-xs text-neon-cyan/60 mt-1">
                      Level: {levelInfo.title} • Activities: {user.activity_count}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-right">
                  {/* Progress Bar */}
                  <div className="w-32 bg-cyber-gray/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-neon-green to-neon-cyan h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(Number(user.total_points) / maxPoints) * 100}%` }}
                    />
                  </div>
                  
                  {/* Points */}
                  <div className="text-center">
                    <div className="text-xl font-bold text-neon-cyan">{user.total_points}</div>
                    <div className="text-xs text-neon-green/70">points</div>
                  </div>
                  
                  {/* Streak */}
                  <div className="text-center">
                    <div className="text-xl font-bold text-neon-pink flex items-center">
                      🔥 {user.streak_days}
                    </div>
                    <div className="text-xs text-neon-green/70">streak</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Stats Summary */}
      {leaderboard.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { 
              label: 'Total Builders', 
              value: leaderboard.length, 
              color: 'neon-cyan' 
            },
            { 
              label: 'Total Points', 
              value: leaderboard.reduce((sum, u) => sum + Number(u.total_points), 0), 
              color: 'neon-green' 
            },
            { 
              label: 'Avg Points', 
              value: Math.round(leaderboard.reduce((sum, u) => sum + Number(u.total_points), 0) / leaderboard.length), 
              color: 'neon-pink' 
            },
            { 
              label: 'Max Streak', 
              value: Math.max(...leaderboard.map(u => u.streak_days)), 
              color: 'neon-purple' 
            },
          ].map((stat, index) => (
            <div key={index} className="cyber-border rounded-lg p-4 text-center bg-cyber-darker/20">
              <div className={`text-2xl font-bold text-${stat.color} cyber-glow`}>
                {stat.value.toLocaleString()}
              </div>
              <div className="text-xs text-neon-green/70">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {leaderboard.length === 0 && (
        <div className="text-center cyber-border rounded-lg p-8 bg-cyber-blue/10">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-bold text-neon-cyan cyber-glow mb-2">
            Ready to Build!
          </h3>
          <p className="text-neon-green/70">
            No builders have submitted activities yet. Be the first to get on the leaderboard!
          </p>
        </div>
      )}
    </div>
  )
}