'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { calculateFinalPoints, scoringRules } from '@/lib/scoring'

interface ProgressSubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const categories = [
  { value: 'code', label: 'Code', icon: '💻', desc: 'Commits, features, bug fixes' },
  { value: 'biz', label: 'Business', icon: '💼', desc: 'Partnerships, sales, meetings' },
  { value: 'design', label: 'Design', icon: '🎨', desc: 'UI/UX, prototypes, graphics' },
  { value: 'content', label: 'Content', icon: '📱', desc: 'Blogs, videos, social posts' },
  { value: 'misc', label: 'Other', icon: '🚀', desc: 'Learning, helping, misc tasks' }
]

export default function ProgressSubmissionModal({ isOpen, onClose, onSuccess }: ProgressSubmissionModalProps) {
  const { profile } = useAuth()
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    evidenceLink: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) {
      setError('You must be logged in to submit activities')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Calculate points based on the activity
      const calculatedPoints = calculateFinalPoints(
        formData.category,
        formData.description,
        profile.role,
        formData.evidenceLink
      )

      // Check if we're in demo mode
      const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
      
      if (isDemo) {
        // In demo mode, just simulate success
        setSuccess(`🎉 Demo: Activity submitted! Points: ${calculatedPoints}`)
      } else {
        // Submit activity to Supabase
        const { data, error } = await supabase
          .from('activities')
          .insert({
            user_id: profile.id,
            category: formData.category as any,
            description: formData.description,
            evidence_link: formData.evidenceLink || null,
            points: calculatedPoints,
            approved: false // Activities need admin approval
          })

        if (error) {
          throw error
        }

        setSuccess(`Activity submitted! Estimated points: ${calculatedPoints}`)
      }
      
      setFormData({ category: '', description: '', evidenceLink: '' })
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 2000)
      }

    } catch (err) {
      console.error('Error submitting activity:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit activity')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getEstimatedPoints = () => {
    if (!formData.category || !formData.description || !profile) return 0
    return calculateFinalPoints(
      formData.category,
      formData.description,
      profile.role,
      formData.evidenceLink
    )
  }

  const relevantRules = scoringRules.filter(rule => rule.category === formData.category)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-cyber-dark cyber-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-neon-green/30">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neon-green cyber-glow">
              🚀 Log Your Progress
            </h2>
            <button
              onClick={onClose}
              className="text-neon-green/70 hover:text-neon-green text-2xl transition-colors duration-200"
            >
              ✕
            </button>
          </div>
          <p className="text-neon-green/70 text-sm mt-2">
            Share what you've built today and earn points!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Category Selection */}
          <div>
            <label className="block text-neon-green/70 text-sm mb-3">
              Activity Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleInputChange('category', category.value)}
                  className={`
                    p-3 rounded-lg border transition-all duration-300 text-center
                    ${formData.category === category.value
                      ? 'border-neon-cyan bg-neon-cyan/20 text-neon-cyan'
                      : 'border-neon-green/30 bg-cyber-gray/20 text-neon-green/70 hover:border-neon-green'
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="font-semibold text-xs">{category.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-neon-green/70 text-sm mb-2">
              What did you ship today? *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="
                w-full p-3 bg-cyber-gray/30 border border-neon-green/30 rounded-lg
                text-neon-green placeholder-neon-green/50 resize-none
                focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20
                transition-all duration-300
              "
              placeholder="Describe what you accomplished today... Be specific! Mention commits, features, partnerships, content created, etc."
              required
            />
            <p className="text-xs text-neon-green/50 mt-1">
              Tip: Include keywords like "commit", "feature", "partnership", "blog" for better point calculation
            </p>
          </div>

          {/* Evidence Link */}
          <div>
            <label className="block text-neon-green/70 text-sm mb-2">
              Evidence Link (Optional)
            </label>
            <input
              type="url"
              value={formData.evidenceLink}
              onChange={(e) => handleInputChange('evidenceLink', e.target.value)}
              className="
                w-full p-3 bg-cyber-gray/30 border border-neon-green/30 rounded-lg
                text-neon-green placeholder-neon-green/50
                focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20
                transition-all duration-300
              "
              placeholder="https://github.com/user/repo, https://twitter.com/post, etc."
            />
            <p className="text-xs text-neon-green/50 mt-1">
              Link to GitHub commit, tweet, blog post, etc. Bonus points for evidence!
            </p>
          </div>

          {/* Scoring Preview */}
          {formData.category && formData.description && (
            <div className="cyber-border rounded-lg p-4 bg-cyber-blue/10">
              <h3 className="text-neon-cyan font-semibold mb-2">
                ⭐ Estimated Points: {getEstimatedPoints()}
              </h3>
              <div className="text-sm text-neon-green/70 space-y-1">
                <p>📊 Your Role: {profile?.role} ({profile?.name})</p>
                <p>📈 Base points calculated from description and category</p>
                <p>🔗 Evidence link bonus: {formData.evidenceLink ? '+1-3 points' : 'None'}</p>
              </div>
            </div>
          )}

          {/* Scoring Rules for Selected Category */}
          {relevantRules.length > 0 && (
            <div className="cyber-border rounded-lg p-4 bg-cyber-darker/30">
              <h3 className="text-neon-purple font-semibold mb-2">
                💡 Scoring Guide for {categories.find(c => c.value === formData.category)?.label}
              </h3>
              <div className="space-y-1 text-sm text-neon-green/70">
                {relevantRules.map((rule, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{rule.description}</span>
                    <span className="text-neon-cyan">{rule.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-3 border border-neon-green/30 rounded-lg text-neon-green/70 hover:text-neon-green hover:border-neon-green transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.category || !formData.description}
              className="
                flex-1 p-3 bg-neon-green/20 border border-neon-green rounded-lg
                text-neon-green font-bold cyber-glow
                hover:bg-neon-green/30 hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300
              "
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin w-5 h-5 border-2 border-neon-green/30 border-t-neon-green rounded-full"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit Activity'
              )}
            </button>
          </div>

          {/* Note */}
          <div className="text-xs text-neon-green/50 text-center p-3 bg-cyber-darker/20 rounded-lg">
            📝 Note: All activities require admin approval before points are added to the leaderboard.
            You'll be notified once your submission is reviewed!
          </div>
        </form>
      </div>
    </div>
  )
}