'use client'

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils'
import type { Asset } from '@/types'

interface Props {
  asset: Asset
  index: number
}

export default function AssetCard({ asset, index }: Props) {
  const { selectedAssetIds, toggleAssetSelection } = useUIStore()
  const isSelected = selectedAssetIds.includes(asset.id)
  const [imgLoaded, setImgLoaded] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const img = new window.Image()
    img.src = asset.imageUrl
    return img.complete && img.naturalWidth > 0
  })

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${asset.id}`,
    data: {
      type: 'library',
      asset,
      selectedIds: isSelected ? selectedAssetIds : [asset.id],
    },
  })

  function handleClick(e: React.MouseEvent) {
    const multi = e.metaKey || e.ctrlKey
    toggleAssetSelection(asset.id, multi)
  }

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      suppressHydrationWarning
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.015, 0.3), duration: 0.2, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={cn(
        'group relative rounded-xl overflow-hidden cursor-pointer select-none',
        'border transition-all duration-200',
        isSelected
          ? 'border-[var(--accent)] shadow-[0_0_0_2px_var(--accent-soft)] dark:shadow-[0_0_0_2px_rgba(79,70,229,0.3)]'
          : 'border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]',
        isDragging && 'opacity-25',
      )}
      style={{ background: 'var(--card)' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={asset.imageUrl}
          alt={asset.name}
          className={cn(
            'w-full h-full object-cover transition-all duration-300',
            'group-hover:scale-105',
            imgLoaded ? 'opacity-100' : 'opacity-0',
          )}
          draggable={false}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />

        {/* Selection checkmark */}
        <motion.div
          initial={false}
          animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] shadow-md"
        >
          <Check size={10} strokeWidth={3} className="text-white" />
        </motion.div>
      </div>

      {/* Meta */}
      <div className="px-2.5 py-2" style={{ background: 'var(--card)' }}>
        <p
          className="text-[11px] font-semibold truncate leading-tight"
          style={{ color: 'var(--text-1)' }}
        >
          {asset.name}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>
          {asset.date}
        </p>
      </div>
    </motion.div>
  )
}
