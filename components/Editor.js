"use client";

import { Fragment } from "react";
import { common, createLowlight } from "lowlight";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import IFrame from "@/components/nodes/iFrame";
import TwitterBadge from "@/components/nodes/TwitterBadge";
import { Link } from "@/components/nodes/Link";
import AiGeneration from "@/components/nodes/AiGeneration";
import { TweetEmbed } from "@/components/nodes/TweetEmbed";

import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  AtSymbolIcon,
  BoldIcon,
  ChatBubbleLeftEllipsisIcon,
  CodeBracketIcon,
  CommandLineIcon,
  GlobeAltIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  ItalicIcon,
  LinkIcon,
  ListBulletIcon,
  MinusIcon,
  NumberedListIcon,
  PhotoIcon,
  UnderlineIcon,
} from "@heroicons/react/16/solid";
import { TwitterIcon, YoutubeIcon } from "@/utils/icons";

import AiMenu from "@/components/AiMenu";
import ToolbarEditor from "@/components/ui/toolbar";
import { useDialog } from "@/components/dialogs/provider";
import { YoutubeDialog } from "@/components/dialogs/youtube";
import { EmbedDialog } from "@/components/dialogs/embed";
import { MentionDialog, TweetDialog } from "@/components/dialogs/twitter";
import { ImageDialog } from "@/components/dialogs/image";
import { LinkDialog } from "@/components/dialogs/link";
import { ExportDialog } from "@/components/dialogs/export";
import { ImportDialog } from "@/components/dialogs/import";

import useKeyboardSound from "@/components/audio/useKeyboardSound";
import AudioButton from "@/components/audio/AudioButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const lowlight = createLowlight(common);

