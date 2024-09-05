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
import { Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

const TaskManager = () => {
  const todos = useTodoStore((state) => state.todos);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Task Manager</CardTitle>
          <AddTodoDialog />
        </div>
      </CardHeader>
      <CardContent className="mt-8">
        <ScrollArea className="flex h-full flex-col px-4">
          {todos.map((todo) => (
            <Todo key={todo.id} {...todo} className="border-b p-6 first-of-type:pt-0" />
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
    <div className={cn('flex items-center gap-4', className)}>
      <Checkbox
        className="rounded-[3px]"
        checked={completed}
        onCheckedChange={handleCheckedChange}
      />
      <p className={cn('text-sm', completed && 'line-through')}>{text}</p>
    </div>
  );
};

const AddTodoDialog = () => {
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
        <Button size="icon" variant="ghost">
          <Plus className="h-5 w-5" />
          <span className="sr-only">Reset</span>
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

export default TaskManager;
