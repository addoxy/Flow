import { useCallback, useEffect } from 'react';
import { useAudioPlayerStore } from './use-audio-store';

export const useAudioPlayer = () => {
  const store = useAudioPlayerStore();

  const loadAudio = useCallback((songName: string, audioUrl: string) => {
    store.loadAudio(songName, audioUrl);
  }, []);

  useEffect(() => {
    if (!store.audioContext) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      store.audioContext = context;
    }
  }, []);

  return {
    ...store,
    loadAudio,
  };
};
