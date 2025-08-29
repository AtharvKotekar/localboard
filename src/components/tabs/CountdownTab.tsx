'use client'

import { useState, useEffect } from 'react'

const founderQuotes = [
  { quote: "move fast and break things. unless you are breaking stuff, you are not moving fast enough", author: "mark zuckerberg" },
  { quote: "the biggest risk is not taking any risk... in a world that is changing quickly, the only strategy that is guaranteed to fail is not taking risks", author: "mark zuckerberg" },
  { quote: "when something is important enough, you do it even if the odds are not in your favor", author: "elon musk" },
  { quote: "i think it is possible for ordinary people to choose to be extraordinary", author: "elon musk" },
  { quote: "innovation distinguishes between a leader and a follower", author: "steve jobs" },
  { quote: "your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work", author: "steve jobs" },
  { quote: "competition is for losers. if you want to create and capture lasting value, look to build a monopoly", author: "peter thiel" },
  { quote: "the most contrarian thing of all is not to oppose the crowd but to think for yourself", author: "peter thiel" },
  { quote: "a startup is a company designed to grow fast", author: "paul graham" },
  { quote: "the way to get startup ideas is not to try to think of startup ideas. it's to look for problems", author: "paul graham" },
  { quote: "if you are not embarrassed by the first version of your product, you've launched too late", author: "reid hoffman" },
  { quote: "starting a company is like jumping off a cliff and assembling a plane on the way down", author: "reid hoffman" }
]

