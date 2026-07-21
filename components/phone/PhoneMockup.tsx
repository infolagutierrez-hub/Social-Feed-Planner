'use client'

import { motion } from 'framer-motion'
import { Signal, Wifi, BatteryFull } from 'lucide-react'
import ProfileHeader from './ProfileHeader'
import FeedGrid from '@/components/feed/FeedGrid'

export default function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto flex-shrink-0"
      style={{ width: 390, height: 820 }}
    >
      {/* Outer titanium frame */}
      <div
        className="absolute inset-0 rounded-[54px]"
        style={{
          background: 'linear-gradient(160deg, #3a3a3c 0%, #1c1c1e 35%, #111113 70%, #2a2a2c 100%)',
          boxShadow: `
            0 60px 120px rgba(0,0,0,0.55),
            0 24px 48px rgba(0,0,0,0.3),
            0 8px 16px rgba(0,0,0,0.2),
            0 0 0 0.5px rgba(255,255,255,0.12),
            inset 0 0 0 0.5px rgba(255,255,255,0.06)
          `,
        }}
      />

      {/* Subtle top highlight — glass reflection */}
      <div
        className="absolute rounded-[54px] pointer-events-none"
        style={{
          inset: 0,
          background: 'linear-gradient(165deg, rgba(255,255,255,0.07) 0%, transparent 35%)',
        }}
      />

      {/* Inner bezel */}
      <div
        className="absolute rounded-[50px] bg-black overflow-hidden"
        style={{ inset: '3px' }}
      >
        {/* Screen — scrollable */}
        <div
          className="absolute inset-0 bg-white overflow-y-auto overflow-x-hidden phone-scroll"
        >
          {/* Status bar */}
          <div className="sticky top-0 z-20 flex justify-between items-center px-6 pt-[14px] pb-[6px] bg-white">
            <span className="text-[12px] font-semibold text-gray-900 tabular-nums tracking-[-0.01em]">
              9:41
            </span>
            {/* Dynamic Island */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-[10px] bg-black rounded-full"
              style={{ width: 126, height: 36 }}
            />
            <div className="flex items-center gap-1 text-gray-900">
              <Signal size={13} strokeWidth={2.2} />
              <Wifi size={13} strokeWidth={2.2} />
              <BatteryFull size={15} strokeWidth={2} />
            </div>
          </div>

          {/* Profile header — sticky below status bar */}
          <div className="sticky z-10 bg-white" style={{ top: 33 }}>
            <ProfileHeader />
          </div>

          {/* Feed — scrolls freely beneath the header */}
          <FeedGrid />
          <div className="h-6" />
        </div>
      </div>

      {/* Physical buttons */}

      {/* Power button – right */}
      <div
        className="absolute rounded-r-[3px]"
        style={{
          right: -3.5,
          top: 130,
          width: 4,
          height: 74,
          background: 'linear-gradient(to right, #2e2e30, #3e3e42)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      />

      {/* Silent switch – left */}
      <div
        className="absolute rounded-l-[3px]"
        style={{
          left: -3.5,
          top: 100,
          width: 4,
          height: 34,
          background: 'linear-gradient(to left, #2e2e30, #3e3e42)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      />

      {/* Volume up – left */}
      <div
        className="absolute rounded-l-[3px]"
        style={{
          left: -3.5,
          top: 152,
          width: 4,
          height: 62,
          background: 'linear-gradient(to left, #2e2e30, #3e3e42)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      />

      {/* Volume down – left */}
      <div
        className="absolute rounded-l-[3px]"
        style={{
          left: -3.5,
          top: 228,
          width: 4,
          height: 62,
          background: 'linear-gradient(to left, #2e2e30, #3e3e42)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      />

      {/* Home indicator */}
      <div
        className="absolute bottom-[8px] left-1/2 -translate-x-1/2 rounded-full pointer-events-none z-30"
        style={{
          width: 134,
          height: 4.5,
          background: 'rgba(0,0,0,0.22)',
        }}
      />
    </motion.div>
  )
}
