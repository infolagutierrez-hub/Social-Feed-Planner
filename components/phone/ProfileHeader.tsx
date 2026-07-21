'use client'

import { useState } from 'react'
import { Grid3X3, Film, Tag } from 'lucide-react'

const STATS = [
  { label: 'Posts', value: '284' },
  { label: 'Followers', value: '12.4K' },
  { label: 'Following', value: '891' },
]

type Tab = 'grid' | 'reels' | 'tagged'

export default function ProfileHeader() {
  const [activeTab, setActiveTab] = useState<Tab>('grid')

  return (
    <div className="bg-white">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-4">
          <div className="w-[68px] h-[68px] rounded-full overflow-hidden ring-[1.5px] ring-gray-200 flex-shrink-0">
            <img
              src="https://picsum.photos/seed/avatar99/200/200"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-1 justify-around">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-[13px] font-bold text-gray-900 leading-tight">
                  {stat.value}
                </p>
                <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2.5">
          <p className="text-[12px] font-semibold text-gray-900">yourusername</p>
          <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
            Creative Director & Storyteller
            <br />
            ✦ Barcelona, Spain
          </p>
        </div>

        <button className="mt-2.5 w-full py-[5px] rounded-lg bg-gray-100 text-[11px] font-semibold text-gray-800 hover:bg-gray-200 transition-colors active:scale-[0.98]">
          Edit Profile
        </button>
      </div>

      <div className="flex border-t border-gray-200 mt-1">
        {(
          [
            { id: 'grid', Icon: Grid3X3 },
            { id: 'reels', Icon: Film },
            { id: 'tagged', Icon: Tag },
          ] as { id: Tab; Icon: React.ComponentType<{ size: number }> }[]
        ).map(({ id, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex justify-center py-[10px] transition-colors ${
              activeTab === id
                ? 'text-gray-900 border-b-[1.5px] border-gray-900'
                : 'text-gray-400 border-b-[1.5px] border-transparent'
            }`}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>
    </div>
  )
}