export default function Editor({ content }) {
  const playKeyboardSound = useKeyboardSound();
  const {
    setIsOpenYoutube,
    setIsOpenEmbed,
    setIsOpenMention,
    setIsOpenImage,
    setIsOpenLink,
    setIsOpenTweet,
    setIsOpenExport,
    setIsOpenImport,
  } = useDialog();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
      }),
      Link,
      Underline,
      Code.configure({
        HTMLAttributes: {
          class:
            "bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-700 dark:text-zinc-300",
        },
      }),
      CodeBlockLowlight.configure({
        HTMLAttributes: {
          class:
            "border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-md",
        },
        lowlight,
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: "rounded-md w-full aspect-video overflow-hidden my-8",
        },
        height: "auto",
        nocookie: true,
      }),
      IFrame.configure({
        HTMLAttributes: {
          class: "w-full rounded-md overflow-hidden my-8",
        },
      }),
      TwitterBadge,
      AiGeneration,
      TweetEmbed,
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        spellcheck: "false",
        class:
          "outline-none min-h-96 prose max-w-none prose-hr:my-6 prose-strong:text-zinc-700 dark:prose-strong:text-zinc-300 prose-img:rounded-md  prose-img:mx-auto prose-a:underline-offset-2 prose-a:underline prose-a:font-medium prose-a:text-zinc-700 dark:prose-a:text-zinc-300 dark:prose-invert prose-zinc mx-auto prose-headings:font-semibold dark:prose-headings:text-zinc-200 prose-headings:text-zinc-800 prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-li:text-zinc-600 dark:prose-li:text-zinc-400 prose-h1:text-3xl prose-h1:font-bold prose-h2:text-xl prose-h3:text-lg prose-img:shadow-lg prose-pre:bg-transparent prose-pre:my-1 prose-figure:bg-zinc-800 dark:prose-figure:bg-black/50 prose-figcaption:px-3 prose-figcaption:py-2 prose-figcaption:border-b prose-figcaption:border-zinc-600 dark:prose-figcaption:border-zinc-800 prose-figcaption:text-zinc-400 prose-figure:rounded-md duration-150",
      },
      handleKeyDown: (view, e) => {
        if (
          e.repeat &&
          (e.key === "Ctrl" || e.key === "Shift" || e.key === "Alt")
        ) {
          return;
        }

        playKeyboardSound(e.key);
      },
      handleDrop: (view, event, slice, moved) => {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          const file = event.dataTransfer.files[0];
          const fileReader = new FileReader();

          if (file.type.startsWith("image/")) {
            event.preventDefault();

            fileReader.onload = (readerEvent) => {
              if (typeof readerEvent.target?.result === "string") {
                const base64 = readerEvent.target.result;
                const { pos } = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });
                editor
                  .chain()
                  .focus()
                  .insertContentAt(pos, {
                    type: "image",
                    attrs: { src: base64 },
                  })
                  .run();
              }
            };

            fileReader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const commands = [
    {
      label: "Bold",
      action: "bold",
      type: "style",
      icon: <BoldIcon className="size-3.5" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      shortcut: "⌘ B",
    },
    {
      label: "Italic",
      action: "italic",
      type: "style",
      icon: <ItalicIcon className="size-3.5" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      shortcut: "⌘ I",
    },
    {
      label: "Underline",
      action: "underline",
      type: "style",
      icon: <UnderlineIcon className="size-3.5" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      shortcut: "⌘ U",
      divideAfter: true,
    },
    {
      label: "H1",
      action: ("headings", { level: 1 }),
      type: "text",
      icon: <H1Icon className="size-3.5" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      shortcut: "⌘ ⌥ 1",
    },
    {
      label: "H2",
      action: ("headings", { level: 2 }),
      type: "text",
      icon: <H2Icon className="size-3.5" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      shortcut: "⌘ ⌥ 2",
    },
    {
      label: "H3",
      action: ("headings", { level: 3 }),
      type: "text",
      icon: <H3Icon className="size-3.5" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      shortcut: "⌘ ⌥ 3",
      divideAfter: true,
    },
    {
      label: "Bullet List",
      action: "bulletList",
      type: "format",
      icon: <ListBulletIcon className="size-3.5" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      shortcut: "⌘ ⇧ 8",
    },
    {
      label: "Ordered List",
      action: "orderedList",
      type: "format",
      icon: <NumberedListIcon className="size-3.5" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      shortcut: "⌘ ⇧ 7",
    },
    {
      label: "Divider",
      action: "horizontalRule",
      type: "format",
      icon: <MinusIcon className="size-3.5" />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      divideAfter: true,
    },
    {
      label: "Link",
      action: "link",
      type: "blocks",
      icon: <LinkIcon className="size-3.5" />,
      onClick: () => setIsOpenLink(true),
    },
    {
      label: "Block Quote",
      action: "blockquote",
      type: "blocks",
      icon: <ChatBubbleLeftEllipsisIcon className="size-3.5" />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      shortcut: "⌘ ⇧ B",
    },
    {
      label: "Code",
      action: "code",
      type: "blocks",
      icon: <CommandLineIcon className="size-3.5" />,
      onClick: () => editor.chain().focus().toggleCode().run(),
      shortcut: "⌘ E",
      divideAfter: true,
    },
    {
      label: "Code Block",
      action: "codeBlock",
      type: "utils",
      icon: <CodeBracketIcon className="size-3.5" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      shortcut: "⌘ ⌥ C",
    },
    {
      label: "Image",
      action: "image",
      type: "utils",
      icon: <PhotoIcon className="size-3.5" />,
      onClick: () => setIsOpenImage(true),
    },
    {
      label: "Youtube",
      action: "youtube",
      type: "utils",
      icon: <YoutubeIcon className="size-3.5" />,
      onClick: () => setIsOpenYoutube(true),
    },
    {
      label: "Twitter",
      action: "twitter",
      type: "utils",
      icon: <TwitterIcon className="size-3.5" />,
      onClick: () => setIsOpenTweet(true),
    },
    {
      label: "Twitter Mention",
      action: "twitterMention",
      type: "utils",
      icon: <AtSymbolIcon className="size-3.5" />,
      onClick: () => setIsOpenMention(true),
    },
    {
      label: "Embed",
      action: "embed",
      type: "utils",
      icon: <GlobeAltIcon className="size-3.5" />,
      onClick: () => setIsOpenEmbed(true),
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="group rounded-lg text-xs font-semibold border flex items-center gap-1 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-200 hover:text-zinc-800 transition-colors duration-75 ease-out px-1.5 h-7 text-zinc-600 dark:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUturnLeftIcon className="size-3.5" />
            <span className="sr-only">Undo</span>
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="group rounded-lg text-xs font-semibold border flex items-center gap-1 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-200 hover:text-zinc-800 transition-colors duration-75 ease-out px-1.5 h-7 text-zinc-600 dark:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUturnRightIcon className="size-3.5" />
            <span className="sr-only">Redo</span>
          </button>
          <AiMenu editor={editor} />
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsOpenImport(true)}
            className="group rounded-lg text-xs font-semibold border flex items-center gap-1 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-200 hover:text-zinc-800 transition-colors duration-75 ease-out px-1.5 h-7 text-zinc-600 dark:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUpTrayIcon className="size-3.5 group-data-[hover]:scale-110 transition ease-out" />
            Import
          </button>
          <button
            onClick={() => setIsOpenExport(true)}
            className="group rounded-lg text-xs font-semibold border flex items-center gap-1 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-200 hover:text-zinc-800 transition-colors duration-75 ease-out px-1.5 h-7 text-zinc-600 dark:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon className="size-3.5 group-data-[hover]:scale-110 transition ease-out" />
            Export
          </button>
        </div>
      </div>
      <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 rounded-full my-2" />

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full mx-auto">
        <TooltipProvider>
          {commands.map((command, index) => (
            <Fragment key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={command.onClick}
                    disabled={!command.onClick}
                    aria-label={command.label}
                    className={`rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 data-hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors duration-75 ease-out p-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                      editor.isActive(command.action)
                        ? "text-zinc-800 dark:text-zinc-200"
                        : "text-zinc-500"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      {command.icon}
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>{command.label}</TooltipContent>
              </Tooltip>
              {command.divideAfter && (
                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 rounded-full shrink-0" />
              )}
            </Fragment>
          ))}
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 rounded-full shrink-0" />
          <AudioButton />
        </TooltipProvider>
      </div>

      <div
        className="h-px w-full bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 mb-4"
        id="editor"
      />
      <EditorContent editor={editor} />
      <ToolbarEditor editor={editor} commands={commands} />

      <ExportDialog editor={editor} />
      <ImportDialog editor={editor} />

      <YoutubeDialog editor={editor} />
      <EmbedDialog editor={editor} />
      <MentionDialog editor={editor} />
      <ImageDialog editor={editor} />
      <LinkDialog editor={editor} />
      <TweetDialog editor={editor} />
    </>
  );
}
