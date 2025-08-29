import { Activity } from '@/types/database'

export interface ScoringRule {
  category: string
  description: string
  points: number
  keywords?: string[]
}

export const scoringRules: ScoringRule[] = [
  // Coder rules
  { category: 'code', description: '5 commits', points: 10, keywords: ['commit', 'commits', 'push'] },
  { category: 'code', description: '1 feature shipped', points: 20, keywords: ['feature', 'ship', 'deploy', 'launch'] },
  { category: 'code', description: 'Bug fix', points: 8, keywords: ['bug', 'fix', 'hotfix'] },
  { category: 'code', description: 'Code review', points: 5, keywords: ['review', 'pr', 'pull request'] },
  
  // Business rules
  { category: 'biz', description: '1 partnership', points: 20, keywords: ['partnership', 'partner', 'deal'] },
  { category: 'biz', description: '1 paying customer', points: 30, keywords: ['customer', 'sale', 'revenue', 'paid'] },
  { category: 'biz', description: 'Lead generation', points: 10, keywords: ['lead', 'prospect', 'outreach'] },
  { category: 'biz', description: 'Meeting/Demo', points: 15, keywords: ['meeting', 'demo', 'presentation'] },
  
  // Content rules
  { category: 'content', description: '1 long-form video/blog', points: 15, keywords: ['blog', 'video', 'article', 'youtube'] },
  { category: 'content', description: '1 tweet thread', points: 10, keywords: ['thread', 'twitter', 'tweet'] },
  { category: 'content', description: 'Social media post', points: 5, keywords: ['post', 'social', 'linkedin', 'instagram'] },
  { category: 'content', description: 'Podcast appearance', points: 20, keywords: ['podcast', 'interview', 'guest'] },
  
  // Design rules
  { category: 'design', description: '1 UI prototype', points: 15, keywords: ['prototype', 'mockup', 'wireframe'] },
  { category: 'design', description: '1 full design shipped', points: 25, keywords: ['design', 'ui', 'shipped', 'final'] },
  { category: 'design', description: 'Design system component', points: 12, keywords: ['component', 'system', 'library'] },
  { category: 'design', description: 'User research', points: 10, keywords: ['research', 'user', 'testing', 'interview'] },
  
  // General rules
  { category: 'misc', description: 'Daily check-in', points: 5, keywords: ['checkin', 'check-in', 'daily', 'standup'] },
  { category: 'misc', description: 'Help teammate', points: 8, keywords: ['help', 'assist', 'mentor', 'pair'] },
  { category: 'misc', description: 'Learning/Course', points: 6, keywords: ['learn', 'course', 'tutorial', 'study'] }
]

export function calculatePoints(category: string, description: string, evidenceLink?: string): number {
  const categoryRules = scoringRules.filter(rule => rule.category === category)
  
  // Smart scoring based on keywords in description
  let maxPoints = 0
  const descriptionLower = description.toLowerCase()
  
  for (const rule of categoryRules) {
    if (rule.keywords) {
      const matchingKeywords = rule.keywords.filter(keyword => 
        descriptionLower.includes(keyword.toLowerCase())
      )
      
      if (matchingKeywords.length > 0) {
        maxPoints = Math.max(maxPoints, rule.points)
      }
    }
  }
  
  // Default points if no keywords match
  if (maxPoints === 0) {
    const defaultPoints = {
      'code': 10,
      'biz': 15,
      'content': 12,
      'design': 15,
      'misc': 5
    }
    maxPoints = defaultPoints[category as keyof typeof defaultPoints] || 5
  }
  
  // Bonus points for evidence links
  if (evidenceLink) {
    if (evidenceLink.includes('github.com')) maxPoints += 2
    if (evidenceLink.includes('twitter.com')) maxPoints += 1
    if (evidenceLink.includes('linkedin.com')) maxPoints += 1
    if (evidenceLink.includes('youtube.com')) maxPoints += 3
  }
  
  return Math.min(maxPoints, 50) // Cap at 50 points per activity
}

export function calculateStreakBonus(streakDays: number): number {
  if (streakDays >= 30) return 100
  if (streakDays >= 21) return 75
  if (streakDays >= 14) return 50
  if (streakDays >= 7) return 25
  if (streakDays >= 3) return 10
  return 0
}

export function getRoleMultiplier(role: string, category: string): number {
  const roleMultipliers: { [key: string]: { [key: string]: number } } = {
    'coder': { 'code': 1.2, 'biz': 0.8, 'content': 0.9, 'design': 0.9, 'misc': 1.0 },
    'biz': { 'code': 0.8, 'biz': 1.2, 'content': 1.0, 'design': 0.9, 'misc': 1.0 },
    'content': { 'code': 0.8, 'biz': 0.9, 'content': 1.2, 'design': 1.0, 'misc': 1.0 },
    'design': { 'code': 0.9, 'biz': 0.9, 'content': 1.0, 'design': 1.2, 'misc': 1.0 },
    'misc': { 'code': 1.0, 'biz': 1.0, 'content': 1.0, 'design': 1.0, 'misc': 1.1 }
  }
  
  return roleMultipliers[role]?.[category] || 1.0
}

export function calculateFinalPoints(
  category: string, 
  description: string, 
  userRole: string, 
  evidenceLink?: string,
  streakDays: number = 0
): number {
  const basePoints = calculatePoints(category, description, evidenceLink)
  const roleMultiplier = getRoleMultiplier(userRole, category)
  const streakBonus = Math.floor(streakDays / 7) * 2 // +2 points per week of streak
  
  return Math.floor(basePoints * roleMultiplier) + streakBonus
}

// Leaderboard calculations
export function calculateLevel(totalPoints: number): { level: number; title: string; nextLevelPoints: number } {
  const levels = [
    { level: 1, title: 'Newbie', threshold: 0 },
    { level: 2, title: 'Builder', threshold: 50 },
    { level: 3, title: 'Hustler', threshold: 150 },
    { level: 4, title: 'Achiever', threshold: 300 },
    { level: 5, title: 'Legend', threshold: 500 },
    { level: 6, title: 'Unicorn', threshold: 800 },
    { level: 7, title: 'Mythical', threshold: 1200 }
  ]
  
  let currentLevel = levels[0]
  let nextLevel = levels[1]
  
  for (let i = 0; i < levels.length; i++) {
    if (totalPoints >= levels[i].threshold) {
      currentLevel = levels[i]
      nextLevel = levels[i + 1] || levels[i]
    }
  }
  
  return {
    level: currentLevel.level,
    title: currentLevel.title,
    nextLevelPoints: nextLevel ? nextLevel.threshold - totalPoints : 0
  }
}