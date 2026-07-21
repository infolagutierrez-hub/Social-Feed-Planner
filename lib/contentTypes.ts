import type { ContentType } from '@/types'

export type ContentTypeConfig = {
  id: ContentType
  label: string
  shortLabel: string
  emoji: string
  color: string
  bg: string
}

export const CONTENT_TYPE_CONFIG: Record<ContentType, ContentTypeConfig> = {
  photo: {
    id: 'photo',
    label: 'Photo',
    shortLabel: 'Photo',
    emoji: '📷',
    color: '#6B7280',
    bg: 'rgba(107,114,128,0.88)',
  },
  video: {
    id: 'video',
    label: 'Video',
    shortLabel: 'Video',
    emoji: '🎬',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.88)',
  },
  reel: {
    id: 'reel',
    label: 'Reel',
    shortLabel: 'Reel',
    emoji: '🎞️',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.88)',
  },
  story: {
    id: 'story',
    label: 'Story',
    shortLabel: 'Story',
    emoji: '⭕',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.88)',
  },
  carousel: {
    id: 'carousel',
    label: 'Carousel',
    shortLabel: 'Slides',
    emoji: '🔲',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.88)',
  },
}

export function getContentType(id: ContentType | undefined): ContentTypeConfig | undefined {
  if (!id) return undefined
  return CONTENT_TYPE_CONFIG[id]
}
