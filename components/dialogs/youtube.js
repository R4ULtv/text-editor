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
import { YoutubeIcon } from "@/utils/icons";

export function YoutubeDialog({ editor }) {
  const { isOpenYoutube, setIsOpenYoutube } = useDialog();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState(false);

  const handleYoutubeUrlChange = (e) => {
    setYoutubeUrl(e.target.value);
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!pattern.test(e.target.value)) {
      setError(true);
    }
  };

  const handlerInsert = (e) => {
    e.preventDefault();
    if (!error && !youtubeUrl) {
      return;
    }
    editor.commands.setYoutubeVideo({
      src: youtubeUrl,
    });
    setYoutubeUrl("");
    setIsOpenYoutube(false);
  };

  return (
    <Dialog open={isOpenYoutube} onOpenChange={setIsOpenYoutube}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <YoutubeIcon className="size-4" />
            Embed YouTube Video
          </DialogTitle>
          <DialogDescription>
            Add an embedded Youtube Video into your document by pasting a
            YouTube URL.
          </DialogDescription>
        </DialogHeader>
        <form className="py-1.5 w-full" onSubmit={(e) => handlerInsert(e)}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="youtube-url"
              className="text-left text-sm text-zinc-600 dark:text-zinc-400"
            >
              YouTube URL
            </label>
            <input
              id="youtube-url"
              value={youtubeUrl}
              onChange={handleYoutubeUrlChange}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              autoComplete="off"
              className="px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:dark:border-zinc-700 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500"
            />
          </div>
          <div className="mt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={!youtubeUrl}
              className="text-sm font-semibold text-zinc-200 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-200 hover:border-zinc-300 hover:dark:border-zinc-700 px-2 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Youtube
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
