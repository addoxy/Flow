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
import { Plus } from 'lucide-react';
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
          <AddNotesDialog />
        </div>
      </CardHeader>
      <CardContent className="mt-8">
        <ScrollArea className="flex h-full flex-col px-4">
          {notes.map((note) => (
            <Note key={note.id} {...note} className="pt-2 first-of-type:pt-0" />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const Note = (props: NoteProps & { className?: string }) => {
  const { id, content, className } = props;

  return (
    <div className={cn(className)}>
      <RichTextEditor content={content} editable={false} className="bg-secondary" />
    </div>
  );
};

const AddNotesDialog = () => {
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
          <Label className="mb-3">Todo</Label>
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

export default Notes;
