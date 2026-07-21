'use client'

import { motion } from 'framer-motion'
import { BarChart3, RotateCcw, ImageIcon, CheckSquare, Square, Undo2, Redo2 } from 'lucide-react'
import { useFeedStore } from '@/store/useFeedStore'

export default function FeedInsights() {
  const feedSlots = useFeedStore((s) => s.feedSlots)
  const past = useFeedStore((s) => s.past)
  const future = useFeedStore((s) => s.future)
  const { resetFeed, undo, redo } = useFeedStore()

  const total = feedSlots.length
  const filled = feedSlots.filter((s) => s.assetId !== null).length
  const empty = total - filled
  const pct = Math.round((filled / total) * 100)

  const stats = [
    { label: 'Total', value: total, Icon: ImageIcon, color: 'var(--text-1)' },
    { label: 'Filled', value: filled, Icon: CheckSquare, color: '#10b981' },
    { label: 'Empty', value: empty, Icon: Square, color: 'var(--text-3)' },
    { label: 'Done', value: `${pct}%`, Icon: BarChart3, color: 'var(--accent)' },
  ]

  return (
    <div
      className="border-t px-4 py-4"
      style={{ borderColor: 'var(--border)', background: 'var(--sidebar)' }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <BarChart3 size={13} style={{ color: 'var(--text-2)' }} />
          <span
            className="text-[11px] font-semibold tracking-wide uppercase"
            style={{ color: 'var(--text-2)' }}
          >
            Feed Insights
          </span>
        </div>

        {/* Undo / Redo / Reset */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={past.length === 0}
            title="Undo (⌘Z)"
            className="flex h-6 w-6 items-center justify-center rounded-md transition-colors disabled:opacity-25"
            style={{ color: 'var(--text-2)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--slot-empty)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Undo2 size={11} />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            title="Redo (⌘⇧Z)"
            className="flex h-6 w-6 items-center justify-center rounded-md transition-colors disabled:opacity-25"
            style={{ color: 'var(--text-2)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--slot-empty)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Redo2 size={11} />
          </button>
          <button
            onClick={resetFeed}
            title="Reset feed"
            className="flex items-center gap-1 text-[10px] rounded-md px-1.5 py-1 transition-colors"
            style={{ color: 'var(--text-3)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--slot-empty)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <RotateCcw size={10} />
            Reset
          </button>
        </div>
      </div>

      {/* Progress */}
      <div
        className="w-full h-1 rounded-full mb-3 overflow-hidden"
        style={{ background: 'var(--slot-empty)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--accent), #a78bfa)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {stats.map(({ label, value, Icon, color }) => (
          <div
            key={label}
            className="rounded-xl p-2.5 flex items-center gap-2 border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <Icon size={13} style={{ color }} />
            <div>
              <p className="text-[13px] font-bold leading-tight" style={{ color }}>
                {value}
              </p>
              <p className="text-[10px] leading-tight" style={{ color: 'var(--text-3)' }}>
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
