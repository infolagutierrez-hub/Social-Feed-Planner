export type Pillar = {
  id: string
  label: string
  shortLabel: string
  emoji: string
  color: string
  bg: string
}

export const PILLARS: Pillar[] = [
  { id: 'edu',       label: 'Educational',   shortLabel: 'Edu',     emoji: '📚', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)'  },
  { id: 'inspire',   label: 'Inspirational', shortLabel: 'Inspire', emoji: '✨', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)'  },
  { id: 'entertain', label: 'Entertaining',  shortLabel: 'Fun',     emoji: '🎭', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)'  },
  { id: 'promo',     label: 'Promotional',   shortLabel: 'Promo',   emoji: '📣', color: '#10B981', bg: 'rgba(16,185,129,0.15)'  },
  { id: 'personal',  label: 'Personal',      shortLabel: 'Me',      emoji: '💛', color: '#F472B6', bg: 'rgba(244,114,182,0.15)' },
  { id: 'community', label: 'Community',     shortLabel: 'Comm',    emoji: '🤝', color: '#06B6D4', bg: 'rgba(6,182,212,0.15)'   },
]

export function getPillar(id: string | null | undefined): Pillar | undefined {
  if (!id) return undefined
  return PILLARS.find((p) => p.id === id)
}
