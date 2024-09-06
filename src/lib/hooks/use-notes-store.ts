import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NoteProps = {
  id: string;
  content: string;
};

type RichTextState = {
  notes: NoteProps[];
  addNote: (content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
};

export const useNotesStore = create<RichTextState>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (content) =>
        set((state) => ({
          notes: [...state.notes, { id: crypto.randomUUID(), content: content }],
        })),
      updateNote: (id, content) =>
        set((state) => ({
          notes: state.notes.map((note) => (note.id === id ? { ...note, content } : note)),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),
    }),
    {
      name: 'notes-storage',
    }
  )
);
