import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type DurationState = {
  duration: number;
  isPaused: boolean;
  isCompleted: boolean;
  setDuration: (minutes: number) => void;
  decrementDuration: () => void;
  togglePause: () => void;
  resetDuration: () => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
};

export const useDurationStore = create<DurationState>()(
  persist(
    (set, get) => ({
      duration: 0,
      isPaused: false,
      isCompleted: false,
      setDuration: (minutes: number) =>
        set({ duration: minutes * 60, isPaused: true, isCompleted: false }),
      decrementDuration: () =>
        set((state) => {
          const newDuration = Math.max(0, state.duration - (get().isPaused ? 0 : 1));
          return {
            duration: newDuration,
            isCompleted: newDuration === 0 && state.duration > 0,
          };
        }),
      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
      resetDuration: () => set({ duration: 0, isPaused: false, isCompleted: false }),
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
