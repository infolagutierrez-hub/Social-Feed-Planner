'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, MoveUpRight } from 'lucide-react'
import { useUIStore } from '@/store/useUIStore'
import { useFeedStore } from '@/store/useFeedStore'

export default function PostPreview() {
  const { previewSlotId, setPreview } = useUIStore()
  const { feedSlots, assets, removeAsset } = useFeedStore()

  const slot = feedSlots.find((s) => s.id === previewSlotId)
  const asset = slot?.assetId ? assets.find((a) => a.id === slot.assetId) : null
  const slotIndex = feedSlots.findIndex((s) => s.id === previewSlotId)
  const row = Math.floor(slotIndex / 3) + 1
  const col = (slotIndex % 3) + 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreview(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setPreview])

  function handleRemove() {
    if (previewSlotId) {
      removeAsset(previewSlotId)
      setPreview(null)
    }
  }

  return (
    <AnimatePresence>
      {previewSlotId && asset && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setPreview(null)}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div
              className="pointer-events-auto relative w-[380px] rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: 'var(--card)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-[var(--slot-empty)]">
                <img
                  src={asset.imageUrl}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
                {/* Position badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1">
                  <MoveUpRight size={11} className="text-white/80" />
                  <span className="text-[11px] font-semibold text-white">
                    Row {row}, Col {col}
                  </span>
                </div>
                {/* Close */}
                <button
                  onClick={() => setPreview(null)}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Info */}
              <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-[var(--text-1)]">{asset.name}</p>
                  <p className="text-[11px] text-[var(--text-2)] mt-0.5">{asset.date}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRemove}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={12} />
                  Remove
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
