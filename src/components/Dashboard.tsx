'use client'

import { useState } from 'react'
import CountdownTab from './tabs/CountdownTab'
import LeaderboardTab from './tabs/LeaderboardTab'
import FeedTab from './tabs/FeedTab'
import AboutTab from './tabs/AboutTab'

const tabs = [
  { id: 'countdown', name: 'countdown', icon: '◷' },
  { id: 'leaderboard', name: 'leaderboard', icon: '◊' },
  { id: 'feed', name: 'feed', icon: '◈' },
  { id: 'about', name: 'about', icon: '◉' },
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
    <div className="min-h-screen bg-black text-white">
      {/* Header with Navigation */}
      <header className="border-b border-gray-600 bg-dark-gray/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-fluorescent-green flex items-center justify-center">
                <span className="text-xl font-bold text-black mono">l</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold mono text-white">
                  localboard
                </h1>
                <p className="text-sm text-gray-400 font-medium">building the future, one sprint at a time</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-fluorescent-green mono">demo day sprint</p>
                <p className="text-xs text-gray-400">oct 4, 2025 • 8:00 pm</p>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <nav className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-3 px-6 py-3 rounded-lg font-medium mono
                  transition-all duration-200 border
                  ${
                    activeTab === tab.id
                      ? 'bg-fluorescent-green/10 text-fluorescent-green border-fluorescent-green/30 glow'
                      : 'bg-med-gray text-gray-400 border-gray-600 hover:bg-fluorescent-green/5 hover:text-fluorescent-green hover:border-fluorescent-green/20'
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
        <div className="fade-in">
          {renderTabContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-600 bg-dark-gray/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded bg-fluorescent-green flex items-center justify-center">
                <span className="text-xs font-bold text-black mono">l</span>
              </div>
              <p className="text-sm text-gray-400">
                crafted with precision by <span className="text-fluorescent-green font-semibold mono">atharv</span>
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-400 mono">
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