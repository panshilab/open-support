import { useEffect, type ReactNode } from 'react';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ImageIcon from '@mui/icons-material/Image';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Paper,
  Stack,
  Tooltip,
} from '@mui/material';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  helperText?: string;
  minHeight?: number;
}

export function RichTextEditor({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  helperText,
  minHeight = 180,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'rich-text-editor-content',
      },
      handleDOMEvents: {
        blur: () => {
          onBlur?.();
          return false;
        },
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === value) {
      return;
    }

    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  return (
    <FormControl fullWidth>
      {label ? <FormLabel sx={{ mb: 1 }}>{label}</FormLabel> : null}
      <Paper variant="outlined">
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ borderBottom: 1, borderColor: 'divider', p: 0.75 }}
        >
          <ToolbarButton
            active={editor?.isActive('bold')}
            label="Bold"
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <FormatBoldIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('italic')}
            label="Italic"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <FormatItalicIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('bulletList')}
            label="Bullet list"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulletedIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('orderedList')}
            label="Numbered list"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumberedIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            label="Insert image"
            onClick={() => {
              const url = window.prompt('Image URL');

              if (url) {
                editor?.chain().focus().setImage({ src: url }).run();
              }
            }}
          >
            <ImageIcon fontSize="small" />
          </ToolbarButton>
          <Box sx={{ flex: 1 }} />
          <ToolbarButton label="Undo" onClick={() => editor?.chain().focus().undo().run()}>
            <UndoIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton label="Redo" onClick={() => editor?.chain().focus().redo().run()}>
            <RedoIcon fontSize="small" />
          </ToolbarButton>
        </Stack>
        <Box sx={{ minHeight, px: 2, py: 1.5 }}>
          <EditorContent editor={editor} />
        </Box>
      </Paper>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
}

function ToolbarButton({
  active,
  children,
  label,
  onClick,
}: Readonly<{
  active?: boolean;
  children: ReactNode;
  label: string;
  onClick: () => void;
}>) {
  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        color={active ? 'primary' : 'default'}
        onClick={onClick}
        size="small"
        type="button"
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}
