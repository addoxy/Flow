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
import { Reorder } from 'framer-motion';
import parse from 'html-react-parser';
import { Edit, Plus, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import RichTextEditor from './rich-text-editor';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

const Notes = () => {
  const notes = useNotesStore((state) => state.notes);
  const setNotes = useNotesStore((state) => state.setNotes);

  return (
    <Card className="group">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Notes</CardTitle>
          <AddNoteDialog className="opacity-0 animate-transition group-hover:opacity-100" />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="flex h-full flex-col">
          <Reorder.Group axis="y" values={notes} onReorder={setNotes} layoutScroll>
            {notes.map((note) => (
              <Reorder.Item
                key={note.id}
                value={note}
                className="group/reorder mt-2 cursor-pointer first-of-type:mt-0"
              >
                <Note key={note.id} {...note} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const Note = (props: NoteProps & { className?: string }) => {
  const { id, content, className } = props;

  return (
    <div className={cn('group/note relative', className)}>
      <div className="min-h-12 w-full overflow-auto rounded-md bg-secondary/60 px-3 py-2 pr-16 text-sm ring-offset-background animate-transition placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 group-hover/reorder:bg-accent">
        {parse(content)}
      </div>
      <div className="absolute right-1 top-1 opacity-0 animate-transition group-hover/note:opacity-100">
        <div className="flex items-center">
          <UpdateNoteDialog {...props} className="hover:bg-foreground/10" />
          <DeleteNoteDialog {...props} className="hover:bg-foreground/10" />
        </div>
      </div>
    </div>
  );
};

const AddNoteDialog = ({ className }: { className?: string }) => {
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
        <Button size="icon" variant="ghost" className={cn(className)}>
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
