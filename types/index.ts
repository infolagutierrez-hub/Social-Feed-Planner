export type ContentType = 'photo' | 'video' | 'reel' | 'story' | 'carousel'

export type Asset = {
  id: string
  name: string
  imageUrl: string
  date: string
  contentType: ContentType
}

export type FeedSlot = {
  id: string
  assetId: string | null
  pillarId: string | null
}

export type DragItemData =
  | { type: 'library'; asset: Asset; selectedIds?: string[] }
  | { type: 'slot'; slotId: string; assetId: string | null }
