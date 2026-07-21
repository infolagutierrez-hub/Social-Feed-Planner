'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useFeedStore } from '@/store/useFeedStore'
import { useUIStore } from '@/store/useUIStore'
import { getPillar } from '@/lib/pillars'
import { getContentType } from '@/lib/contentTypes'
import { cn } from '@/lib/utils'
import type { FeedSlot as FeedSlotType } from '@/types'

interface Props {
  slot: FeedSlotType
}

function isImageCached(url: string): boolean {
  if (typeof window === 'undefined') return false
  const img = new window.Image()
  img.src = url
  return img.complete && img.naturalWidth > 0
}

export default function FeedSlot({ slot }: Props) {
  const assets = useFeedStore((s) => s.assets)
  const tagSlot = useFeedStore((s) => s.tagSlot)
  const { setPreview, activePillar } = useUIStore()

  const asset = slot.assetId ? assets.find((a) => a.id === slot.assetId) : null
  const pillar = getPillar(slot.pillarId)
  const contentType = getContentType(asset?.contentType)

  const [imgLoaded, setImgLoaded] = useState<boolean>(
    () => (asset ? isImageCached(asset.imageUrl) : false),
  )
  const [justDropped, setJustDropped] = useState(false)
  const prevAssetId = useRef<string | null>(null)

  useEffect(() => {
    if (slot.assetId === prevAssetId.current) return
    const was = prevAssetId.current
    prevAssetId.current = slot.assetId
    if (slot.assetId && !was) {
      setJustDropped(true)
      const t = setTimeout(() => setJustDropped(false), 320)
      return () => clearTimeout(t)
    }
    if (slot.assetId) {
      const a = assets.find((x) => x.id === slot.assetId)
      setImgLoaded(a ? isImageCached(a.imageUrl) : false)
    } else {
      setImgLoaded(false)
    }
  }, [slot.assetId, assets])

  const { setNodeRef: dropRef, isOver } = useDroppable({
    id: slot.id,
    data: { type: 'slot', slotId: slot.id },
  })
  const { setNodeRef: dragRef, attributes, listeners, isDragging } = useDraggable({
    id: `drag-${slot.id}`,
    disabled: !asset,
    data: { type: 'slot', slotId: slot.id, assetId: slot.assetId },
  })
  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => { dropRef(node); dragRef(node) },
    [dropRef, dragRef],
  )

  function handleClick() {
    if (isDragging || !asset) return
    if (activePillar) {
      // Toggle pillar on/off this slot
      tagSlot(slot.id, slot.pillarId === activePillar ? null : activePillar)
    } else {
      setPreview(slot.id)
    }
  }

  return (
    <div
      ref={mergedRef}
      suppressHydrationWarning
      {...(asset ? attributes : {})}
      {...(asset ? listeners : {})}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden select-none',
        asset
          ? activePillar
            ? 'cursor-crosshair'
            : 'cursor-pointer'
          : 'cursor-default',
        isDragging && 'opacity-20',
        justDropped && 'slot-pop',
      )}
      style={{ aspectRatio: '1/1' }}
    >
      <AnimatePresence mode="wait">
        {asset ? (
          <motion.div
            key={asset.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: isOver ? 1.06 : 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {!imgLoaded && <div className="absolute inset-0 skeleton z-10" />}
            <img
              src={asset.imageUrl}
              alt={asset.name}
              className={cn(
                'w-full h-full object-cover transition-opacity duration-200',
                imgLoaded ? 'opacity-100' : 'opacity-0',
              )}
              draggable={false}
              onLoad={() => setImgLoaded(true)}
            />
            {/* Hover dim */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/15 transition-colors duration-150" />

            {/* Content-type bookmark — top-right ribbon */}
            {contentType && (
              <div
                className="absolute top-0 right-0 z-20 pointer-events-none"
                style={{ width: 28, height: 36 }}
              >
                {/* Ribbon shape */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-start pt-1 gap-px"
                  style={{
                    background: contentType.bg,
                    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
                  }}
                >
                  <span className="text-[10px] leading-none">{contentType.emoji}</span>
                </div>
              </div>
            )}

            {/* Active pillar highlight ring */}
            <AnimatePresence>
              {activePillar && slot.pillarId !== activePillar && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'rgba(0,0,0,0.3)' }}
                />
              )}
            </AnimatePresence>

            {/* Pillar tag badge */}
            <AnimatePresence>
              {pillar && (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: -6, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-1 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold leading-none z-20 pointer-events-none"
                  style={{
                    background: pillar.color,
                    color: 'white',
                    boxShadow: `0 1px 4px ${pillar.color}80`,
                  }}
                >
                  <span>{pillar.emoji}</span>
                  <span>{pillar.shortLabel}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            className="absolute inset-0 flex flex-col items-center justify-center gap-1"
            animate={{ backgroundColor: isOver ? 'var(--slot-hover)' : 'var(--slot-empty)' }}
            transition={{ duration: 0.12 }}
          >
            <motion.div
              animate={{ scale: isOver ? 1.2 : 1, opacity: isOver ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Plus size={16} style={{ color: 'var(--accent)', opacity: 0.7 }} />
            </motion.div>
            {isOver && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[9px] font-bold tracking-wide"
                style={{ color: 'var(--accent)' }}
              >
                DROP
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isOver && (
        <div className="absolute inset-0 ring-2 ring-inset pointer-events-none z-20"
          style={{ '--tw-ring-color': 'var(--accent)' } as React.CSSProperties}
        />
      )}
    </div>
  )
}
