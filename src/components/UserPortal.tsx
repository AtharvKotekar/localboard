'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUserStats } from '@/hooks/useLeaderboard'
import { supabase } from '@/lib/supabase'
import ProgressSubmissionModal from './ProgressSubmissionModal'
import { calculateLevel } from '@/lib/scoring'

interface Activity {
  id: string
  category: string
  description: string
  evidence_link?: string
  points: number
  approved: boolean
  created_at: string
}

interface UserPortalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserPortal({ isOpen, onClose }: UserPortalProps) {
  const { profile } = useAuth()
  const { stats, loading, error } = useUserStats(profile?.id)
  const [activities, setActivities] = useState<Activity[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)

  useEffect(() => {
    if (profile?.id) {
      fetchUserActivities()
    }
  }, [profile?.id])

  const fetchUserActivities = async () => {
    if (!profile?.id) return

    try {
      setActivitiesLoading(true)
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setActivities(data || [])
    } catch (err) {
      console.error('Error fetching activities:', err)
    } finally {
      setActivitiesLoading(false)
    }
  }

  const handleSubmissionSuccess = () => {
    fetchUserActivities()
  }

  if (!isOpen) return null

  const levelInfo = calculateLevel(stats.totalPoints)
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'coder': return '💻'
      case 'biz': return '💼'
      case 'design': return '🎨'
      case 'content': return '📱'
      default: return '🚀'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'code': return '💻'
      case 'biz': return '💼'
      case 'design': return '🎨'
      case 'content': return '📱'
      default: return '🚀'
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-40">
        <div className="bg-cyber-dark cyber-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-neon-green/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{getRoleIcon(profile?.role || '')}</div>
                <div>
                  <h2 className="text-2xl font-bold text-neon-green cyber-glow">
                    {profile?.name}'s Dashboard
                  </h2>
                  <p className="text-neon-green/70 text-sm">
                    {profile?.tagline || 'Building the future, one commit at a time'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-neon-green/70 hover:text-neon-green text-2xl transition-colors duration-200"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-neon-green/30 border-t-neon-green rounded-full mx-auto mb-4"></div>
              <p className="text-neon-green/70">Loading your stats...</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Points', value: stats.totalPoints, icon: '⭐', color: 'neon-cyan' },
                  { label: 'Current Rank', value: stats.rank || 'Unranked', icon: '🏆', color: 'neon-green' },
                  { label: 'Activities', value: stats.activityCount, icon: '📋', color: 'neon-pink' },
                  { label: 'Streak', value: stats.streakDays, icon: '🔥', color: 'neon-purple' },
                ].map((stat, index) => (
                  <div key={index} className="cyber-border rounded-lg p-4 text-center bg-cyber-darker/20">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className={`text-xl font-bold text-${stat.color} cyber-glow`}>
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </div>
                    <div className="text-xs text-neon-green/70">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Level Progress */}
              <div className="cyber-border rounded-lg p-6 bg-gradient-to-r from-cyber-blue/20 to-neon-purple/10">
                <h3 className="text-lg font-bold text-neon-cyan cyber-glow mb-3">
                  Level Progress
                </h3>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="text-3xl">🎯</div>
                  <div>
                    <div className="text-xl font-bold text-neon-purple">
                      Level {levelInfo.level}: {levelInfo.title}
                    </div>
                    <div className="text-sm text-neon-green/70">
                      {levelInfo.nextLevelPoints > 0 
                        ? `${levelInfo.nextLevelPoints} points to next level`
                        : 'Max level achieved!'
                      }
                    </div>
                  </div>
                </div>
                {levelInfo.nextLevelPoints > 0 && (
                  <div className="bg-cyber-gray/30 rounded-full h-3 relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-neon-purple to-neon-pink h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${Math.min(((stats.totalPoints % 100) / 100) * 100, 100)}%` 
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => setShowSubmissionModal(true)}
                  className="
                    flex-1 p-4 bg-neon-green/20 border border-neon-green rounded-lg
                    text-neon-green font-bold cyber-glow text-center
                    hover:bg-neon-green/30 hover:scale-105
                    transition-all duration-300
                  "
                >
                  🚀 Log Today's Progress
                </button>
                <button className="
                  flex-1 p-4 bg-cyber-blue/20 border border-neon-cyan rounded-lg
                  text-neon-cyan font-bold text-center
                  hover:bg-cyber-blue/30 hover:scale-105
                  transition-all duration-300
                ">
                  📊 View Detailed Analytics
                </button>
              </div>

              {/* Recent Activities */}
              <div>
                <h3 className="text-lg font-bold text-neon-cyan cyber-glow mb-4">
                  Recent Activities
                </h3>
                
                {activitiesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-neon-green/30 border-t-neon-green rounded-full mx-auto mb-2"></div>
                    <p className="text-neon-green/70 text-sm">Loading activities...</p>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-8 cyber-border rounded-lg bg-cyber-blue/10">
                    <div className="text-4xl mb-2">📝</div>
                    <p className="text-neon-green/70">No activities yet</p>
                    <p className="text-neon-green/50 text-sm">Start logging your progress to earn points!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="cyber-border rounded-lg p-4 bg-cyber-darker/30 hover:bg-cyber-blue/10 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-grow">
                            <div className="text-xl mt-1">{getCategoryIcon(activity.category)}</div>
                            <div className="flex-grow">
                              <p className="text-neon-green/90 mb-1">{activity.description}</p>
                              <div className="flex flex-wrap items-center gap-3 text-xs">
                                <span className="text-neon-cyan">
                                  {activity.category.toUpperCase()}
                                </span>
                                <span className="text-neon-pink">
                                  {activity.points} points
                                </span>
                                <span className={`
                                  px-2 py-1 rounded-full text-xs
                                  ${activity.approved 
                                    ? 'bg-green-500/20 text-green-300' 
                                    : 'bg-yellow-500/20 text-yellow-300'
                                  }
                                `}>
                                  {activity.approved ? '✅ Approved' : '⏳ Pending'}
                                </span>
                                <span className="text-neon-green/50">
                                  {new Date(activity.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              {activity.evidence_link && (
                                <a
                                  href={activity.evidence_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-neon-cyan hover:text-neon-green text-xs mt-1 inline-block"
                                >
                                  🔗 View Evidence
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Submission Modal */}
      <ProgressSubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        onSuccess={handleSubmissionSuccess}
      />
    </>
  )
}