'use client'

import { useState, useEffect } from 'react'

const inspirationalQuotes = [
  "Move fast, ship things, stay accountable",
  "Code is poetry, bugs are just rough drafts",
  "Build something people want, not what you think they need",
  "Fail fast, learn faster, iterate always",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Your limitation—it's only your imagination",
  "Great things never come from comfort zones",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it",
  "The harder you work for something, the greater you'll feel when you achieve it"
]

export default function CountdownTab() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [currentQuote, setCurrentQuote] = useState(0)

  // Demo Day: October 4th, 2025 at 8:00 PM
  const demoDayDate = new Date(process.env.NEXT_PUBLIC_DEMO_DAY_DATE || '2025-10-04T20:00:00')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = demoDayDate.getTime() - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [demoDayDate])

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length)
    }, 5000) // Change quote every 5 seconds

    return () => clearInterval(quoteTimer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-16 px-4">
      {/* Main Countdown Display */}
      <div className="text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-5xl md:text-7xl font-bold font-display mb-4 text-text-primary">
            Demo Day
          </h2>
          <div className="text-lg text-text-secondary mb-2">October 4th, 2025 • 8:00 PM</div>
          <div className="text-sm text-text-muted">The moment we've been building towards</div>
        </div>
        
        {/* Countdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {[
            { label: 'Days', value: timeLeft.days, color: 'neon-green' },
            { label: 'Hours', value: timeLeft.hours, color: 'neon-cyan' },
            { label: 'Minutes', value: timeLeft.minutes, color: 'neon-pink' },
            { label: 'Seconds', value: timeLeft.seconds, color: 'neon-purple' }
          ].map((item, index) => (
            <div
              key={item.label}
              className="relative group"
            >
              <div className="bg-cyber-surface/80 backdrop-blur-sm border border-border-color rounded-2xl p-6 hover:border-neon-cyan/30 transition-all duration-300">
                <div className={`countdown-number text-3xl md:text-5xl font-bold text-${item.color} mb-2`}>
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm font-medium text-text-muted uppercase tracking-wide">
                  {item.label}
                </div>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Sprint Info */}
        <div className="bg-cyber-surface/60 backdrop-blur-sm border border-border-color rounded-2xl p-8 max-w-3xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-bold text-text-primary mb-3">
              The Final Sprint
            </h3>
            <p className="text-text-secondary leading-relaxed">
              20 builders, countless late nights, and one shared mission: transform ambitious ideas into reality. 
              This is where innovation meets execution.
            </p>
          </div>
        </div>
      </div>

      {/* Inspirational Quote */}
      <div className="text-center max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-cyber-surface/80 to-cyber-blue/20 backdrop-blur-sm border border-border-color rounded-2xl p-8">
          <div className="text-xl md:text-2xl font-medium text-text-primary mb-6 leading-relaxed">
            "{inspirationalQuotes[currentQuote]}"
          </div>
          <div className="flex justify-center space-x-2">
            {inspirationalQuotes.map((_, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full transition-all duration-500
                  ${index === currentQuote ? 'bg-neon-cyan' : 'bg-text-muted/40'}
                `}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="relative">
        <div className="w-24 h-24 relative">
          {/* Background circle */}
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-border-color"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.max(0, (Date.now() - new Date('2025-08-29').getTime()) / (demoDayDate.getTime() - new Date('2025-08-29').getTime())))}`}
              className="text-neon-green transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-neon-green">
              {Math.round(Math.max(0, (Date.now() - new Date('2025-08-29').getTime()) / (demoDayDate.getTime() - new Date('2025-08-29').getTime()) * 100))}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}