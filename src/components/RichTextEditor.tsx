"use client";

import { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapUnderline from "@tiptap/extension-underline";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { EditorView } from "prosemirror-view";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Smile,
  UnderlineIcon,
  ImageIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { smilies } from "@/utils/smiles";

const ToolbarButton = ({
  tooltip,
  icon,
  onClick,
  isActive = false,
}: {
  tooltip: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        type="button"
        onClick={onClick}
      >
        {icon}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

export function RichTextEditor({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string) => void;
}) {
  const [isSmileyPanelOpen, setIsSmileyPanelOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapUnderline,
      TiptapLink.configure({ openOnClick: false }),
      TiptapImage,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "rounded-b-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm min-h-[250px] w-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      },
      handlePaste: (view: EditorView, event: ClipboardEvent): boolean => {
        let imageUrl: string | undefined;
        const htmlContent = event.clipboardData?.getData("text/html");
        if (htmlContent) {
          const match = htmlContent.match(/<img[^>]+src="([^">]+)"/);
          if (match) {
            imageUrl = match[1];
          }
        }

        if (!imageUrl) {
          const textContent = event.clipboardData?.getData("text/plain");
          if (
            textContent &&
            /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(textContent)
          ) {
            imageUrl = textContent;
          }
        }

        if (imageUrl) {
          const imageNodeType = view.state.schema.nodes.image;
          if (!imageNodeType) return false;

          const transaction = view.state.tr.replaceSelectionWith(
            imageNodeType.create({ src: imageUrl })
          );
          view.dispatch(transaction);
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor) {
      const isSame = editor.getHTML() === content;

      if (isSame) {
        return;
      }

      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const handleSmileyClick = (smiley: string) => {
    editor.chain().focus().insertContent(smiley).run();
    setIsSmileyPanelOpen(false);
  };

  const addImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="border rounded-md">
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
      <TooltipProvider delayDuration={100}>
        <div className="border-b rounded-t-md p-2 flex items-center gap-1 flex-wrap">
          <ToolbarButton
            tooltip="Negrito"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={<Bold size={16} />}
          />
          <ToolbarButton
            tooltip="Itálico"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={<Italic size={16} />}
          />
          <ToolbarButton
            tooltip="Sublinhado"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            icon={<UnderlineIcon size={16} />}
          />
          <ToolbarButton
            tooltip="Tachado"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={<Strikethrough size={16} />}
          />
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Popover open={isSmileyPanelOpen} onOpenChange={setIsSmileyPanelOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Smile size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="text-xl grid grid-cols-8 gap-1">
                {smilies.map((smiley, index) => (
                  <span
                    key={index}
                    className="cursor-pointer hover:bg-accent rounded-md text-center p-1"
                    onClick={() => handleSmileyClick(smiley)}
                  >
                    {smiley}
                  </span>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <ToolbarButton
            tooltip="Lista"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={<List size={16} />}
          />
          <ToolbarButton
            tooltip="Lista Ordenada"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={<ListOrdered size={16} />}
          />
          <ToolbarButton
            tooltip="Citação"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={<Quote size={16} />}
          />
          <ToolbarButton
            tooltip="Código"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            icon={<Code size={16} />}
          />
          <ToolbarButton
            tooltip="Imagem"
            onClick={addImage}
            icon={<ImageIcon size={16} />}
          />
        </div>
      </TooltipProvider>
      <EditorContent editor={editor} />
    </div>
  );
}