export default function CountdownTab() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Demo Day: October 4th, 2025 at 8:00 PM
  const demoDayDate = new Date(process.env.NEXT_PUBLIC_DEMO_DAY_DATE || '2025-10-04T20:00:00')

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

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
      setCurrentQuote((prev) => (prev + 1) % founderQuotes.length)
    }, 8000) // Change quote every 8 seconds for better readability

    return () => clearInterval(quoteTimer)
  }, [])

  if (isFullscreen) {
    // TV Mode - Minimal layout with no scrolling
    return (
      <div className="tv-mode">
        <div className="text-center">
          {/* Header */}
          <div className="tv-header mb-16">
            <h2 className="tv-countdown-number text-7xl md:text-9xl font-light mono mb-8 text-white glow-text">
              Demo Day
            </h2>
            <div className="text-2xl text-fluorescent-green mono glow-text">October 4th, 2025 • 8:00 PM</div>
          </div>
          
          {/* Ultra-Professional TV Countdown Grid */}
          <div className="tv-countdown-grid grid grid-cols-4 gap-16 mb-20">
            {[
              { label: 'days', value: timeLeft.days, unit: 'd' },
              { label: 'hours', value: timeLeft.hours, unit: 'h' },
              { label: 'minutes', value: timeLeft.minutes, unit: 'm' },
              { label: 'seconds', value: timeLeft.seconds, unit: 's' }
            ].map((item, index) => (
              <div key={item.label} className="text-center relative">
                <div className="relative">
                  <div className="tv-countdown-number text-8xl md:text-9xl font-extralight mono text-white mb-4 tracking-tighter">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="absolute -top-4 -right-4 text-lg mono text-fluorescent-green opacity-60">
                    {item.unit}
                  </div>
                </div>
                <div className="text-sm font-light text-gray-500 uppercase tracking-[0.3em] mono">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Founder Quote - TV optimized */}
          <div className="tv-quote-section">
            <div className="max-w-5xl mx-auto text-center">
              <div className="text-2xl md:text-3xl font-light text-white leading-relaxed mono mb-4">
                "{founderQuotes[currentQuote].quote}"
              </div>
              <div className="text-lg text-fluorescent-green mono opacity-80">
                — {founderQuotes[currentQuote].author}
              </div>
            </div>
          </div>
          
          {/* Exit TV Mode Button */}
          <button
            onClick={() => document.exitFullscreen()}
            className="absolute top-6 right-6 px-3 py-2 text-xs mono text-gray-400 hover:text-fluorescent-green border border-gray-600 hover:border-fluorescent-green/50 rounded-md transition-all duration-200"
          >
            exit tv
          </button>
        </div>
      </div>
    )
  }

  // Regular Mode - Full layout
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] space-y-12 px-4 matrix-bg">
      {/* Main Countdown Display */}
      <div className="text-center max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-6xl md:text-8xl font-light mono mb-6 text-white glow-text">
            Demo Day
          </h2>
          <div className="text-xl text-fluorescent-green mb-3 mono">October 4th, 2025 • 8:00 PM</div>
          <div className="text-base text-gray-400 mono">The moment we've been building towards</div>
        </div>
        
        {/* Ultra-Professional Countdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-20">
          {[
            { label: 'days', value: timeLeft.days, unit: 'd' },
            { label: 'hours', value: timeLeft.hours, unit: 'h' },
            { label: 'minutes', value: timeLeft.minutes, unit: 'm' },
            { label: 'seconds', value: timeLeft.seconds, unit: 's' }
          ].map((item, index) => (
            <div
              key={item.label}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-black/90 to-black/60 backdrop-blur-xl border border-gray-800 hover:border-fluorescent-green/30 rounded-2xl p-8 transition-all duration-500 hover:scale-105 shadow-2xl">
                <div className="relative">
                  <div className="text-5xl md:text-7xl font-extralight mono text-white mb-2 tracking-tighter">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="absolute -top-2 -right-2 text-xs mono text-fluorescent-green opacity-60">
                    {item.unit}
                  </div>
                </div>
                <div className="text-xs font-light text-gray-500 uppercase tracking-[0.2em] mono">
                  {item.label}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-fluorescent-green/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Sprint Info */}
        <div className="bg-black/60 backdrop-blur-sm minimal-border rounded-lg p-8 max-w-4xl mx-auto mb-12">
          <div className="text-center">
            <h3 className="text-2xl font-light mono text-fluorescent-green mb-4 glow-text">
              the final sprint
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg mono">
              20 builders, countless late nights, and one shared mission: transform ambitious ideas into reality.
            </p>
          </div>
        </div>
      </div>

      {/* Founder Quote */}
      <div className="text-center max-w-4xl mx-auto">
        <div className="bg-black/40 backdrop-blur-sm minimal-border rounded-lg p-8 mb-8">
          <div className="text-xl md:text-2xl font-light text-white mb-4 leading-relaxed mono">
            "{founderQuotes[currentQuote].quote}"
          </div>
          <div className="text-sm text-fluorescent-green mono opacity-80 mb-6">
            — {founderQuotes[currentQuote].author}
          </div>
          <div className="flex justify-center space-x-2">
            {founderQuotes.map((_, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full transition-all duration-500
                  ${index === currentQuote ? 'bg-fluorescent-green glow' : 'bg-gray-600'}
                `}
              />
            ))}
          </div>
        </div>
        
        {/* Ultra-Professional Music Player */}
        <div className="bg-gradient-to-r from-black/30 to-black/20 backdrop-blur-xl minimal-border rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  const audio = document.getElementById('background-music') as HTMLAudioElement
                  if (audio.paused) {
                    audio.play()
                    setIsPlaying(true)
                  } else {
                    audio.pause()
                    setIsPlaying(false)
                  }
                }}
                className="w-12 h-12 bg-fluorescent-green/10 hover:bg-fluorescent-green/20 border border-fluorescent-green/30 hover:border-fluorescent-green/60 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
              >
                <div className="w-0 h-0 ml-1" style={{
                  borderLeft: isPlaying ? 'none' : '6px solid #39ff14',
                  borderTop: isPlaying ? '4px solid #39ff14' : '4px solid transparent',
                  borderBottom: isPlaying ? '4px solid #39ff14' : '4px solid transparent',
                  borderRight: isPlaying ? '4px solid #39ff14' : 'none',
                  width: isPlaying ? '3px' : '0',
                  height: isPlaying ? '12px' : '0'
                }}></div>
              </button>
              <div>
                <div className="text-sm mono text-white font-light">in motion</div>
                <div className="text-xs mono text-fluorescent-green/70">trent reznor</div>
              </div>
            </div>
            <div className="text-xs mono text-gray-500 uppercase tracking-wider">
              social network ost
            </div>
          </div>
          <audio id="background-music" loop>
            <source src="https://www.soundjay.com/misc/sounds/beep-07a.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="relative">
        <div className="w-32 h-32 relative">
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-gray-600"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.max(0, (Date.now() - new Date('2025-08-29').getTime()) / (demoDayDate.getTime() - new Date('2025-08-29').getTime())))}`}
              className="text-fluorescent-green glow transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-light text-fluorescent-green mono glow-text">
              {Math.round(Math.max(0, (Date.now() - new Date('2025-08-29').getTime()) / (demoDayDate.getTime() - new Date('2025-08-29').getTime()) * 100))}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}