"use client";

import { Fragment } from "react";
import {
  EditorContent,
  FloatingMenu,
  BubbleMenu,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";

import { Button } from "@headlessui/react";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  AtSymbolIcon,
  BoldIcon,
  ChatBubbleLeftEllipsisIcon,
  CodeBracketIcon,
  CommandLineIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  GlobeAltIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  ItalicIcon,
  ListBulletIcon,
  MinusIcon,
  NumberedListIcon,
  UnderlineIcon,
} from "@heroicons/react/16/solid";
import { TwitterIcon, YoutubeIcon } from "@/utils/icons";

export default function Editor({ html }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      Code.configure({
        HTMLAttributes: {
          class:
            "bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-700 dark:text-zinc-300",
        },
      }),
      CodeBlock,
    ],
    content: html,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        spellcheck: "false",
        class:
          "outline-none min-h-96 prose max-w-none prose-hr:my-6 prose-strong:text-zinc-700 dark:prose-strong:text-zinc-300 prose-img:rounded-md prose-a:underline-offset-2 prose-a:underline prose-a:font-medium prose-a:text-zinc-700 dark:prose-a:text-zinc-300 dark:prose-invert prose-zinc mx-auto prose-headings:font-semibold dark:prose-headings:text-zinc-200 prose-headings:text-zinc-800 prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-li:text-zinc-600 dark:prose-li:text-zinc-400 prose-h1:text-3xl prose-h1:font-bold prose-h2:text-xl prose-h3:text-lg prose-img:shadow-lg prose-pre:bg-transparent prose-pre:my-1 prose-figure:bg-zinc-800 dark:prose-figure:bg-black/50 prose-figcaption:px-3 prose-figcaption:py-2 prose-figcaption:border-b prose-figcaption:border-zinc-600 dark:prose-figcaption:border-zinc-800 prose-figcaption:text-zinc-400 prose-figure:rounded-md duration-150",
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
    },
    {
      label: "Block Quote",
      action: "blockQuote",
      type: "format",
      icon: <ChatBubbleLeftEllipsisIcon className="size-3.5" />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      divideAfter: true,
    },
    {
      label: "Code",
      action: "code",
      type: "blocks",
      icon: <CommandLineIcon className="size-3.5" />,
      onClick: () => editor.chain().focus().toggleCode().run(),
      shortcut: "⌘ E",
    },
    {
      label: "Code Block",
      action: "codeBlock",
      type: "blocks",
      icon: <CodeBracketIcon className="size-3.5" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      shortcut: "⌘ ⌥ C",
      divideAfter: true,
    },
    {
      label: "Youtube",
      action: "youtube",
      type: "utils",
      icon: <YoutubeIcon className="size-3.5" />,
    },
    {
      label: "Twitter",
      action: "twitter",
      type: "utils",
      icon: <TwitterIcon className="size-3.5" />,
    },
    {
      label: "Twitter Mention",
      action: "twitterMention",
      type: "utils",
      icon: <AtSymbolIcon className="size-3.5" />,
    },
    {
      label: "Embed",
      action: "embed",
      type: "utils",
      icon: <GlobeAltIcon className="size-3.5" />,
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Button
            onClick={() => editor.chain().focus().undo().run()}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 data-[hover]:border-zinc-300 dark:data-[hover]:border-zinc-700 data-[hover]:text-zinc-800 dark:data-[hover]:text-zinc-200 transition-colors duration-75 ease-out p-1.5 text-zinc-500"
          >
            <ArrowUturnLeftIcon className="size-3.5" />
            <span className="sr-only">Undo</span>
          </Button>
          <Button
            onClick={() => editor.chain().focus().redo().run()}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 data-[hover]:border-zinc-300 dark:data-[hover]:border-zinc-700 data-[hover]:text-zinc-800 dark:data-[hover]:text-zinc-200 transition-colors duration-75 ease-out p-1.5 text-zinc-500"
          >
            <ArrowUturnRightIcon className="size-3.5" />
            <span className="sr-only">Redo</span>
          </Button>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            disabled={true}
            className="group rounded-lg text-xs font-semibold border flex items-center gap-1 border-zinc-200 dark:border-zinc-800 data-[hover]:border-zinc-300 dark:data-[hover]:border-zinc-700 dark:data-[hover]:text-zinc-200 data-[hover]:text-zinc-800 transition-colors duration-75 ease-out px-1.5 h-7 text-zinc-600 dark:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DocumentArrowDownIcon className="size-3.5 group-data-[hover]:scale-110 transition ease-out" />
            Import
          </Button>
          <Button
            disabled={true}
            className="group rounded-lg text-xs font-semibold border flex items-center gap-1 border-zinc-200 dark:border-zinc-800 data-[hover]:border-zinc-300 dark:data-[hover]:border-zinc-700 dark:data-[hover]:text-zinc-200 data-[hover]:text-zinc-800 transition-colors duration-75 ease-out px-1.5 h-7 text-zinc-600 dark:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DocumentArrowUpIcon className="size-3.5 group-data-[hover]:scale-110 transition ease-out" />
            Export
          </Button>
        </div>
      </div>
      <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 rounded-full my-2" />

      <div className="flex items-center gap-1.5 overflow-x-scroll w-full">
        {commands.map((command, index) => (
          <Fragment key={index}>
            <Button
              onClick={command.onClick}
              disabled={!command.onClick}
              aria-label={command.label}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 data-[hover]:border-zinc-300 dark:data-[hover]:border-zinc-700 data-[hover]:text-zinc-800 dark:data-[hover]:text-zinc-200 transition-colors duration-75 ease-out p-1.5 text-zinc-600 dark:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-1.5">{command.icon}</div>
            </Button>
            {command.divideAfter && (
              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 rounded-full" />
            )}
          </Fragment>
        ))}
      </div>

      <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 mb-4" />

      <BubbleMenu
        pluginKey={"textMenu"}
        editor={editor}
        tippyOptions={{ duration: 75 }}
      >
        <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl flex items-center gap-1">
          {commands
            .filter(
              (command) => command.type === "text" || command.type === "style",
            )
            .map((command, index) => (
              <Fragment key={index}>
                <Button
                  disabled={!command.onClick}
                  onClick={command.onClick}
                  aria-label={command.label}
                  className={`rounded-lg border border-zinc-200 dark:border-zinc-800 data-[hover]:border-zinc-300 dark:data-[hover]:border-zinc-700 data-[hover]:text-zinc-800 dark:data-[hover]:text-zinc-200 transition-colors duration-75 ease-out p-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${editor.isActive(command.action) ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-500"}`}
                >
                  {command.icon}
                  <span className="sr-only">{command.label}</span>
                </Button>
                {command.divideAfter &&
                  commands.filter(
                    (command) =>
                      command.type === "text" || command.type === "style",
                  )[
                    commands
                      .filter(
                        (command) =>
                          command.type === "text" || command.type === "style",
                      )
                      .indexOf(command) + 1
                  ] && (
                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 rounded-full" />
                  )}
              </Fragment>
            ))}
        </div>
      </BubbleMenu>
      <FloatingMenu editor={editor} tippyOptions={{ duration: 75 }}>
        <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl flex items-center gap-1">
          {commands
            .filter(
              (command) => command.type === "text" || command.type === "format",
            )
            .map((command, index) => (
              <Fragment key={index}>
                <Button
                  disabled={!command.onClick}
                  onClick={command.onClick}
                  aria-label={command.label}
                  className={`rounded-lg border border-zinc-200 dark:border-zinc-800 data-[hover]:border-zinc-300 dark:data-[hover]:border-zinc-700 data-[hover]:text-zinc-800 dark:data-[hover]:text-zinc-200 transition-colors duration-75 ease-out p-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${editor.isActive(command.action) ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-500"}`}
                >
                  {command.icon}
                  <span className="sr-only">{command.label}</span>
                </Button>
                {command.divideAfter &&
                  commands.filter(
                    (command) =>
                      command.type === "text" || command.type === "format",
                  )[
                    commands
                      .filter(
                        (command) =>
                          command.type === "text" || command.type === "format",
                      )
                      .indexOf(command) + 1
                  ] && (
                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 rounded-full" />
                  )}
              </Fragment>
            ))}
        </div>
      </FloatingMenu>
      <EditorContent editor={editor} />
    </>
  );
}
