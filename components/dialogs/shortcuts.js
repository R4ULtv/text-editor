"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KeyboardIcon } from "@/utils/icons";

const shortcuts = {
  ai: [
    { name: "Improve Writing", key: "⌥ + I" },
    { name: "Summarize Writing", key: "⌥ + S" },
    { name: "Make Longer", key: "⌥ + L" },
    { name: "Make Shorter", key: "⌥ + H" },
    { name: "Fix Errors and Grammar", key: "⌥ + G" },
  ],
  textEditing: [
    { name: "Bold", key: "⌘ B" },
    { name: "Italic", key: "⌘ I" },
    { name: "Underline", key: "⌘ U" },
    { name: "Heading 1", key: "⌘ ⌥ 1" },
    { name: "Heading 2", key: "⌘ ⌥ 2" },
    { name: "Heading 3", key: "⌘ ⌥ 3" },
  ],
  listAndFormat: [
    { name: "Bullet List", key: "⌘ ⇧ 8" },
    { name: "Ordered List", key: "⌘ ⇧ 7" },
    { name: "Block Quote", key: "⌘ ⇧ B" },
  ],
  codeAndBlocks: [
    { name: "Code", key: "⌘ E" },
    { name: "Code Block", key: "⌘ ⌥ C" },
  ],
  editing: [
    { name: "Copy", key: "⌘ C" },
    { name: "Cut", key: "⌘ X" },
    { name: "Paste", key: "⌘ V" },
    { name: "Paste without formatting", key: "⌘ ⇧ V" },
    { name: "Undo", key: "⌘ Z" },
    { name: "Redo", key: "⌘ ⇧ Z" },
  ],
  more: [
    { name: "Mute Audio", key: "⌘ M" },
    { name: "Change Theme", key: "⌘ ⇧ L" },
  ],
};

const ShortcutSection = ({ title, items }) => (
  <div className="w-full">
    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
      {title}
    </span>
    <div className="mt-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="group flex items-center justify-between gap-3 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 py-1 px-2 rounded-md select-none"
        >
          <span className="text-zinc-700 dark:text-zinc-300">{item.name}</span>
          <kbd className="text-xs font-mono text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded shrink-0">
            {item.key}
          </kbd>
        </div>
      ))}
    </div>
  </div>
);

export function ShortcutsDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "/") {
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const dialogContent = useMemo(
    () => (
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <KeyboardIcon className="size-4" /> Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            A list of keyboard shortcuts to help you navigate and use our
            website more efficiently.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-1.5 py-1.5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <ShortcutSection
              title="Text Editing"
              items={shortcuts.textEditing}
            />
            <ShortcutSection title="Editing" items={shortcuts.editing} />
            <ShortcutSection title="Ask AI" items={shortcuts.ai} />
          </div>
          <div className="flex items-start justify-between gap-3">
            <ShortcutSection
              title="List and Format"
              items={shortcuts.listAndFormat}
            />
            <ShortcutSection
              title="Code and Blocks"
              items={shortcuts.codeAndBlocks}
            />
            <ShortcutSection title="More Commands" items={shortcuts.more} />
          </div>
        </div>
      </DialogContent>
    ),
    [],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {dialogContent}
    </Dialog>
  );
}
