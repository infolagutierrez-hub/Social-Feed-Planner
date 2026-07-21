'use client'

import { useState } from 'react'
import { Search, Upload, X, Library, CheckSquare, Image, Film, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFeedStore } from '@/store/useFeedStore'
import { useUIStore, type LibraryTab } from '@/store/useUIStore'
import AssetCard from './AssetCard'
import FeedInsights from '@/components/ui/FeedInsights'
import { cn } from '@/lib/utils'

const TABS: { id: LibraryTab; label: string; Icon: React.ComponentType<{ size: number }> }[] = [
  { id: 'all',      label: 'All',      Icon: Library },
  { id: 'photo',    label: 'Photo',    Icon: Image   },
  { id: 'reel',     label: 'Reel',     Icon: Film    },
  { id: 'unposted', label: 'Unposted', Icon: Clock   },
]

export default function AssetLibrary() {
  const assets = useFeedStore((s) => s.assets)
  const feedSlots = useFeedStore((s) => s.feedSlots)
  const { selectedAssetIds, clearSelection, toggleAssetSelection, libraryTab, setLibraryTab } =
    useUIStore()
  const [query, setQuery] = useState('')

  const postedIds = new Set(feedSlots.map((s) => s.assetId).filter(Boolean))

  const byTab = (() => {
    if (libraryTab === 'all') return assets
    if (libraryTab === 'unposted') return assets.filter((a) => !postedIds.has(a.id))
    return assets.filter((a) => a.contentType === libraryTab)
  })()

  const filtered = query
    ? byTab.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    : byTab

  function selectAll() {
    filtered.forEach((a, i) => toggleAssetSelection(a.id, i > 0))
  }

  return (
    <div
      className="flex flex-col h-full border-r"
      style={{ background: 'var(--sidebar)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-0 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Library size={15} style={{ color: 'var(--text-2)' }} />
            <h2 className="text-[13px] font-semibold tracking-[-0.01em]" style={{ color: 'var(--text-1)' }}>
              Content Library
            </h2>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >
            <Upload size={11} />
            Upload
          </motion.button>
        </div>

        {/* Content type tabs */}
        <div className="flex items-center gap-0 -mx-1 overflow-x-auto hide-scrollbar pb-0">
          {TABS.map(({ id, label, Icon }) => {
            const count =
              id === 'all'      ? assets.length :
              id === 'unposted' ? assets.filter((a) => !postedIds.has(a.id)).length :
              assets.filter((a) => a.contentType === id).length
            const isActive = libraryTab === id
            return (
              <button
                key={id}
                onClick={() => setLibraryTab(id)}
                className={cn(
                  'relative flex items-center gap-1 px-2.5 py-2 text-[11px] font-semibold whitespace-nowrap transition-colors flex-shrink-0',
                  isActive ? '' : 'opacity-50 hover:opacity-80',
                )}
                style={{ color: isActive ? 'var(--accent)' : 'var(--text-2)' }}
              >
                <Icon size={11} />
                <span>{label}</span>
                {count > 0 && (
                  <span
                    className="text-[9px] font-bold px-1 rounded-sm"
                    style={{
                      background: isActive ? 'var(--accent-soft)' : 'var(--slot-empty)',
                      color: isActive ? 'var(--accent)' : 'var(--text-3)',
                    }}
                  >
                    {count}
                  </span>
                )}
                {/* Active underline */}
                {isActive && (
                  <motion.div
                    layoutId="lib-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                    style={{ background: 'var(--accent)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-2.5 pb-2">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search content…"
            className="w-full pl-8 pr-7 py-2 text-[12px] rounded-lg border transition-all focus:outline-none"
            style={{ background: 'var(--input)', borderColor: 'var(--border)', color: 'var(--text-1)' }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--border-focus)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }}>
              <X size={12} />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>
            {filtered.length} item{filtered.length !== 1 ? 's' : ''}{query && ` for "${query}"`}
          </p>
          <button onClick={selectAll} className="flex items-center gap-1 text-[10px] font-medium hover:opacity-80" style={{ color: 'var(--accent)' }}>
            <CheckSquare size={10} /> Select all
          </button>
        </div>
      </div>

      {/* Selection bar */}
      <AnimatePresence>
        {selectedAssetIds.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2 text-[11px] font-semibold" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              <span>{selectedAssetIds.length} selected — drag to feed</span>
              <button onClick={clearSelection} className="hover:opacity-70"><X size={12} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-3 hide-scrollbar">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5">
            {filtered.map((asset, i) => (
              <AssetCard key={asset.id} asset={asset} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center gap-2">
            <Search size={22} style={{ color: 'var(--text-3)' }} />
            <p className="text-[12px]" style={{ color: 'var(--text-2)' }}>No content found</p>
          </div>
        )}
      </div>

      <FeedInsights />
    </div>
  )
}
