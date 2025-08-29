'use client'

import { useState, useEffect } from 'react'

// Mock stats data
const houseStats = {
  totalBuilders: 20,
  totalPoints: 1425,
  totalPosts: 47,
  dailyCheckins: 186,
  projectsShipped: 12,
  linesOfCode: 24780,
  partnerships: 8,
  contentCreated: 34,
  designsDelivered: 18,
  demoDay: new Date('2025-10-18'),
  startDate: new Date('2025-08-29')
}

export default function AboutTab() {
  const [animatedStats, setAnimatedStats] = useState({
    totalPoints: 0,
    linesOfCode: 0,
    dailyCheckins: 0
  })

  // Animate numbers on load
  useEffect(() => {
    const animateNumber = (target: number, setter: (value: number) => void) => {
      let current = 0
      const increment = target / 100
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setter(target)
          clearInterval(timer)
        } else {
          setter(Math.floor(current))
        }
      }, 20)
    }

    animateNumber(houseStats.totalPoints, (value) => 
      setAnimatedStats(prev => ({ ...prev, totalPoints: value }))
    )
    animateNumber(houseStats.linesOfCode, (value) => 
      setAnimatedStats(prev => ({ ...prev, linesOfCode: value }))
    )
    animateNumber(houseStats.dailyCheckins, (value) => 
      setAnimatedStats(prev => ({ ...prev, dailyCheckins: value }))
    )
  }, [])

  const daysSinceStart = Math.floor((Date.now() - houseStats.startDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysUntilDemo = Math.floor((houseStats.demoDay.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold font-display cyber-glow mb-4">
          ℹ️ ABOUT HACKER HOUSE
        </h2>
        <p className="text-xl text-neon-cyan max-w-3xl mx-auto leading-relaxed">
          This is the Hacker House Dashboard — 20 builders, 50 days, 1 demo day. 
          A digital accountability board that tracks progress, celebrates wins, and keeps the hype alive.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="cyber-border rounded-lg p-8 bg-gradient-to-br from-cyber-blue/20 to-neon-purple/10 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-neon-pink cyber-glow mb-4">
          🎯 Our Mission
        </h3>
        <p className="text-neon-green/90 text-lg leading-relaxed">
          Transform ambitious ideas into shipped products through accountability, collaboration, and relentless execution. 
          Every line of code, every design, every deal, and every piece of content brings us closer to demo day.
        </p>
      </div>

      {/* House Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Builders', 
            value: houseStats.totalBuilders, 
            icon: '👥', 
            color: 'neon-cyan',
            animated: false
          },
          { 
            label: 'Total Points', 
            value: animatedStats.totalPoints, 
            icon: '⭐', 
            color: 'neon-green',
            animated: true
          },
          { 
            label: 'Projects Shipped', 
            value: houseStats.projectsShipped, 
            icon: '🚀', 
            color: 'neon-purple',
            animated: false
          },
          { 
            label: 'Lines of Code', 
            value: animatedStats.linesOfCode, 
            icon: '💻', 
            color: 'neon-pink',
            animated: true
          },
          { 
            label: 'Partnerships', 
            value: houseStats.partnerships, 
            icon: '🤝', 
            color: 'neon-cyan',
            animated: false
          },
          { 
            label: 'Content Pieces', 
            value: houseStats.contentCreated, 
            icon: '📝', 
            color: 'neon-green',
            animated: false
          },
          { 
            label: 'Daily Check-ins', 
            value: animatedStats.dailyCheckins, 
            icon: '✅', 
            color: 'neon-purple',
            animated: true
          },
          { 
            label: 'Designs Delivered', 
            value: houseStats.designsDelivered, 
            icon: '🎨', 
            color: 'neon-pink',
            animated: false
          }
        ].map((stat, index) => (
          <div 
            key={index}
            className="cyber-border rounded-lg p-4 text-center bg-cyber-darker/30 hover:bg-cyber-blue/10 transition-all duration-300"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-bold text-${stat.color} cyber-glow`}>
              {stat.value.toLocaleString()}
            </div>
            <div className="text-xs text-neon-green/70">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Progress Timeline */}
      <div className="cyber-border rounded-lg p-6 bg-cyber-darker/20 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-neon-cyan cyber-glow mb-4">
          📅 Sprint Progress
        </h3>
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-neon-green">{daysSinceStart}</div>
            <div className="text-xs text-neon-green/70">Days In</div>
          </div>
          <div className="flex-grow mx-6">
            <div className="bg-cyber-gray/30 rounded-full h-3 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-neon-green to-neon-cyan h-full rounded-full transition-all duration-1000 animate-pulse-neon"
                style={{ width: `${(daysSinceStart / 50) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {Math.round((daysSinceStart / 50) * 100)}%
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-neon-pink">{daysUntilDemo}</div>
            <div className="text-xs text-neon-green/70">Days Left</div>
          </div>
        </div>
        <p className="text-center text-neon-green/70 text-sm">
          Started: {houseStats.startDate.toLocaleDateString()} • Demo Day: {houseStats.demoDay.toLocaleDateString()}
        </p>
      </div>

      {/* Technology Stack */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="cyber-border rounded-lg p-6 bg-cyber-darker/20">
          <h3 className="text-xl font-bold text-neon-pink cyber-glow mb-4">
            🛠️ Tech Stack
          </h3>
          <div className="space-y-2">
            {[
              { name: 'Next.js 14', description: 'React framework with App Router' },
              { name: 'TypeScript', description: 'Type-safe development' },
              { name: 'Tailwind CSS', description: 'Utility-first styling' },
              { name: 'Supabase', description: 'Backend & real-time database' },
              { name: 'Vercel', description: 'Deployment & hosting' }
            ].map((tech, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded bg-cyber-blue/10">
                <span className="text-neon-green">✅</span>
                <div>
                  <div className="font-medium text-neon-cyan">{tech.name}</div>
                  <div className="text-xs text-neon-green/70">{tech.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cyber-border rounded-lg p-6 bg-cyber-darker/20">
          <h3 className="text-xl font-bold text-neon-purple cyber-glow mb-4">
            🏆 Scoring System
          </h3>
          <div className="space-y-2 text-sm">
            {[
              { role: 'Coders', points: '5 commits = 10pts, 1 feature = 20pts' },
              { role: 'Business', points: '1 partnership = 20pts, 1 customer = 30pts' },
              { role: 'Creators', points: '1 video/blog = 15pts, 1 thread = 10pts' },
              { role: 'Designers', points: '1 prototype = 15pts, 1 design = 25pts' },
              { role: 'Everyone', points: 'Daily check-in = 5pts' }
            ].map((rule, index) => (
              <div key={index} className="p-2 rounded bg-cyber-blue/10">
                <div className="font-medium text-neon-cyan">{rule.role}</div>
                <div className="text-neon-green/70">{rule.points}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code & Links */}
      <div className="cyber-border rounded-lg p-8 bg-gradient-to-r from-neon-green/10 to-neon-cyan/10 backdrop-blur-sm text-center">
        <h3 className="text-xl font-bold text-neon-green cyber-glow mb-6">
          📱 Connect & Contribute
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6 items-center">
          {/* QR Code Placeholder */}
          <div className="flex flex-col items-center">
            <div className="cyber-border rounded-lg p-6 bg-white flex items-center justify-center w-32 h-32 mb-4">
              <div className="text-6xl">📱</div>
            </div>
            <p className="text-sm text-neon-green/70">Scan for GitHub Repo</p>
          </div>
          
          {/* Links */}
          <div className="md:col-span-2 space-y-3">
            {[
              { label: '🐙 GitHub Repository', url: 'https://github.com/atharv/hacker-house-dashboard' },
              { label: '👤 Built by Atharv', url: 'https://github.com/atharv' },
              { label: '🏠 Hacker House Website', url: 'https://hackerhouse.dev' },
              { label: '📧 Submit Feedback', url: 'mailto:feedback@hackerhouse.dev' }
            ].map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 cyber-border rounded-lg bg-cyber-blue/20 hover:bg-cyber-blue/30 transition-all duration-300 text-neon-cyan hover:text-neon-green cyber-glow"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Credits */}
      <div className="text-center cyber-border rounded-lg p-6 bg-gradient-to-r from-neon-pink/10 to-neon-purple/10">
        <p className="text-lg text-neon-pink cyber-glow mb-2">
          Made with ❤️ by your boy <strong>Atharv</strong>
        </p>
        <p className="text-sm text-neon-green/70">
          Crafted during late-night coding sessions fueled by coffee, determination, and the hacker spirit.
        </p>
      </div>
    </div>
  )
}