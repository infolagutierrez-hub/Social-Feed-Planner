'use client'

import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useUIStore } from '@/store/useUIStore'

export default function ThemeToggle() {
  const { isDark, toggleDark } = useUIStore()

  return (
    <motion.button
      onClick={toggleDark}
      whileTap={{ scale: 0.9 }}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-2)] hover:bg-[var(--slot-empty)] hover:text-[var(--text-1)] transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatedIcon isDark={isDark} />
    </motion.button>
  )
}

function AnimatedIcon({ isDark }: { isDark: boolean }) {
  return (
    <motion.div
      key={isDark ? 'moon' : 'sun'}
      initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
      animate={{ rotate: 0, opacity: 1, scale: 1 }}
      exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </motion.div>
  )
}
