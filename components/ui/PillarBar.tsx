'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Tag, X } from 'lucide-react'
import { PILLARS } from '@/lib/pillars'
import { useUIStore } from '@/store/useUIStore'
import { useFeedStore } from '@/store/useFeedStore'
import { cn } from '@/lib/utils'

export default function PillarBar() {
  const { activePillar, setActivePillar } = useUIStore()
  const feedSlots = useFeedStore((s) => s.feedSlots)

  // Count how many slots have each pillar
  const counts = Object.fromEntries(
    PILLARS.map((p) => [p.id, feedSlots.filter((s) => s.pillarId === p.id).length]),
  )

  return (
    <div
      className="flex items-center gap-2 px-5 py-2.5 border-b"
      style={{
        background: 'color-mix(in srgb, var(--sidebar) 60%, transparent)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Label */}
      <div className="flex items-center gap-1.5 mr-1 flex-shrink-0">
        <Tag size={12} style={{ color: 'var(--text-3)' }} />
        <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
          Content Pillars
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 flex-shrink-0" style={{ background: 'var(--border)' }} />

      {/* Pillar chips */}
      <div className="flex items-center gap-1.5 flex-1 overflow-x-auto hide-scrollbar">
        {PILLARS.map((pillar) => {
          const isActive = activePillar === pillar.id
          const count = counts[pillar.id]

          return (
            <motion.button
              key={pillar.id}
              onClick={() => setActivePillar(pillar.id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={cn(
                'relative flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold',
                'border transition-all duration-150 flex-shrink-0',
                isActive ? 'text-white shadow-md' : 'hover:opacity-90',
              )}
              style={
                isActive
                  ? { background: pillar.color, borderColor: pillar.color }
                  : {
                      background: pillar.bg,
                      borderColor: pillar.color + '40',
                      color: pillar.color,
                    }
              }
            >
              <span className="text-[12px] leading-none">{pillar.emoji}</span>
              <span>{pillar.label}</span>

              {/* Count badge */}
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                    className="flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.3)' : pillar.color,
                      color: 'white',
                    }}
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* Clear active */}
      <AnimatePresence>
        {activePillar && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setActivePillar(null)}
            className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full transition-colors"
            style={{ background: 'var(--slot-empty)', color: 'var(--text-2)' }}
            title="Deselect pillar"
          >
            <X size={11} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
