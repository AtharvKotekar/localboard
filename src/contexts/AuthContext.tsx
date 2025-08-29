'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { User as DatabaseUser } from '@/types/database'

interface AuthContextType {
  user: User | null
  profile: DatabaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: { name: string; role: string; tagline?: string }) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Demo users for demo mode
const demoUsers = [
  {
    id: 'demo-admin',
    email: 'admin@hackerhouse.dev',
    password: 'admin123',
    name: 'Admin User',
    role: 'misc',
    tagline: 'Managing the house like a boss',
    is_admin: true,
    avatar_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'demo-alice',
    email: 'alice@hackerhouse.dev',
    password: 'demo123',
    name: 'Alice Chen',
    role: 'coder',
    tagline: 'Full-stack wizard building the next unicorn',
    is_admin: false,
    avatar_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'demo-tv',
    email: 'tv@hackerhouse.dev',
    password: 'tv123',
    name: 'TV Display',
    role: 'misc',
    tagline: 'Showing house stats 24/7',
    is_admin: false,
    avatar_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<DatabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  const refreshProfile = async () => {
    if (user && !isDemo) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (!error && data) {
          setProfile(data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
  }

  useEffect(() => {
    if (isDemo) {
      // In demo mode, start with loading false and no user
      setLoading(false)
      return
    }

    // Get initial session (only in production mode)
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await refreshProfile()
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes (only in production mode)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await refreshProfile()
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      if (isDemo) {
        // Demo mode authentication
        const demoUser = demoUsers.find(u => u.email === email && u.password === password)
        
        if (!demoUser) {
          return { error: { message: 'Invalid email or password' } }
        }

        // Mock Supabase user object
        const mockUser = {
          id: demoUser.id,
          email: demoUser.email,
          created_at: demoUser.created_at
        }

        setUser(mockUser as User)
        setProfile(demoUser as DatabaseUser)
        
        return { error: null }
      }

      // Production mode authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, userData: { name: string; role: string; tagline?: string }) => {
    try {
      if (isDemo) {
        // In demo mode, just create a temporary user
        const newUser = {
          id: `demo-${Date.now()}`,
          email,
          name: userData.name,
          role: userData.role as any,
          tagline: userData.tagline || '',
          is_admin: false,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const mockUser = {
          id: newUser.id,
          email: newUser.email,
          created_at: newUser.created_at
        }

        setUser(mockUser as User)
        setProfile(newUser as DatabaseUser)
        
        return { error: null }
      }

      // Production mode signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) return { error }

      // Create user profile if signup successful
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: email,
            name: userData.name,
            role: userData.role as any,
            tagline: userData.tagline || '',
            is_admin: false
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
          return { error: profileError }
        }
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      if (!isDemo) {
        await supabase.auth.signOut()
      }
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}