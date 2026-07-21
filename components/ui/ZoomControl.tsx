'use client'

import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { useUIStore, ZOOM_STEPS, type Zoom } from '@/store/useUIStore'
import { cn } from '@/lib/utils'

const LABELS: Record<Zoom, string> = { 0.5: '50%', 0.75: '75%', 1: '100%', 1.25: '125%' }

export default function ZoomControl() {
  const { zoom, setZoom, zoomIn, zoomOut } = useUIStore()
  const minIdx = 0
  const maxIdx = ZOOM_STEPS.length - 1
  const curIdx = ZOOM_STEPS.indexOf(zoom)

  return (
    <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] p-0.5">
      <button
        onClick={zoomOut}
        disabled={curIdx === minIdx}
        className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-2)] transition-colors hover:bg-[var(--slot-empty)] hover:text-[var(--text-1)] disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Zoom out"
      >
        <ZoomOut size={13} />
      </button>

      <div className="flex items-center gap-0.5">
        {ZOOM_STEPS.map((z) => (
          <motion.button
            key={z}
            onClick={() => setZoom(z)}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'relative h-7 min-w-[40px] rounded-md px-1.5 text-[11px] font-semibold transition-colors',
              zoom === z
                ? 'text-white'
                : 'text-[var(--text-2)] hover:text-[var(--text-1)]',
            )}
          >
            {zoom === z && (
              <motion.span
                layoutId="zoom-pill"
                className="absolute inset-0 rounded-md bg-[var(--accent)]"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{LABELS[z]}</span>
          </motion.button>
        ))}
      </div>

      <button
        onClick={zoomIn}
        disabled={curIdx === maxIdx}
        className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-2)] transition-colors hover:bg-[var(--slot-empty)] hover:text-[var(--text-1)] disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Zoom in"
      >
        <ZoomIn size={13} />
      </button>
    </div>
  )
}
