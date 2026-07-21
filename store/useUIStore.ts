import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const ZOOM_STEPS = [0.5, 0.75, 1, 1.25] as const
export type Zoom = (typeof ZOOM_STEPS)[number]

export type LibraryTab = 'all' | 'photo' | 'reel' | 'unposted'

interface UIStore {
  zoom: Zoom
  isDark: boolean
  previewSlotId: string | null
  selectedAssetIds: string[]
  activePillar: string | null
  libraryTab: LibraryTab

  setZoom: (z: Zoom) => void
  zoomIn: () => void
  zoomOut: () => void
  toggleDark: () => void
  setPreview: (slotId: string | null) => void
  toggleAssetSelection: (assetId: string, additive: boolean) => void
  clearSelection: () => void
  setActivePillar: (id: string | null) => void
  setLibraryTab: (tab: LibraryTab) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      zoom: 1,
      isDark: false,
      previewSlotId: null,
      selectedAssetIds: [],
      activePillar: null,
      libraryTab: 'all',

      setZoom: (zoom) => set({ zoom }),

      zoomIn: () => {
        const idx = ZOOM_STEPS.indexOf(get().zoom)
        if (idx < ZOOM_STEPS.length - 1) set({ zoom: ZOOM_STEPS[idx + 1] })
      },

      zoomOut: () => {
        const idx = ZOOM_STEPS.indexOf(get().zoom)
        if (idx > 0) set({ zoom: ZOOM_STEPS[idx - 1] })
      },

      toggleDark: () => {
        const next = !get().isDark
        set({ isDark: next })
        if (next) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
      },

      setPreview: (slotId) => set({ previewSlotId: slotId }),

      toggleAssetSelection: (assetId, additive) =>
        set((state) => {
          if (!additive) {
            const already =
              state.selectedAssetIds.length === 1 &&
              state.selectedAssetIds[0] === assetId
            return { selectedAssetIds: already ? [] : [assetId] }
          }
          return {
            selectedAssetIds: state.selectedAssetIds.includes(assetId)
              ? state.selectedAssetIds.filter((id) => id !== assetId)
              : [...state.selectedAssetIds, assetId],
          }
        }),

      clearSelection: () => set({ selectedAssetIds: [] }),
      setActivePillar: (id) =>
        set((s) => ({ activePillar: s.activePillar === id ? null : id })),
      setLibraryTab: (tab) => set({ libraryTab: tab }),
    }),
    {
      name: 'feed-planner-ui',
      partialize: (s) => ({ zoom: s.zoom, isDark: s.isDark }),
    },
  ),
)
