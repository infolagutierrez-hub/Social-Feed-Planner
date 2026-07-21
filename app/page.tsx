'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  pointerWithin,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import { useFeedStore } from '@/store/useFeedStore'
import { useUIStore } from '@/store/useUIStore'
import AssetLibrary from '@/components/assets/AssetLibrary'
import PhoneMockup from '@/components/phone/PhoneMockup'
import ZoomControl from '@/components/ui/ZoomControl'
import PostPreview from '@/components/ui/PostPreview'
import ShortcutsHint from '@/components/ui/ShortcutsHint'
import ThemeToggle from '@/components/ui/ThemeToggle'
import GlobalStyles from '@/components/GlobalStyles'
import PillarBar from '@/components/ui/PillarBar'
import type { DragItemData } from '@/types'

export default function Page() {
  const { insertAsset, insertMultiple, swapAssets, removeAsset, assets, undo, redo, feedSlots } =
    useFeedStore()
  const { zoom, zoomIn, zoomOut, clearSelection, selectedAssetIds, setPreview } =
    useUIStore()

  const [activeDragData, setActiveDragData] = useState<DragItemData | null>(null)
  const [dragSelectedIds, setDragSelectedIds] = useState<string[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if (meta && e.key === 'z' && e.shiftKey)  { e.preventDefault(); redo() }
      if (meta && e.key === 'a') { e.preventDefault() }
      if (e.key === 'Escape') { clearSelection(); setPreview(null) }
      if (e.key === '=' || e.key === '+') zoomIn()
      if (e.key === '-') zoomOut()
      if (e.key.toLowerCase() === 'd' && !meta && !(e.target instanceof HTMLInputElement)) {
        useUIStore.getState().toggleDark()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo, clearSelection, setPreview, zoomIn, zoomOut])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  )

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const data = active.data.current as DragItemData & { selectedIds?: string[] }
      setActiveDragData(data)
      if (data?.type === 'library') {
        setDragSelectedIds(data.selectedIds ?? [data.asset.id])
      } else {
        setDragSelectedIds([])
      }
    },
    [],
  )

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      const data = activeDragData
      setActiveDragData(null)
      setDragSelectedIds([])

      if (!data) return

      if (!over) {
        if (data.type === 'slot' && data.slotId) removeAsset(data.slotId)
        return
      }

      const targetSlotId = over.id as string

      if (data.type === 'library') {
        if (dragSelectedIds.length > 1) {
          // Multi-drop: fill target + consecutive empty slots
          const targetIdx = feedSlots.findIndex((s) => s.id === targetSlotId)
          const slotsFrom = feedSlots.slice(targetIdx)
          const empties = slotsFrom.filter((s) => !s.assetId).slice(0, dragSelectedIds.length)
          const entries = dragSelectedIds
            .slice(0, empties.length)
            .map((assetId, i) => ({ slotId: empties[i].id, assetId }))
          if (entries.length) insertMultiple(entries)
        } else {
          insertAsset(targetSlotId, data.asset.id)
        }
        clearSelection()
      } else if (data.type === 'slot') {
        if (data.slotId !== targetSlotId) swapAssets(data.slotId, targetSlotId)
      }
    },
    [activeDragData, dragSelectedIds, feedSlots, insertAsset, insertMultiple, swapAssets, removeAsset, clearSelection],
  )

  // Overlay image
  const overlayImages: string[] = []
  if (activeDragData?.type === 'library') {
    dragSelectedIds.forEach((id) => {
      const url = assets.find((a) => a.id === id)?.imageUrl
      if (url) overlayImages.push(url)
    })
  } else if (activeDragData?.type === 'slot' && activeDragData.assetId) {
    const url = assets.find((a) => a.id === activeDragData.assetId)?.imageUrl
    if (url) overlayImages.push(url)
  }

  return (
    <DndContext
      id="feed-planner"
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="flex h-screen overflow-hidden"
        style={{ background: 'var(--bg)' }}
      >
        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 38 }}
              className="flex-shrink-0 h-full overflow-hidden"
            >
              <div className="w-80 h-full">
                <AssetLibrary />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Topbar */}
          <div
            className="h-12 flex items-center justify-between px-4 flex-shrink-0 border-b"
            style={{
              background: 'color-mix(in srgb, var(--sidebar) 82%, transparent)',
              backdropFilter: 'blur(12px)',
              borderColor: 'var(--border)',
            }}
          >
            {/* Left */}
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setIsSidebarOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                style={{ color: 'var(--text-2)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--slot-empty)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                aria-label="Toggle sidebar"
              >
                <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                  <rect y="0"    width="15" height="1.5" rx="0.75" fill="currentColor" />
                  <rect y="4.75" width="10" height="1.5" rx="0.75" fill="currentColor" />
                  <rect y="9.5"  width="15" height="1.5" rx="0.75" fill="currentColor" />
                </svg>
              </motion.button>

              <span
                className="text-[13px] font-semibold tracking-[-0.02em]"
                style={{ color: 'var(--text-1)' }}
              >
                Social Feed Planner
              </span>
              <span
                className="px-1.5 py-0.5 text-[9px] font-bold rounded tracking-wider"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                BETA
              </span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 mr-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>
                  Drag to plan
                </span>
              </div>
              <ZoomControl />
              <ThemeToggle />
              <ShortcutsHint />
            </div>
          </div>

          {/* Content Pillar bar */}
          <PillarBar />

          {/* Phone area */}
          <div
            className="flex-1 flex items-center justify-center overflow-y-auto overflow-x-hidden py-5 phone-area-scroll"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          >
            <motion.div
              animate={{ scale: zoom }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              style={{ transformOrigin: 'top center' }}
            >
              <PhoneMockup />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {overlayImages.length > 0 && (
          <div className="relative pointer-events-none" style={{ width: 88, height: 88 }}>
            {overlayImages
              .slice(0, 3)
              .reverse()
              .map((url, i, arr) => {
                const idx = arr.length - 1 - i
                return (
                  <div
                    key={url}
                    className="absolute rounded-xl overflow-hidden"
                    style={{
                      width: 88,
                      height: 88,
                      top: idx * -4,
                      left: idx * 4,
                      transform: `rotate(${idx * 2.5}deg) scale(${1 - idx * 0.04})`,
                      boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                      zIndex: arr.length - idx,
                    }}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" draggable={false} />
                  </div>
                )
              })}
            {overlayImages.length > 1 && (
              <div
                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-md z-50"
                style={{ background: 'var(--accent)' }}
              >
                {overlayImages.length}
              </div>
            )}
          </div>
        )}
      </DragOverlay>

      {/* Post Preview Modal */}
      <PostPreview />

      {/* Design token sync */}
      <GlobalStyles />
    </DndContext>
  )
}
