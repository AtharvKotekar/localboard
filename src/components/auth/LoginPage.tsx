'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface LoginPageProps {
  onToggleMode: () => void
}

export default function LoginPage({ onToggleMode }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center">
              <span className="text-2xl font-bold text-cyber-dark">H</span>
            </div>
            <h1 className="text-3xl font-bold font-display text-text-primary">
              Hacker House
            </h1>
          </div>
          <p className="text-text-secondary">Welcome back, builder!</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-cyber-surface/80 backdrop-blur-lg border border-border-color rounded-2xl p-8">
            <h2 className="text-xl font-bold text-text-primary mb-8 text-center">
              Sign In to Continue
            </h2>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full p-4 bg-cyber-darker/50 border border-border-color rounded-xl
                    text-text-primary placeholder-text-muted
                    focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/10
                    transition-all duration-200
                  "
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-text-secondary text-sm font-medium mb-3">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full p-4 bg-cyber-darker/50 border border-border-color rounded-xl
                    text-text-primary placeholder-text-muted
                    focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/10
                    transition-all duration-200
                  "
                  placeholder="Your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full p-4 bg-gradient-to-r from-neon-green to-neon-cyan rounded-xl
                  text-cyber-dark font-bold 
                  hover:shadow-lg hover:shadow-neon-cyan/25 hover:scale-[1.02]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  transition-all duration-200
                "
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-5 h-5 border-2 border-neon-green/30 border-t-neon-green rounded-full"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Toggle to Sign Up */}
        <div className="text-center mt-6">
          <p className="text-neon-green/70">
            New to the house?{' '}
            <button
              onClick={onToggleMode}
              className="text-neon-cyan hover:text-neon-green cyber-glow transition-colors duration-200"
            >
              Join the builders
            </button>
          </p>
        </div>

        {/* Demo Access */}
        {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
          <div className="text-center mt-8 p-6 bg-gradient-to-br from-cyber-surface/60 to-cyber-blue/20 border border-border-color rounded-2xl backdrop-blur-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-text-primary mb-2">Demo Mode Active</h3>
              <p className="text-sm text-text-secondary">
                Choose from these demo accounts to explore the dashboard
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
              <div className="bg-cyber-darker/40 border border-border-color p-4 rounded-xl">
                <div className="font-semibold text-neon-pink mb-2">Admin Account</div>
                <div className="space-y-1">
                  <div className="font-mono text-neon-cyan text-xs">admin@hackerhouse.dev</div>
                  <div className="font-mono text-neon-cyan text-xs">admin123</div>
                  <div className="text-xs text-text-muted mt-2">Full admin access</div>
                </div>
              </div>
              
              <div className="bg-cyber-darker/40 border border-border-color p-4 rounded-xl">
                <div className="font-semibold text-neon-green mb-2">TV Display</div>
                <div className="space-y-1">
                  <div className="font-mono text-neon-cyan text-xs">tv@hackerhouse.dev</div>
                  <div className="font-mono text-neon-cyan text-xs">tv123</div>
                  <div className="text-xs text-text-muted mt-2">Perfect for TV screens</div>
                </div>
              </div>
              
              <div className="bg-cyber-darker/40 border border-border-color p-4 rounded-xl">
                <div className="font-semibold text-neon-purple mb-2">Builder (Alice)</div>
                <div className="space-y-1">
                  <div className="font-mono text-neon-cyan text-xs">alice@hackerhouse.dev</div>
                  <div className="font-mono text-neon-cyan text-xs">demo123</div>
                  <div className="text-xs text-text-muted mt-2">Top coder</div>
                </div>
              </div>
              
              <div className="bg-cyber-darker/40 border border-border-color p-4 rounded-xl">
                <div className="font-semibold text-text-secondary mb-2">Business Dev</div>
                <div className="space-y-1">
                  <div className="font-mono text-neon-cyan text-xs">bob@hackerhouse.dev</div>
                  <div className="font-mono text-neon-cyan text-xs">demo123</div>
                  <div className="text-xs text-text-muted mt-2">Partnership lead</div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-text-muted bg-cyber-darker/30 border border-border-color rounded-lg p-3">
              💡 Pro tip: Use the TV account for fullscreen display mode on lounge TVs
            </div>
          </div>
        )}
      </div>
    </div>
  )
}