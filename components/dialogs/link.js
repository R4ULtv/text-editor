"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/components/dialogs/provider";
import { LinkIcon } from "@heroicons/react/16/solid";

export function LinkDialog({ editor }) {
  const { isOpenLink, setIsOpenLink } = useDialog();
  const [link, setLink] = useState("");
  const [linkText, setLinkText] = useState("");

  const handlerInsert = (e) => {
    e.preventDefault();
    if (!link) {
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: link })
      .command(({ tr }) => {
        tr.insertText(linkText);
        return true;
      })
      .run();
    setLink("");
    setLinkText("");
    setIsOpenLink(false);
  };

  useEffect(() => {
    if (isOpenLink) {
      const { from, to } = editor?.state.selection;
      const text = editor?.state.doc.textBetween(from, to, "");
      const mark = editor?.state.selection.$from
        .marks()
        .find((mark) => mark.type.name === "link");
      if (mark) {
        setLink(mark.attrs.href);
        setLinkText(text);
      } else {
        setLink("");
        setLinkText(text);
      }
    }
  }, [editor, isOpenLink]);

  return (
    <Dialog open={isOpenLink} onOpenChange={setIsOpenLink}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <LinkIcon className="size-4" /> Insert Link
          </DialogTitle>
          <DialogDescription>
            Insert a link to another page of your choosing. You can include
            links to internal or external resources.
          </DialogDescription>
        </DialogHeader>
        <form className="py-1.5 w-full" onSubmit={(e) => handlerInsert(e)}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="link"
              className="text-left text-sm text-zinc-600 dark:text-zinc-400"
            >
              Website URL or Page Link
            </label>
            <input
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://www.example.com/"
              autoComplete="off"
              className="px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:dark:border-zinc-700 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500"
            />
            <label
              htmlFor="linkText"
              className="text-left text-sm text-zinc-600 dark:text-zinc-400 mt-3"
            >
              Link Text
            </label>
            <input
              id="linkText"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link display text"
              autoComplete="off"
              className="px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:dark:border-zinc-700 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500"
            />
          </div>
          <div className="mt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={!link}
              className="text-sm font-semibold text-zinc-200 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-200 hover:border-zinc-300 hover:dark:border-zinc-700 px-2 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Link
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
