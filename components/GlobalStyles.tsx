'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/store/useUIStore'

export const LIGHT: Record<string, string> = {
  '--bg':           '#F2F2F7',
  '--sidebar':      '#ffffff',
  '--card':         '#ffffff',
  '--card-hover':   '#fafafa',
  '--text-1':       '#1c1c1e',
  '--text-2':       '#6c6c70',
  '--text-3':       '#aeaeb2',
  '--border':       'rgba(0,0,0,0.07)',
  '--border-focus': 'rgba(0,0,0,0.22)',
  '--slot-empty':   '#f3f4f6',
  '--slot-hover':   '#eef2ff',
  '--input':        '#f9fafb',
  '--accent':       '#4f46e5',
  '--accent-soft':  '#eef2ff',
}

export const DARK: Record<string, string> = {
  '--bg':           '#0e0e10',
  '--sidebar':      '#1c1c1e',
  '--card':         '#2c2c2e',
  '--card-hover':   '#3a3a3c',
  '--text-1':       '#f5f5f7',
  '--text-2':       '#98989d',
  '--text-3':       '#636366',
  '--border':       'rgba(255,255,255,0.08)',
  '--border-focus': 'rgba(255,255,255,0.22)',
  '--slot-empty':   '#2c2c2e',
  '--slot-hover':   '#1e2035',
  '--input':        '#1c1c1e',
  '--accent':       '#818cf8',
  '--accent-soft':  '#1e1e35',
}

function applyTokens(isDark: boolean) {
  const tokens = isDark ? DARK : LIGHT
  const root = document.documentElement
  for (const [k, v] of Object.entries(tokens)) root.style.setProperty(k, v)
  root.style.setProperty('--background', tokens['--bg'])
  document.body.style.background = tokens['--bg']
  document.body.style.color = tokens['--text-1']
  if (isDark) root.classList.add('dark')
  else root.classList.remove('dark')
}

export default function GlobalStyles() {
  const isDark = useUIStore((s) => s.isDark)

  useEffect(() => {
    applyTokens(isDark)
  }, [isDark])

  return null
}
