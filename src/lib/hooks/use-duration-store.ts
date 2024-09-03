import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type DurationState = {
  duration: number;
  setDuration: (minutes: number) => void;
  decrementDuration: () => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
};

export const useDurationStore = create<DurationState>()(
  persist(
    (set) => ({
      duration: 0,
      setDuration: (minutes: number) => set({ duration: minutes * 60 }),
      decrementDuration: () => set((state) => ({ duration: Math.max(0, state.duration - 1) })),

      isHydrated: false,
      setHydrated: (state: boolean) => set({ isHydrated: state }),
    }),
    {
      name: 'duration-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
