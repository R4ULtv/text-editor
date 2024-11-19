"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/components/dialogs/provider";
import { GlobeAltIcon } from "@heroicons/react/16/solid";

export function EmbedDialog({ editor }) {
  const { isOpenEmbed, setIsOpenEmbed } = useDialog();
  const [embedUrl, setEmbedUrl] = useState("");
  const [error, setError] = useState("");
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("400px");

  const handleEmbedUrlChange = (e) => {
    setEmbedUrl(e.target.value);
  };

  const handlerInsert = (e) => {
    if (!embedUrl) {
      return;
    }
    editor.commands.setIframe({
      src: embedUrl,
      width: width,
      height: height,
    });
    setEmbedUrl("");
    setWidth("100%");
    setHeight("400px");
    setIsOpenEmbed(false);
  };

  return (
    <Dialog open={isOpenEmbed} onOpenChange={setIsOpenEmbed}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <GlobeAltIcon className="size-4" /> Embed Page
          </DialogTitle>
          <DialogDescription>
            Add an embedded page into your document by pasting a URL.
          </DialogDescription>
        </DialogHeader>
        <div className="py-1.5 w-full">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="embed-url"
              className="text-left text-sm text-zinc-600 dark:text-zinc-400"
            >
              Embed URL
            </label>
            <input
              id="embed-url"
              value={embedUrl}
              onChange={handleEmbedUrlChange}
              placeholder="https://www.example.com/"
              autoComplete="off"
              className="px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:dark:border-zinc-700 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500"
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 flex flex-col gap-1.5">
              <label
                htmlFor="embed-width"
                className="text-left text-sm text-zinc-600 dark:text-zinc-400"
              >
                Width
              </label>
              <input
                id="embed-width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                autoComplete="off"
                className="w-full px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:dark:border-zinc-700 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label
                htmlFor="embed-height"
                className="text-left text-sm text-zinc-600 dark:text-zinc-400"
              >
                Height
              </label>
              <input
                id="embed-height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                autoComplete="off"
                className="w-full px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:dark:border-zinc-700 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <button
              onClick={() => handlerInsert()}
              className="text-sm font-semibold text-zinc-200 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-200 hover:border-zinc-300 hover:dark:border-zinc-700 px-2 py-1.5 rounded-lg"
            >
              Insert Embed
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
