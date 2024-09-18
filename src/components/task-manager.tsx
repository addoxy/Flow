'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TodoProps, useTodoStore } from '@/lib/hooks/use-todo-store';
import { cn } from '@/lib/utils';
import { Reorder } from 'framer-motion';
import { Archive, Edit, MoreVertical, Plus, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

const TaskManager = () => {
  const allTodos = useTodoStore((state) => state.todos);
  const setTodos = useTodoStore((state) => state.setTodos);

  const todos = allTodos.filter((todo) => !todo.archived);

  if (!todos || todos.length === 0) return <NoTodos />;

  return (
    <Card className="group">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          <div className="flex items-center">
            <ArchivedTodos className="animate-transition lg:opacity-0 lg:group-hover:opacity-100" />
            <AddTodoDialog className="animate-transition lg:opacity-0 lg:group-hover:opacity-100" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="flex h-full flex-col px-4">
          <Reorder.Group axis="y" values={todos} onReorder={setTodos} layoutScroll>
            {todos.map((todo, i) => (
              <Reorder.Item
                key={todo.id}
                value={todo}
                className="group/reorder cursor-pointer border-b last-of-type:border-b-0"
              >
                <Todo key={todo.id} {...todo} className="p-6" />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const Todo = (props: TodoProps) => {
  const { id, text, completed, className } = props;
  const toggleTodo = useTodoStore((state) => state.toggleTodo);

  function handleCheckedChange() {
    toggleTodo(id);
  }

  return (
    <div
      className={cn(
        'group/todo flex items-center justify-between gap-2 animate-transition group-hover/reorder:bg-accent',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Checkbox
          className="rounded-[3px]"
          checked={completed}
          onCheckedChange={handleCheckedChange}
        />
        <p className={cn('text-sm', completed && 'line-through')}>{text}</p>
      </div>
      <TodoMenu
        todo={props}
        className="animate-transition lg:opacity-0 lg:group-hover/todo:opacity-100"
      />
    </div>
  );
};

type TodoMenuProps = {
  todo: TodoProps;
  className?: string;
};

const TodoMenu = (props: TodoMenuProps) => {
  const { todo, className } = props;
  const [open, setOpen] = useState(false);
  const archiveTodo = useTodoStore((state) => state.archiveTodo);
  const unarchiveTodo = useTodoStore((state) => state.unarchiveTodo);
  const isArchived = todo.archived;

  const handleArchive = () => {
    if (isArchived) {
      unarchiveTodo(todo.id);
    } else {
      archiveTodo(todo.id);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn(className, open && 'lg:opacity-100')}>
          <MoreVertical className="size-4 rotate-90" />
          <span className="sr-only">Todo menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="h-9 w-full cursor-pointer justify-start gap-2 px-2 text-sm hover:bg-accent"
            onClick={handleArchive}
          >
            <Archive className="size-3" />
            {isArchived ? 'Unarchive' : 'Archive'}
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <EditTodoDialog {...todo} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DeleteTodoDialog {...todo} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AddTodoDialog = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false);
  const [todo, setTodo] = useState('');
  const addTodo = useTodoStore((state) => state.addTodo);

  function handleAddTodo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addTodo(todo);
    setOpen(false);
    setTodo('');
  }

  function handleCancel() {
    setOpen(false);
    setTodo('');
  }

  function handleOpenChange() {
    setOpen(!open);
    setTodo('');
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="icon" className={cn(className)}>
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add todo</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new todo</DialogTitle>
          <DialogDescription>
            Add a new todo below. Click Save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddTodo} className="mt-4 flex flex-col">
          <Label>Todo</Label>
          <Input
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="mt-2"
          />
          <div className="mt-4 flex gap-2">
            <Button onClick={handleCancel} variant="secondary" className="w-full" type="reset">
              Cancel
            </Button>
            <Button type="submit" className="w-full">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EditTodoDialog = (props: TodoProps) => {
  const [open, setOpen] = useState(false);
  const [todo, setTodo] = useState('');
  const updateTodo = useTodoStore((state) => state.updateTodo);

  function handleUpdateTodo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateTodo(props.id, todo);
    setOpen(false);
    setTodo(todo);
  }

  function handleCancel() {
    setOpen(false);
    setTodo(props.text);
  }

  function handleOpenChange() {
    setOpen(!open);
    setTodo(props.text);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 w-full justify-start gap-2 px-2 text-sm hover:bg-accent"
        >
          <Edit className="size-3" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update todo</DialogTitle>
          <DialogDescription>
            Update your todo below. Click Save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdateTodo} className="mt-4 flex flex-col">
          <Label>Todo</Label>
          <Input
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Update todo..."
            className="mt-2"
          />
          <div className="mt-4 flex gap-2">
            <Button onClick={handleCancel} variant="secondary" className="w-full" type="reset">
              Cancel
            </Button>
            <Button type="submit" className="w-full">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteTodoDialog = (props: TodoProps) => {
  const [open, setOpen] = useState(false);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  function handleUpdateTodo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    deleteTodo(props.id);
    setOpen(false);
  }

  function handleCancel() {
    setOpen(false);
  }

  function handleOpenChange() {
    setOpen(!open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 w-full justify-start gap-2 px-2 text-sm hover:bg-accent"
        >
          <X className="size-3" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete todo</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this todo? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdateTodo} className="mt-4 flex flex-col">
          <div className="mt-4 flex gap-2">
            <Button onClick={handleCancel} variant="secondary" className="w-full" type="reset">
              Cancel
            </Button>
            <Button type="submit" variant="destructive" className="w-full">
              Delete
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ArchivedTodos = ({ className }: { className?: string }) => {
  const archivedTodos = useTodoStore((state) => state.todos.filter((todo) => todo.archived));

  if (!archivedTodos || archivedTodos.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="icon" className={cn(className)}>
          <Archive className="h-4 w-4" />
          <span className="sr-only">Archived todos</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archived todos</DialogTitle>
          <DialogDescription>
            See all archived todos below. Unarchive or delete them if you&apos;re done with them.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex h-full flex-col">
          {archivedTodos.map((todo, i) => (
            <Todo
              key={todo.id}
              {...todo}
              className="border-b p-6 last-of-type:border-b-0 hover:bg-accent"
            />
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const NoTodos = () => {
  return (
    <Card className="group">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          <div className="flex items-center">
            <ArchivedTodos className="animate-transition lg:opacity-0 lg:group-hover:opacity-100" />
            <AddTodoDialog className="animate-transition lg:opacity-0 lg:group-hover:opacity-100" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <p className="text-center">You have no tasks</p>
      </CardContent>
    </Card>
  );
};

export default TaskManager;
