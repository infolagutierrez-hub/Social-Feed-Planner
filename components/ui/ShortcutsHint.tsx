'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard, X } from 'lucide-react'

const SHORTCUTS = [
  { keys: ['⌘', 'Z'], label: 'Undo' },
  { keys: ['⌘', '⇧', 'Z'], label: 'Redo' },
  { keys: ['+', '−'], label: 'Zoom in / out' },
  { keys: ['D'], label: 'Toggle dark mode' },
  { keys: ['⌘', 'A'], label: 'Select all assets' },
  { keys: ['Esc'], label: 'Deselect / close' },
  { keys: ['⌫'], label: 'Remove selected from feed' },
]

export default function ShortcutsHint() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-2)] hover:bg-[var(--slot-empty)] hover:text-[var(--text-1)] transition-colors"
        aria-label="Keyboard shortcuts"
      >
        <Keyboard size={15} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="bd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 6 }}
              transition={{ type: 'spring', stiffness: 500, damping: 36 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div
                className="pointer-events-auto w-72 rounded-2xl p-5 shadow-2xl border border-[var(--border)]"
                style={{ background: 'var(--card)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[13px] font-semibold text-[var(--text-1)]">
                    Keyboard shortcuts
                  </span>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <ul className="space-y-2.5">
                  {SHORTCUTS.map(({ keys, label }) => (
                    <li key={label} className="flex items-center justify-between">
                      <span className="text-[12px] text-[var(--text-2)]">{label}</span>
                      <div className="flex items-center gap-1">
                        {keys.map((k) => (
                          <kbd
                            key={k}
                            className="min-w-[22px] h-[22px] flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--slot-empty)] px-1.5 text-[10px] font-semibold text-[var(--text-1)]"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
