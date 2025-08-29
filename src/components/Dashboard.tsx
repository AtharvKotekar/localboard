'use client'

import { useState } from 'react'
import CountdownTab from './tabs/CountdownTab'
import LeaderboardTab from './tabs/LeaderboardTab'
import FeedTab from './tabs/FeedTab'
import AboutTab from './tabs/AboutTab'
import { UserProfileHeader } from './auth/AuthWrapper'

const tabs = [
  { id: 'countdown', name: 'Countdown', icon: '⏱️' },
  { id: 'leaderboard', name: 'Leaderboard', icon: '🏆' },
  { id: 'feed', name: 'Feed', icon: '📡' },
  { id: 'about', name: 'About', icon: 'ℹ️' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('countdown')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'countdown':
        return <CountdownTab />
      case 'leaderboard':
        return <LeaderboardTab />
      case 'feed':
        return <FeedTab />
      case 'about':
        return <AboutTab />
      default:
        return <CountdownTab />
    }
  }

  return (
    <div className="min-h-screen bg-cyber-dark text-text-primary">
      {/* Header with Navigation */}
      <header className="border-b border-border-color bg-cyber-surface/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center">
                <span className="text-xl font-bold text-cyber-dark">H</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold font-display text-text-primary">
                  Hacker House
                </h1>
                <p className="text-sm text-text-muted font-medium">Building the future, one sprint at a time</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-neon-cyan">Demo Day Sprint</p>
                <p className="text-xs text-text-muted">Oct 4, 2025 • 8:00 PM</p>
              </div>
              <UserProfileHeader />
            </div>
          </div>
          
          {/* Tab Navigation */}
          <nav className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-3 px-6 py-3 rounded-xl font-medium
                  transition-all duration-200 border
                  ${
                    activeTab === tab.id
                      ? 'bg-cyber-blue/20 text-neon-cyan border-neon-cyan/30 shadow-lg shadow-neon-cyan/10'
                      : 'bg-cyber-darker/40 text-text-secondary border-border-color hover:bg-cyber-blue/10 hover:text-neon-cyan hover:border-neon-cyan/20'
                  }
                `}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="font-semibold">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Tab Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="animate-slide-up">
          {renderTabContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-color bg-cyber-surface/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center">
                <span className="text-xs font-bold text-cyber-dark">H</span>
              </div>
              <p className="text-sm text-text-muted">
                Crafted with precision by <span className="text-neon-cyan font-semibold">Atharv</span>
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs text-text-muted">
              <span>Demo Day: Oct 4, 2025</span>
              <span>•</span>
              <span>20 Builders Strong</span>
              <span>•</span>
              <span>Building in Public</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}