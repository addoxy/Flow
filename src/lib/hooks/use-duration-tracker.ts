import { useEffect } from 'react';
import { useAudioPlayer } from './use-audio-player';
import { useDurationStore } from './use-duration-store';

export const useDurationTracker = () => {
  const { duration, decrementDuration, isHydrated, isCompleted } = useDurationStore();
  const { loadAudio, play, toggle } = useAudioPlayer();

  useEffect(() => {
    loadAudio('success', '/audio/success.mp3');
  }, []);

  useEffect(() => {
    if (isCompleted) {
      play('success');
      const timeout = setTimeout(() => {
        toggle('success');
      }, 6000);
      return () => clearTimeout(timeout);
    }
  }, [isCompleted, play, toggle]);

  useEffect(() => {
    if (!isHydrated) return;

    const interval = setInterval(() => {
      requestAnimationFrame(() => {
        const currentDuration = useDurationStore.getState().duration;
        if (currentDuration > 0) {
          decrementDuration();
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [decrementDuration, isHydrated]);

  return { duration, isLoading: !isHydrated };
};
