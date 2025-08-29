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
    <div className="min-h-screen bg-black flex items-center justify-center p-6 matrix-bg">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-fluorescent-green flex items-center justify-center">
              <span className="text-2xl font-bold text-black mono">l</span>
            </div>
            <h1 className="text-3xl font-bold mono text-white glow-text">
              localboard
            </h1>
          </div>
          <p className="text-fluorescent-green mono">welcome back, builder</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-black/80 backdrop-blur-lg minimal-border rounded-lg p-8">
            <h2 className="text-xl font-light mono text-white mb-8 text-center glow-text">
              Sign In to Continue
            </h2>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 mono text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-fluorescent-green text-sm font-medium mb-3 mono">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full p-4 bg-black/50 minimal-border rounded-lg mono
                    text-white placeholder-gray-400
                    focus:border-fluorescent-green/50 focus:outline-none
                    transition-all duration-200
                  "
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-fluorescent-green text-sm font-medium mb-3 mono">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full p-4 bg-black/50 minimal-border rounded-lg mono
                    text-white placeholder-gray-400
                    focus:border-fluorescent-green/50 focus:outline-none
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
                  w-full p-4 bg-fluorescent-green rounded-lg mono
                  text-black font-bold 
                  hover:bg-dim-green hover:scale-[1.02] glow
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  transition-all duration-200
                "
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full"></div>
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
          <p className="text-gray-400 mono">
            New to the house?{' '}
            <button
              onClick={onToggleMode}
              className="text-fluorescent-green hover:text-dim-green transition-colors duration-200 glow-text"
            >
              Join the builders
            </button>
          </p>
        </div>

        {/* Demo Access */}
        {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
          <div className="text-center mt-8 p-6 bg-black/40 minimal-border rounded-lg backdrop-blur-sm">
            <div className="mb-6">
              <h3 className="text-lg font-light mono text-fluorescent-green mb-2 glow-text">Demo Mode Active</h3>
              <p className="text-sm text-gray-400 mono">
                Choose from these demo accounts to explore the dashboard
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
              <div className="bg-med-gray minimal-border p-4 rounded-lg">
                <div className="font-semibold text-fluorescent-green mb-2 mono">Admin Account</div>
                <div className="space-y-1">
                  <div className="mono text-white text-xs">admin@hackerhouse.dev</div>
                  <div className="mono text-white text-xs">admin123</div>
                  <div className="text-xs text-gray-400 mt-2 mono">Full admin access</div>
                </div>
              </div>
              
              <div className="bg-med-gray minimal-border p-4 rounded-lg">
                <div className="font-semibold text-fluorescent-green mb-2 mono">TV Display</div>
                <div className="space-y-1">
                  <div className="mono text-white text-xs">tv@hackerhouse.dev</div>
                  <div className="mono text-white text-xs">tv123</div>
                  <div className="text-xs text-gray-400 mt-2 mono">Perfect for TV screens</div>
                </div>
              </div>
              
              <div className="bg-med-gray minimal-border p-4 rounded-lg">
                <div className="font-semibold text-fluorescent-green mb-2 mono">Builder (Alice)</div>
                <div className="space-y-1">
                  <div className="mono text-white text-xs">alice@hackerhouse.dev</div>
                  <div className="mono text-white text-xs">demo123</div>
                  <div className="text-xs text-gray-400 mt-2 mono">Top coder</div>
                </div>
              </div>
              
              <div className="bg-med-gray minimal-border p-4 rounded-lg">
                <div className="font-semibold text-fluorescent-green mb-2 mono">Business Dev</div>
                <div className="space-y-1">
                  <div className="mono text-white text-xs">bob@hackerhouse.dev</div>
                  <div className="mono text-white text-xs">demo123</div>
                  <div className="text-xs text-gray-400 mt-2 mono">Partnership lead</div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 bg-black/30 minimal-border rounded-lg p-3 mono">
              💡 pro tip: use the tv account for fullscreen display mode on lounge tvs
            </div>
          </div>
        )}
      </div>
    </div>
  )
}