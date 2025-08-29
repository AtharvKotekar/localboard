'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface SignUpPageProps {
  onToggleMode: () => void
}

const roles = [
  { value: 'coder', label: 'Coder', icon: '💻', desc: 'Building the future with code' },
  { value: 'biz', label: 'Business', icon: '💼', desc: 'Closing deals and partnerships' },
  { value: 'design', label: 'Designer', icon: '🎨', desc: 'Creating beautiful experiences' },
  { value: 'content', label: 'Creator', icon: '📱', desc: 'Crafting compelling content' },
  { value: 'misc', label: 'Other', icon: '🚀', desc: 'Making magic happen' }
]

export default function SignUpPage({ onToggleMode }: SignUpPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: '',
    tagline: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (!formData.role) {
      setError('Please select a role')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        name: formData.name,
        role: formData.role,
        tagline: formData.tagline
      })
      
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Account created successfully! Please check your email to verify your account.')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-display cyber-glow text-neon-green mb-2">
            HACKER HOUSE
          </h1>
          <p className="text-neon-cyan">Join the builders!</p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="cyber-border rounded-lg p-6 bg-cyber-darker/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-neon-green cyber-glow mb-6 text-center">
              Create Account
            </h2>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-neon-green/70 text-sm mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="
                    w-full p-3 bg-cyber-gray/30 border border-neon-green/30 rounded-lg
                    text-neon-green placeholder-neon-green/50
                    focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20
                    transition-all duration-300
                  "
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-neon-green/70 text-sm mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="
                    w-full p-3 bg-cyber-gray/30 border border-neon-green/30 rounded-lg
                    text-neon-green placeholder-neon-green/50
                    focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20
                    transition-all duration-300
                  "
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-neon-green/70 text-sm mb-2">
                  Your Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleInputChange('role', role.value)}
                      className={`
                        p-3 rounded-lg border transition-all duration-300 text-left
                        ${formData.role === role.value
                          ? 'border-neon-cyan bg-neon-cyan/20 text-neon-cyan'
                          : 'border-neon-green/30 bg-cyber-gray/20 text-neon-green/70 hover:border-neon-green'
                        }
                      `}
                    >
                      <div className="text-lg mb-1">{role.icon}</div>
                      <div className="font-semibold text-sm">{role.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-neon-green/70 text-sm mb-2">
                  Tagline (Optional)
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  className="
                    w-full p-3 bg-cyber-gray/30 border border-neon-green/30 rounded-lg
                    text-neon-green placeholder-neon-green/50
                    focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20
                    transition-all duration-300
                  "
                  placeholder="What drives you to build?"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-neon-green/70 text-sm mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="
                    w-full p-3 bg-cyber-gray/30 border border-neon-green/30 rounded-lg
                    text-neon-green placeholder-neon-green/50
                    focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20
                    transition-all duration-300
                  "
                  placeholder="Choose a strong password"
                  required
                />
              </div>

              <div>
                <label className="block text-neon-green/70 text-sm mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="
                    w-full p-3 bg-cyber-gray/30 border border-neon-green/30 rounded-lg
                    text-neon-green placeholder-neon-green/50
                    focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20
                    transition-all duration-300
                  "
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full p-3 bg-neon-green/20 border border-neon-green rounded-lg
                  text-neon-green font-bold cyber-glow
                  hover:bg-neon-green/30 hover:scale-105
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300
                "
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-5 h-5 border-2 border-neon-green/30 border-t-neon-green rounded-full"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Join Hacker House'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Toggle to Sign In */}
        <div className="text-center mt-6">
          <p className="text-neon-green/70">
            Already have an account?{' '}
            <button
              onClick={onToggleMode}
              className="text-neon-cyan hover:text-neon-green cyber-glow transition-colors duration-200"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}