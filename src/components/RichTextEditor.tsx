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
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronDown,
  Palette,
  EyeOff,
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
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import FontSize from "@tiptap/extension-font-size";
import imageCompression from "browser-image-compression";
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
  onImageAdd,
}: {
  content: string;
  setContent: (content: string) => void;
  onImageAdd?: (file: File) => void;
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
      TextStyle,
      Color,
      FontSize,
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none prose-ol:list-decimal prose-ul:list-disc rounded-b-md border border-slate-600 border-input bg-transparent px-3 py-2 text-sm shadow-sm min-h-[250px] w-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !editor) {
      return;
    }

    const options = {
      maxSizeMB: 2,
      initialQuality: 0.9,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      onImageAdd?.(compressedFile);

      const url = URL.createObjectURL(compressedFile);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      onImageAdd?.(file);

      const url = URL.createObjectURL(file);
      editor.chain().focus().setImage({ src: url }).run();
    }

    if (event.target) {
      event.target.value = "";
    }
  };

  return (
    <div className="border rounded-md border-slate-600">
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
      <TooltipProvider delayDuration={100}>
        <div className="border-b border-slate-600 rounded-t-md p-2 flex items-center gap-1 flex-wrap">
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
          <ToolbarButton
            tooltip="Alinhar à Esquerda"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            icon={<AlignLeft size={16} />}
          />
          <ToolbarButton
            tooltip="Centralizar"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            icon={<AlignCenter size={16} />}
          />
          <ToolbarButton
            tooltip="Alinhar à Direita"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            icon={<AlignRight size={16} />}
          />
          <Separator orientation="vertical" className="h-6 mx-1" />
          <div className="flex items-center border rounded-md p-1 ml-1 relative h-8 w-8">
            <Palette
              size={16}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="color"
              onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
                editor.chain().focus().setColor(event.target.value).run()
              }
              className="w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-8 w-auto px-2">
                <span>Tamanho da Fonte</span>
                <ChevronDown size={16} className="ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 max-h-72 overflow-y-auto bg-slate-700 text-white">
              <div className="grid grid-cols-4 gap-1">
                {[
                  8, 10, 12, 14, 16, 20, 24, 26, 30, 32, 36, 40, 48, 60, 72, 80,
                  90, 96,
                ].map((size) => (
                  <Button
                    key={size}
                    variant={
                      editor.isActive("textStyle", { fontSize: `${size}px` })
                        ? "secondary"
                        : "ghost"
                    }
                    onClick={() => {
                      editor.chain().focus().setFontSize(`${size}px`).run();
                    }}
                    className="w-full justify-center"
                  >
                    {size}
                  </Button>
                ))}
              </div>
              <Separator className="my-2" />
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => editor.chain().focus().setFontSize("16px").run()}
              >
                Resetar tamanho
              </Button>
            </PopoverContent>
          </Popover>
          <ToolbarButton
            tooltip="Spoiler"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={<EyeOff size={16} />}
          />
          <Popover open={isSmileyPanelOpen} onOpenChange={setIsSmileyPanelOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Smile size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-slate-700">
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
