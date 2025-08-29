'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import LoginPage from './LoginPage'
import SignUpPage from './SignUpPage'
import UserPortal from '../UserPortal'

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, profile, loading } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-neon-green/30 border-t-neon-green rounded-full mx-auto mb-4"></div>
          <p className="text-neon-green cyber-glow">Loading Hacker House...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return isSignUp ? (
      <SignUpPage onToggleMode={() => setIsSignUp(false)} />
    ) : (
      <LoginPage onToggleMode={() => setIsSignUp(true)} />
    )
  }

  return <>{children}</>
}

// User profile header component for authenticated users
export function UserProfileHeader() {
  const { profile, signOut } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUserPortal, setShowUserPortal] = useState(false)

  if (!profile) return null

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'coder': return '💻'
      case 'biz': return '💼'
      case 'design': return '🎨'
      case 'content': return '📱'
      default: return '🚀'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 p-2 rounded-lg bg-cyber-blue/20 border border-neon-green/30 hover:bg-cyber-blue/30 transition-all duration-200"
      >
        <span className="text-xl">{getRoleIcon(profile.role)}</span>
        <div className="text-left">
          <div className="text-sm font-semibold text-neon-cyan">{profile.name}</div>
          <div className="text-xs text-neon-green/70">{profile.role}</div>
        </div>
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 cyber-border rounded-lg bg-cyber-darker/95 backdrop-blur-sm z-50">
          <div className="p-4">
            <div className="mb-4">
              <h3 className="font-semibold text-neon-green">{profile.name}</h3>
              <p className="text-xs text-neon-green/70">{profile.email}</p>
              {profile.tagline && (
                <p className="text-sm text-neon-cyan mt-1">"{profile.tagline}"</p>
              )}
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={() => {
                  setShowUserPortal(true)
                  setShowDropdown(false)
                }}
                className="w-full text-left p-2 rounded hover:bg-cyber-blue/20 text-neon-green transition-colors duration-200"
              >
                📊 My Dashboard
              </button>
              <button 
                onClick={() => {
                  setShowUserPortal(true)
                  setShowDropdown(false)
                }}
                className="w-full text-left p-2 rounded hover:bg-cyber-blue/20 text-neon-cyan transition-colors duration-200"
              >
                🚀 Log Progress
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-cyber-blue/20 text-neon-green transition-colors duration-200">
                ⚙️ Settings
              </button>
              {profile.is_admin && (
                <button className="w-full text-left p-2 rounded hover:bg-cyber-blue/20 text-neon-pink transition-colors duration-200">
                  🛠️ Admin Panel
                </button>
              )}
              <hr className="border-neon-green/20" />
              <button
                onClick={() => {
                  signOut()
                  setShowDropdown(false)
                }}
                className="w-full text-left p-2 rounded hover:bg-red-500/20 text-red-300 transition-colors duration-200"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
      
      <UserPortal
        isOpen={showUserPortal}
        onClose={() => setShowUserPortal(false)}
      />
    </div>
  )
}