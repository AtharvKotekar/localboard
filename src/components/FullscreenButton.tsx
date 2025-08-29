'use client'

import { useState, useEffect } from 'react'

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
    }
  }

  return (
    <button
      onClick={toggleFullscreen}
      className="
        fixed top-6 right-6 z-50 
        flex items-center space-x-3 px-4 py-3 
        bg-cyber-surface/80 backdrop-blur-lg border border-border-color 
        rounded-xl text-text-secondary hover:text-neon-cyan 
        hover:border-neon-cyan/30 hover:bg-cyber-blue/10
        transition-all duration-300 group
      "
      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (Perfect for TV displays)'}
    >
      <span className="text-lg">
        {isFullscreen ? '⛶' : '📺'}
      </span>
      <span className="text-sm font-semibold">
        {isFullscreen ? 'Exit TV Mode' : 'TV Mode'}
      </span>
    </button>
  )
}