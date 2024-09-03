import { useEffect } from 'react';
import { useDurationStore } from './use-duration-store';

export const useDurationTracker = () => {
  const { duration, decrementDuration, isHydrated } = useDurationStore();

  useEffect(() => {
    if (!isHydrated) return;

    const interval = setInterval(() => {
      if (duration > 0) {
        decrementDuration();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, decrementDuration, isHydrated]);

  return { duration, isLoading: !isHydrated };
};
