'use client'

import { useState, useEffect } from 'react'

// Mock data for demonstration
const mockPosts = [
  {
    id: 1,
    author: 'Alice Chen',
    avatar: '👩‍💻',
    source: 'twitter',
    content: 'Just shipped the user authentication system! 🚀 Clean code, secure implementation, and ready for production. #HackerHouse #BuildInPublic',
    link: 'https://twitter.com/alice/status/123',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 42,
    retweets: 12
  },
  {
    id: 2,
    author: 'Bob Martinez',
    avatar: '👨‍💼',
    source: 'manual',
    content: 'Closed our biggest partnership deal yet! TechCorp is now officially on board. This will accelerate our growth by 10x. Excited for what\'s ahead! 💼',
    link: 'https://linkedin.com/bob/post/456',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 28,
    retweets: 8
  },
  {
    id: 3,
    author: 'Clara Johnson',
    avatar: '🎨',
    source: 'twitter',
    content: 'Mobile app redesign is complete! Clean, intuitive, and absolutely beautiful. User testing shows 40% improvement in task completion rates 📱✨ #UXDesign',
    link: 'https://twitter.com/clara/status/789',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    likes: 56,
    retweets: 18
  },
  {
    id: 4,
    author: 'David Kim',
    avatar: '📝',
    source: 'twitter',
    content: 'My latest thread on "Building in Public vs Building in Stealth" just hit 10K views! The community response has been incredible. Link in bio 🧵',
    link: 'https://twitter.com/david/status/012',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    likes: 89,
    retweets: 34
  },
  {
    id: 5,
    author: 'Eva Rodriguez',
    avatar: '💻',
    source: 'manual',
    content: 'Backend optimization complete! API response times improved by 80%. From 2.5s to 0.5s average response time. Performance matters! ⚡',
    link: 'https://github.com/eva/performance-boost',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    likes: 33,
    retweets: 9
  }
]

export default function FeedTab() {
  const [posts, setPosts] = useState(mockPosts)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const timeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'twitter': return '🐦'
      case 'instagram': return '📷'
      case 'linkedin': return '💼'
      case 'manual': return '📡'
      default: return '🌐'
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'twitter': return 'text-blue-400'
      case 'instagram': return 'text-pink-400'
      case 'linkedin': return 'text-blue-600'
      case 'manual': return 'text-neon-green'
      default: return 'text-neon-cyan'
    }
  }

  const refreshFeed = async () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
      // In real implementation, this would fetch new posts
    }, 2000)
  }

  useEffect(() => {
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      refreshFeed()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-4xl font-bold font-display cyber-glow mb-2">
            📡 COMMUNITY FEED
          </h2>
          <p className="text-neon-green/70">
            Latest updates from the Hacker House builders
          </p>
        </div>
        
        {/* Refresh Button */}
        <button
          onClick={refreshFeed}
          disabled={isRefreshing}
          className={`
            px-6 py-3 cyber-border rounded-lg font-medium transition-all duration-300
            ${isRefreshing 
              ? 'bg-cyber-gray/20 text-neon-green/50 cursor-not-allowed' 
              : 'bg-neon-green/10 text-neon-green hover:bg-neon-green/20 cyber-glow'
            }
          `}
        >
          {isRefreshing ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-neon-green/30 border-t-neon-green rounded-full"></div>
              <span>Refreshing...</span>
            </div>
          ) : (
            '🔄 Refresh Feed'
          )}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: posts.length, color: 'neon-cyan' },
          { label: 'Total Likes', value: posts.reduce((sum, p) => sum + p.likes, 0), color: 'neon-pink' },
          { label: 'Total Shares', value: posts.reduce((sum, p) => sum + p.retweets, 0), color: 'neon-green' },
          { label: 'Active Today', value: posts.filter(p => Date.now() - p.timestamp.getTime() < 24 * 60 * 60 * 1000).length, color: 'neon-purple' },
        ].map((stat, index) => (
          <div key={index} className="cyber-border rounded-lg p-4 text-center bg-cyber-darker/20">
            <div className={`text-xl font-bold text-${stat.color} cyber-glow`}>
              {stat.value}
            </div>
            <div className="text-xs text-neon-green/70">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="cyber-border rounded-lg p-6 bg-cyber-darker/30 backdrop-blur-sm hover:bg-cyber-blue/10 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{post.avatar}</div>
                <div>
                  <h3 className="font-bold cyber-glow">{post.author}</h3>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className={`${getSourceColor(post.source)}`}>
                      {getSourceIcon(post.source)} {post.source}
                    </span>
                    <span className="text-neon-green/50">•</span>
                    <span className="text-neon-green/70">{timeAgo(post.timestamp)}</span>
                  </div>
                </div>
              </div>
              
              {/* External Link */}
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-cyan hover:text-neon-green transition-colors duration-200"
                title="View original post"
              >
                🔗
              </a>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-neon-green/90 leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Post Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center space-x-1 text-neon-pink">
                  <span>❤️</span>
                  <span>{post.likes}</span>
                </span>
                <span className="flex items-center space-x-1 text-neon-cyan">
                  <span>🔄</span>
                  <span>{post.retweets}</span>
                </span>
              </div>
              
              <div className="text-xs text-neon-green/50">
                #{post.id.toString().padStart(3, '0')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <button className="px-8 py-3 cyber-border rounded-lg bg-cyber-blue/20 text-neon-green hover:bg-cyber-blue/30 transition-all duration-300 cyber-glow">
          📡 Load More Posts
        </button>
      </div>

      {/* Integration Info */}
      <div className="cyber-border rounded-lg p-6 bg-gradient-to-r from-cyber-darker/50 to-cyber-blue/20 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-neon-cyan mb-2">
          🔧 Feed Integration
        </h3>
        <p className="text-neon-green/70 text-sm mb-3">
          Auto-syncing posts from Twitter (#HackerHouse), Instagram, and manual submissions. 
          Updates every 5 minutes.
        </p>
        <div className="flex flex-wrap gap-2">
          {['Twitter API', 'Instagram Feed', 'Manual Posts', 'Auto-Refresh'].map((feature) => (
            <span
              key={feature}
              className="px-3 py-1 bg-neon-green/10 border border-neon-green/30 rounded-full text-xs text-neon-green"
            >
              ✅ {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}