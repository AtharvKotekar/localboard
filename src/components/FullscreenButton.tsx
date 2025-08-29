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
        bg-black/80 backdrop-blur-lg minimal-border 
        rounded-lg text-gray-400 hover:text-fluorescent-green 
        hover:border-fluorescent-green/50 hover:bg-fluorescent-green/5
        transition-all duration-300 group mono
      "
      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (Perfect for TV displays)'}
    >
      <span className="text-lg mono">
        {isFullscreen ? '◱' : '◰'}
      </span>
      <span className="text-sm font-semibold mono">
        {isFullscreen ? 'exit tv mode' : 'tv mode'}
      </span>
    </button>
  )
}