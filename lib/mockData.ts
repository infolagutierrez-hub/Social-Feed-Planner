import type { Asset, FeedSlot, ContentType } from '@/types'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const SEEDS = [
  10, 14, 18, 22, 27, 31, 35, 42, 48, 55,
  63, 71, 76, 82, 88, 93, 99, 104, 112, 117,
  125, 130, 138, 144, 151, 159, 165, 170, 177, 183,
]

const TYPES: ContentType[] = [
  'photo', 'photo', 'photo', 'photo', 'photo',   // 1-5
  'photo', 'photo', 'photo', 'photo', 'photo',   // 6-10
  'video', 'video', 'video', 'video', 'video',   // 11-15
  'reel',  'reel',  'reel',  'reel',  'reel',    // 16-20
  'story', 'story', 'story', 'story',            // 21-24
  'carousel', 'carousel', 'carousel',            // 25-27
  'video', 'reel', 'photo',                      // 28-30
]

export const mockAssets: Asset[] = SEEDS.map((seed, i) => ({
  id: `asset-${i + 1}`,
  name: `post-${i + 1}`,
  imageUrl: `https://picsum.photos/seed/${seed}/400/400`,
  date: `${MONTHS[Math.floor(i / 5) % MONTHS.length]} 2026`,
  contentType: TYPES[i],
}))

const PRE_FILLED = [
  'asset-1', 'asset-2', 'asset-3',
  'asset-4', 'asset-5', 'asset-6',
  'asset-7', 'asset-8', 'asset-9',
]

export const initialFeedSlots: FeedSlot[] = Array.from({ length: 60 }, (_, i) => ({
  id: `slot-${i + 1}`,
  assetId: PRE_FILLED[i] ?? null,
  pillarId: null,
}))
