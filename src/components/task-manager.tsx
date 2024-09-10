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
import { TodoProps, useTodoStore } from '@/lib/hooks/use-todo-store';
import { cn } from '@/lib/utils';
import { Edit, Plus, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

const TaskManager = () => {
  const todos = useTodoStore((state) => state.todos);

  return (
    <Card className="group">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          <AddTodoDialog className="animate-transition opacity-0 group-hover:opacity-100" />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="flex h-full flex-col px-4">
          {todos.map((todo) => (
            <Todo
              key={todo.id}
              {...todo}
              className="border-b p-6 first-of-type:pt-0 last-of-type:border-b-0"
            />
          ))}
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
    <div className={cn('group/todo flex items-center justify-between gap-2', className)}>
      <div className="flex items-center gap-4">
        <Checkbox
          className="rounded-[3px]"
          checked={completed}
          onCheckedChange={handleCheckedChange}
        />
        <p className={cn('text-sm', completed && 'line-through')}>{text}</p>
      </div>
      <div className="animate-transition flex items-center opacity-0 group-hover/todo:opacity-100">
        <EditTodoDialog {...props} />
        <DeleteTodoDialog {...props} />
      </div>
    </div>
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
        <Button size="icon" variant="ghost" className={cn(className)}>
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add todo</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new todo</DialogTitle>
          <DialogDescription>Add a new todo below. Click Save when you're done.</DialogDescription>
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
        <Button size="icon" variant="ghost">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Update todo</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update todo</DialogTitle>
          <DialogDescription>
            Update your todo below. Click Save when you're done.
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
        <Button size="icon" variant="ghost">
          <X className="h-4 w-4" />
          <span className="sr-only">Delete todo</span>
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

export default TaskManager;
