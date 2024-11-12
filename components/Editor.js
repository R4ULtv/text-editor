"use client";

import { Fragment, useState } from "react";
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
import Youtube from "@tiptap/extension-youtube";

import IFrame from "@/components/nodes/iFrame";
import TwitterBadge from "@/components/nodes/TwitterBadge";

import {
  Button,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Input,
} from "@headlessui/react";
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
  LinkIcon,
  ListBulletIcon,
  MinusIcon,
  NumberedListIcon,
  PhotoIcon,
  UnderlineIcon,
} from "@heroicons/react/16/solid";
import { TwitterIcon, YoutubeIcon } from "@/utils/icons";

export default function Editor({ html }) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [dialogType, setDialogType] = useState("youtube");
  const [username, setUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setUrl(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addContent = () => {
    if (url) {
      if (dialogType === "youtube") {
        editor.commands.setYoutubeVideo({
          src: url,
        });
      } else if (dialogType === "embed") {
        editor
          .chain()
          .focus()
          .setIframe({
            src: url,
          })
          .run();
      } else if (dialogType === "image") {
        editor.chain().focus().setImage({ src: url }).run();
      }
      setUrl("");
      setSelectedFile(null);
      setIsOpen(false);
    } else if (dialogType === "twitterMention" && username) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "twitterBadge",
          attrs: { username },
        })
        .run();
      setUsername("");
      setIsOpen(false);
    }
  };

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
      label: "Image",
      action: "image",
      type: "utils",
      icon: <PhotoIcon className="size-3.5" />,
      onClick: () => {
        setDialogType("image");
        setIsOpen(true);
      },
    },
    {
      label: "Youtube",
      action: "youtube",
      type: "utils",
      icon: <YoutubeIcon className="size-3.5" />,
      onClick: () => {
        setDialogType("youtube");
        setIsOpen(true);
      },
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
      onClick: () => {
        setDialogType("twitterMention");
        setIsOpen(true);
      },
    },
    {
      label: "Embed",
      action: "embed",
      type: "utils",
      icon: <GlobeAltIcon className="size-3.5" />,
      onClick: () => {
        setDialogType("embed");
        setIsOpen(true);
      },
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

      <div className="flex items-center gap-1.5 overflow-x-auto w-full">
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
        <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl flex items-center gap-1 w-fit">
          {commands
            .filter(
              (command) =>
                command.type === "text" ||
                command.type === "style" ||
                command.type === "blocks",
            )
            .map((command, index) => (
              <Fragment key={index}>
                <Button
                  disabled={!command.onClick}
                  onClick={command.onClick}
                  aria-label={command.label}
                  className={`rounded-lg border border-zinc-200 dark:border-zinc-800 data-[hover]:border-zinc-300 dark:data-[hover]:border-zinc-700 data-[hover]:text-zinc-800 dark:data-[hover]:text-zinc-200 transition-colors duration-75 ease-out p-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                    editor.isActive(command.action)
                      ? "text-zinc-800 dark:text-zinc-200"
                      : "text-zinc-500"
                  }`}
                >
                  {command.icon}
                  <span className="sr-only">{command.label}</span>
                </Button>
                {command.divideAfter &&
                  commands.filter(
                    (command) =>
                      command.type === "text" ||
                      command.type === "style" ||
                      command.type === "blocks",
                  )[
                    commands
                      .filter(
                        (command) =>
                          command.type === "text" ||
                          command.type === "style" ||
                          command.type === "blocks",
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
                  className={`rounded-lg border border-zinc-200 dark:border-zinc-800 data-[hover]:border-zinc-300 dark:data-[hover]:border-zinc-700 data-[hover]:text-zinc-800 dark:data-[hover]:text-zinc-200 transition-colors duration-75 ease-out p-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                    editor.isActive(command.action)
                      ? "text-zinc-800 dark:text-zinc-200"
                      : "text-zinc-500"
                  }`}
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

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg w-full space-y-3 bg-zinc-900 rounded-xl p-6">
            <DialogTitle className="font-bold text-zinc-800 dark:text-zinc-200">
              {dialogType === "youtube"
                ? "Add Youtube Video"
                : dialogType === "twitterMention"
                  ? "Add Twitter User"
                  : dialogType === "image"
                    ? "Add Image"
                    : "Add Embedded Page"}
            </DialogTitle>
            <Description className="text-sm text-zinc-600 dark:text-zinc-400">
              {dialogType === "youtube"
                ? "Add an embedded Youtube Video into your document by pasting a YouTube URL."
                : dialogType === "twitterMention"
                  ? "Enter a Twitter username to mention them in your document."
                  : dialogType === "image"
                    ? "Upload an image or paste an image URL."
                    : "Add an embedded page into your document by pasting a URL."}
            </Description>
            {dialogType === "image" && (
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full rounded-lg text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-500 border border-zinc-200 dark:border-zinc-800 text-sm outline-none px-2 py-1.5"
                />
                <div className="text-center text-sm text-zinc-500">or</div>
              </div>
            )}
            <Input
              value={dialogType === "twitterMention" ? username : url}
              onChange={(e) =>
                dialogType === "twitterMention"
                  ? setUsername(e.target.value)
                  : setUrl(e.target.value)
              }
              placeholder={
                dialogType === "youtube"
                  ? "https://youtube.com/watch"
                  : dialogType === "twitterMention"
                    ? "username"
                    : dialogType === "image"
                      ? "https://example.com/image.jpg"
                      : "https://example.com"
              }
              className="w-full rounded-lg text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-500 border border-zinc-200 dark:border-zinc-800 text-sm outline-none px-2 py-1.5"
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Cancel
              </Button>
              <Button
                onClick={addContent}
                className="rounded-lg px-3 py-1.5 text-sm font-medium bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
              >
                Add{" "}
                {dialogType === "youtube"
                  ? "Video"
                  : dialogType === "twitterMention"
                    ? "User"
                    : dialogType === "image"
                      ? "Image"
                      : "Page"}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
