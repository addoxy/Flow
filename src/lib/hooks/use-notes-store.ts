import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type NoteProps = {
  id: string;
  content: string;
};

type RichTextState = {
  notes: NoteProps[];
  addNote: (content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
};

export const useNotesStore = create<RichTextState>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (content) =>
        set((state) => ({
          notes: [...state.notes, { id: crypto.randomUUID(), content }],
        })),
      updateNote: (id, content) =>
        set((state) => ({
          notes: state.notes.map((note) => (note.id === id ? { ...note, content } : note)),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),
      isHydrated: false,
      setHydrated: (state: boolean) => set({ isHydrated: state }),
    }),
    {
      name: 'notes-storage',
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
