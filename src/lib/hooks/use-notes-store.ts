import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type NoteProps = {
  id: string;
  content: string;
  archived: boolean;
};

type RichTextState = {
  notes: NoteProps[];
  addNote: (content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  archiveNote: (id: string) => void;
  unarchiveNote: (id: string) => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
  setNotes: (notes: NoteProps[]) => void;
};

export const useNotesStore = create<RichTextState>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (content) =>
        set((state) => ({
          notes: [...state.notes, { id: crypto.randomUUID(), content, archived: false }],
        })),
      updateNote: (id, content) =>
        set((state) => ({
          notes: state.notes.map((note) => (note.id === id ? { ...note, content } : note)),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),
      archiveNote: (id) =>
        set((state) => ({
          notes: state.notes.map((note) => (note.id === id ? { ...note, archived: true } : note)),
        })),
      unarchiveNote: (id) =>
        set((state) => ({
          notes: state.notes.map((note) => (note.id === id ? { ...note, archived: false } : note)),
        })),
      isHydrated: false,
      setHydrated: (state: boolean) => set({ isHydrated: state }),
      setNotes: (notes: NoteProps[]) => set({ notes }),
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
