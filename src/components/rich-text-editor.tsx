'use client';

import { cn } from '@/lib/utils';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const RichTextEditor = ({
  content,
  onChange,
  editable = true,
  className,
}: {
  content: string;
  onChange?: (value: string) => void;
  editable?: boolean;
  className?: string;
}) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: cn(
          'h-20 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto',
          className
        ),
      },
    },
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editable: editable,
  });

  return <EditorContent editor={editor} className="break-words" />;
};

export default RichTextEditor;
