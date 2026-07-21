import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Asset, FeedSlot } from '@/types'
import { mockAssets, initialFeedSlots } from '@/lib/mockData'

const MAX_HISTORY = 40

interface FeedStore {
  assets: Asset[]
  feedSlots: FeedSlot[]
  past: FeedSlot[][]
  future: FeedSlot[][]

  insertAsset: (slotId: string, assetId: string) => void
  insertMultiple: (entries: Array<{ slotId: string; assetId: string }>) => void
  swapAssets: (slotId1: string, slotId2: string) => void
  moveAsset: (fromSlotId: string, toSlotId: string) => void
  removeAsset: (slotId: string) => void
  tagSlot: (slotId: string, pillarId: string | null) => void
  resetFeed: () => void
  undo: () => void
  redo: () => void
}

function snapshot(slots: FeedSlot[]): FeedSlot[] {
  return slots.map((s) => ({ ...s }))
}

function pushHistory(
  past: FeedSlot[][],
  current: FeedSlot[],
): FeedSlot[][] {
  return [...past.slice(-MAX_HISTORY + 1), snapshot(current)]
}

export const useFeedStore = create<FeedStore>()(
  persist(
    (set) => ({
      assets: mockAssets,
      feedSlots: initialFeedSlots,
      past: [],
      future: [],

      insertAsset: (slotId, assetId) =>
        set((s) => ({
          feedSlots: s.feedSlots.map((slot) =>
            slot.id === slotId ? { ...slot, assetId } : slot,
          ),
          past: pushHistory(s.past, s.feedSlots),
          future: [],
        })),

      insertMultiple: (entries) =>
        set((s) => {
          const map = new Map(entries.map((e) => [e.slotId, e.assetId]))
          return {
            feedSlots: s.feedSlots.map((slot) =>
              map.has(slot.id) ? { ...slot, assetId: map.get(slot.id)! } : slot,
            ),
            past: pushHistory(s.past, s.feedSlots),
            future: [],
          }
        }),

      swapAssets: (slotId1, slotId2) =>
        set((s) => {
          const a = s.feedSlots.find((sl) => sl.id === slotId1)
          const b = s.feedSlots.find((sl) => sl.id === slotId2)
          if (!a || !b) return s
          return {
            feedSlots: s.feedSlots.map((slot) => {
              if (slot.id === slotId1) return { ...slot, assetId: b.assetId }
              if (slot.id === slotId2) return { ...slot, assetId: a.assetId }
              return slot
            }),
            past: pushHistory(s.past, s.feedSlots),
            future: [],
          }
        }),

      moveAsset: (fromSlotId, toSlotId) =>
        set((s) => {
          const from = s.feedSlots.find((sl) => sl.id === fromSlotId)
          if (!from?.assetId) return s
          return {
            feedSlots: s.feedSlots.map((slot) => {
              if (slot.id === fromSlotId) return { ...slot, assetId: null }
              if (slot.id === toSlotId) return { ...slot, assetId: from.assetId }
              return slot
            }),
            past: pushHistory(s.past, s.feedSlots),
            future: [],
          }
        }),

      removeAsset: (slotId) =>
        set((s) => ({
          feedSlots: s.feedSlots.map((slot) =>
            slot.id === slotId ? { ...slot, assetId: null } : slot,
          ),
          past: pushHistory(s.past, s.feedSlots),
          future: [],
        })),

      tagSlot: (slotId, pillarId) =>
        set((s) => ({
          feedSlots: s.feedSlots.map((slot) =>
            slot.id === slotId ? { ...slot, pillarId } : slot,
          ),
          past: pushHistory(s.past, s.feedSlots),
          future: [],
        })),

      resetFeed: () =>
        set((s) => ({
          feedSlots: initialFeedSlots,
          past: pushHistory(s.past, s.feedSlots),
          future: [],
        })),

      undo: () =>
        set((s) => {
          if (s.past.length === 0) return s
          const previous = s.past[s.past.length - 1]
          return {
            feedSlots: previous,
            past: s.past.slice(0, -1),
            future: [snapshot(s.feedSlots), ...s.future.slice(0, MAX_HISTORY - 1)],
          }
        }),

      redo: () =>
        set((s) => {
          if (s.future.length === 0) return s
          const next = s.future[0]
          return {
            feedSlots: next,
            past: pushHistory(s.past, s.feedSlots),
            future: s.future.slice(1),
          }
        }),
    }),
    {
      name: 'feed-planner-feed',
      partialize: (s) => ({ feedSlots: s.feedSlots }),
    },
  ),
)
