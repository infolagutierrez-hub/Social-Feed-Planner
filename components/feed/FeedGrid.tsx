'use client'

import { useFeedStore } from '@/store/useFeedStore'
import FeedSlot from './FeedSlot'

export default function FeedGrid() {
  const feedSlots = useFeedStore((state) => state.feedSlots)

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}
    >
      {feedSlots.map((slot) => (
        <FeedSlot key={slot.id} slot={slot} />
      ))}
    </div>
  )
}
