'use client'

import Dashboard from '@/components/Dashboard'
import FullscreenButton from '@/components/FullscreenButton'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <FullscreenButton />
      <Dashboard />
    </main>
  )
}