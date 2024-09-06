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
import { NoteProps, useNotesStore } from '@/lib/hooks/use-notes-store';
import { cn } from '@/lib/utils';
import parse from 'html-react-parser';
import { Edit, Plus, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import RichTextEditor from './rich-text-editor';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

const Notes = () => {
  const notes = useNotesStore((state) => state.notes);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Notes</CardTitle>
          <AddNoteDialog />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="flex h-full flex-col">
          {notes.map((note) => (
            <Note key={note.id} {...note} className="mt-2 first-of-type:mt-0" />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const Note = (props: NoteProps & { className?: string }) => {
  const { id, content, className } = props;

  return (
    <div className={cn('group relative', className)}>
      <div className="min-h-12 w-full overflow-auto rounded-md bg-secondary/60 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
        {parse(content)}
      </div>
      <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100">
        <div className="flex items-center">
          <UpdateNoteDialog {...props} className="hover:bg-foreground/10" />
          <DeleteNoteDialog {...props} className="hover:bg-foreground/10" />
        </div>
      </div>
    </div>
  );
};

const AddNoteDialog = () => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string>('');
  const addNote = useNotesStore((state) => state.addNote);

  function handleAddNote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addNote(content);
    setOpen(false);
    setContent('');
  }

  function handleCancel() {
    setOpen(false);
    setContent('');
  }

  function handleOpenChange() {
    setOpen(!open);
    setContent('');
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add notes</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new note</DialogTitle>
          <DialogDescription>Add a new note below. Click Save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddNote} className="mt-4 flex flex-col">
          <Label className="mb-3">Note</Label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            editable
            className="max-w-[calc(32rem-7rem)] sm:max-w-[calc(32rem-3rem)]"
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

const UpdateNoteDialog = (props: NoteProps & { className?: string }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string>(props.content);
  const updateNote = useNotesStore((state) => state.updateNote);

  function handleUpdateNote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateNote(props.id, content);
    setOpen(false);
    setContent(content);
  }

  function handleCancel() {
    setOpen(false);
    setContent(props.content);
  }

  function handleOpenChange() {
    setOpen(!open);
    setContent(props.content);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className={cn(props.className)}>
          <Edit className="h-4 w-4" />
          <span className="sr-only">Update note</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update note</DialogTitle>
          <DialogDescription>
            Update your note below. Click Save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdateNote} className="mt-4 flex flex-col">
          <Label className="mb-3">Note</Label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            editable
            className="max-w-[calc(32rem-7rem)] sm:max-w-[calc(32rem-3rem)]"
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

const DeleteNoteDialog = (props: NoteProps & { className?: string }) => {
  const [open, setOpen] = useState(false);
  const deleteNote = useNotesStore((state) => state.deleteNote);

  function handleDeleteNote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    deleteNote(props.id);
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
        <Button size="icon" variant="ghost" className={cn(props.className)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Delete note</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete note</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this note? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDeleteNote} className="mt-4 flex flex-col">
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

export default Notes;
