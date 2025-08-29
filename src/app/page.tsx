'use client'

import Dashboard from '@/components/Dashboard'
import FullscreenButton from '@/components/FullscreenButton'
import AuthWrapper from '@/components/auth/AuthWrapper'

export default function Home() {
  return (
    <AuthWrapper>
      <main className="min-h-screen bg-cyber-dark">
        <FullscreenButton />
        <Dashboard />
      </main>
    </AuthWrapper>
  )
}