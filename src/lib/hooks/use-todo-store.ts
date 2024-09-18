import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type TodoProps = {
  id: string;
  text: string;
  completed: boolean;
  archived: boolean;
  className?: string;
};

type TodoState = {
  todos: TodoProps[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, text: string) => void;
  archiveTodo: (id: string) => void;
  unarchiveTodo: (id: string) => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
  setTodos: (todos: TodoProps[]) => void;
};

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            { id: crypto.randomUUID(), text, completed: false, archived: false },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      updateTodo: (id, text) =>
        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
        })),
      archiveTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? { ...todo, archived: true } : todo)),
        })),
      unarchiveTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? { ...todo, archived: false } : todo)),
        })),
      isHydrated: false,
      setHydrated: (state: boolean) => set({ isHydrated: state }),
      setTodos: (todos: TodoProps[]) => set({ todos }),
    }),
    {
      name: 'todo-storage',
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
