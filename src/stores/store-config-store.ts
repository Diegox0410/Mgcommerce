import { create } from 'zustand'
import { defaultStoreConfig, type StoreConfig } from '../domain/store/store-config'

interface StoreConfigState {
  config: StoreConfig
  source: 'defaults' | 'remote'
  applyRemote: (config: StoreConfig | null) => void
  reset: () => void
}

export const useStoreConfigStore = create<StoreConfigState>((set) => ({
  config: defaultStoreConfig,
  source: 'defaults',
  applyRemote: (config) => config && set({ config, source: 'remote' }),
  reset: () => set({ config: defaultStoreConfig, source: 'defaults' }),
}))
