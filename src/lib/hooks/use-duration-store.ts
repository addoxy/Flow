import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type DurationState = {
  duration: number;
  allowedDurations: number[];
  addAllowedDuration: (duration: number) => void;
  removeAllowedDuration: (duration: number) => void;
  pickedDuration: number;
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
      pickedDuration: 0,
      allowedDurations: [15, 25, 30, 45, 60, 90, 120],
      isPaused: false,
      isCompleted: false,
      addAllowedDuration: (duration: number) =>
        set((state) => ({
          allowedDurations: [...state.allowedDurations, duration].sort((a, b) => a - b),
        })),
      removeAllowedDuration: (duration: number) =>
        set((state) => ({
          allowedDurations: state.allowedDurations.filter((d) => d !== duration),
          pickedDuration: state.pickedDuration === duration ? 0 : state.pickedDuration,
        })),
      setDuration: (minutes: number) =>
        set({
          duration: minutes * 60,
          pickedDuration: minutes,
          isPaused: true,
          isCompleted: false,
        }),
      decrementDuration: () =>
        set((state) => {
          const newDuration = Math.max(0, state.duration - (get().isPaused ? 0 : 1));
          return {
            duration: newDuration,
            isCompleted: newDuration === 0 && state.duration > 0,
          };
        }),
      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
      resetDuration: () =>
        set((state) => ({
          duration: state.pickedDuration * 60,
          isPaused: true,
          isCompleted: false,
        })),
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
      partialize: (state) => ({
        allowedDurations: state.allowedDurations,
        duration: state.duration,
        isPaused: state.isPaused,
        pickedDuration: state.pickedDuration,
      }),
    }
  )
);
