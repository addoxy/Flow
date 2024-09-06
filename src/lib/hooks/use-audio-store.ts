import { create } from 'zustand';

interface AudioPlayerState {
  currentSong: string | null;
  isPlaying: boolean;
  audioContext: AudioContext | null;
  sourceNodes: Map<string, AudioBufferSourceNode>;
  buffers: Map<string, AudioBuffer>;
  play: (songName: string) => void;
  pause: () => void;
  toggle: (songName: string) => void;
  loadAudio: (songName: string, audioUrl: string) => Promise<void>;
}

export const useAudioPlayerStore = create<AudioPlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  audioContext: null,
  sourceNodes: new Map(),
  buffers: new Map(),

  play: (songName: string) => {
    const { currentSong, audioContext, buffers, sourceNodes } = get();
    if (!audioContext) return;

    if (currentSong && currentSong !== songName) {
      const currentSource = sourceNodes.get(currentSong);
      if (currentSource) {
        currentSource.stop();
        sourceNodes.delete(currentSong);
      }
    }

    const buffer = buffers.get(songName);
    if (buffer) {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.loop = true;
      source.start(0);
      sourceNodes.set(songName, source);
      set({ currentSong: songName, isPlaying: true });
    }
  },

  pause: () => {
    const { currentSong, sourceNodes } = get();
    if (currentSong) {
      const source = sourceNodes.get(currentSong);
      if (source) {
        source.stop();
        sourceNodes.delete(currentSong);
      }
      set({ isPlaying: false });
    }
  },

  toggle: (songName: string) => {
    const { currentSong, isPlaying } = get();
    if (currentSong === songName && isPlaying) {
      get().pause();
    } else {
      get().play(songName);
    }
  },

  loadAudio: async (songName: string, audioUrl: string) => {
    const { audioContext, buffers } = get();
    let context = audioContext;
    if (!context) {
      context = new (window.AudioContext || (window as any).webkitAudioContext)();
      set({ audioContext: context });
    }

    try {
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);
      buffers.set(songName, audioBuffer);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  },
}));
