import { useEffect } from 'react';
import { useAudioPlayer } from './use-audio-player';
import { useDurationStore } from './use-duration-store';

export const useDurationTracker = () => {
  const { duration, decrementDuration, isHydrated, isCompleted } = useDurationStore();
  const { loadAudio, play, pause } = useAudioPlayer();

  useEffect(() => {
    loadAudio('success', '/audio/success.mp3');
  }, []);

  useEffect(() => {
    if (isCompleted) {
      play('success');
      const timeout = setTimeout(() => {
        pause();
      }, 6500);
      return () => clearTimeout(timeout);
    }
  }, [isCompleted, play, pause]);

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
