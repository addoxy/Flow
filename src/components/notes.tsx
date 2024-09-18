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
import { Archive, Edit, MoreVertical, Plus, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import RichTextEditor from './rich-text-editor';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

const Notes = () => {
  const allNotes = useNotesStore((state) => state.notes);
  const setNotes = useNotesStore((state) => state.setNotes);

  const notes = allNotes.filter((note) => !note.archived);

  if (!notes || notes.length === 0) return <NoNotes />;

  return (
    <Card className="group">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Notes</CardTitle>
          <div className="flex items-center">
            <ArchivedNotes className="animate-transition lg:opacity-0 lg:group-hover:opacity-100" />
            <AddNoteDialog className="animate-transition lg:opacity-0 lg:group-hover:opacity-100" />
          </div>
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
      <div className="min-h-12 w-full overflow-auto rounded-md bg-secondary/60 px-3 py-2 pr-16 text-sm ring-offset-background animate-transition placeholder:text-muted-foreground group-hover/reorder:bg-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
        {parse(content)}
      </div>
      <NoteMenu
        note={props}
        className="absolute right-1 top-1 animate-transition lg:opacity-0 lg:group-hover/note:opacity-100"
      ></NoteMenu>
    </div>
  );
};

type NotesMenuProps = {
  note: NoteProps;
  className?: string;
};

const NoteMenu = (props: NotesMenuProps) => {
  const { note, className } = props;
  const [open, setOpen] = useState(false);
  const archiveNote = useNotesStore((state) => state.archiveNote);
  const unarchiveNote = useNotesStore((state) => state.unarchiveNote);
  const isArchived = note.archived;

  const handleArchive = () => {
    if (isArchived) {
      unarchiveNote(note.id);
    } else {
      archiveNote(note.id);
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
          <EditNoteDialog {...note} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DeleteNoteDialog {...note} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
        <Button size="icon" variant="icon" className={cn(className)}>
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add notes</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new note</DialogTitle>
          <DialogDescription>
            Add a new note below. Click Save when you&apos;re done.
          </DialogDescription>
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

const EditNoteDialog = (props: NoteProps & { className?: string }) => {
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
          <DialogTitle>Update note</DialogTitle>
          <DialogDescription>
            Update your note below. Click Save when you&apos;re done.
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

const ArchivedNotes = ({ className }: { className?: string }) => {
  const archivedNotes = useNotesStore((state) => state.notes.filter((note) => note.archived));

  if (!archivedNotes || archivedNotes.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="icon" className={cn(className)}>
          <Archive className="h-4 w-4" />
          <span className="sr-only">Archived notes</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archived todos</DialogTitle>
          <DialogDescription>
            See all archived notes below. Unarchive or delete them if you&apos;re don't need them.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex h-full flex-col">
          {archivedNotes.map((note) => (
            <Note
              key={note.id}
              {...note}
              className="group/reorder mt-2 cursor-pointer first-of-type:mt-0"
            />
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const NoNotes = () => {
  return (
    <Card className="group">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Notes</CardTitle>
          <div className="flex items-center">
            <ArchivedNotes className="animate-transition lg:opacity-0 lg:group-hover:opacity-100" />
            <AddNoteDialog className="animate-transition lg:opacity-0 lg:group-hover:opacity-100" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <p className="text-center">You have no notes</p>
      </CardContent>
    </Card>
  );
};

export default Notes;
