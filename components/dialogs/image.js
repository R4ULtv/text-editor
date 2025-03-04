"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/components/dialogs/provider";
import { PhotoIcon } from "@heroicons/react/16/solid";

export function ImageDialog({ editor }) {
  const { isOpenImage, setIsOpenImage } = useDialog();
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageUrlChange = useCallback((e) => {
    setImageUrl(e.target.value);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const resetState = useCallback(() => {
    setImageUrl("");
    setAltText("");
    setSelectedFile(null);
  }, []);

  const readFileAsDataUrl = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlerInsert = useCallback(
    async (e) => {
      e.preventDefault();
      let img = imageUrl;
      if (selectedFile) {
        img = await readFileAsDataUrl(selectedFile);
      }

      if (!img) return;

      editor.commands.setImage({
        src: img,
        alt: altText,
        width: "100%",
        height: "auto",
      });

      resetState();
      setIsOpenImage(false);
    },
    [imageUrl, altText, selectedFile, editor, setIsOpenImage],
  );

  return (
    <Dialog open={isOpenImage} onOpenChange={setIsOpenImage}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <PhotoIcon className="size-4" /> Insert Image
          </DialogTitle>
          <DialogDescription>
            Add an image into your document by pasting a URL or selecting from
            your computer.
          </DialogDescription>
        </DialogHeader>
        <form className="py-1.5 w-full" onSubmit={(e) => handlerInsert(e)}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="image-url"
              className="text-left text-sm text-zinc-600 dark:text-zinc-400"
            >
              Image URL
            </label>
            <input
              id="image-url"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="https://example.com/image.jpg"
              autoComplete="off"
              className="px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:dark:border-zinc-700 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500"
            />
          </div>
          <div className="mt-3 flex flex-col gap-1.5">
            <label
              htmlFor="file-upload"
              className="text-left text-sm text-zinc-600 dark:text-zinc-400"
            >
              Or select from computer
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:dark:border-zinc-700 rounded-lg outline-none text-zinc-800 dark:text-zinc-200"
            />
          </div>
          <div className="mt-3 flex flex-col gap-1.5">
            <label
              htmlFor="alt-text"
              className="text-left text-sm text-zinc-600 dark:text-zinc-400"
            >
              Alt Text
            </label>
            <input
              id="alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Image description"
              autoComplete="off"
              className="px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:dark:border-zinc-700 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500"
            />
          </div>
          <div className="mt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={!imageUrl && !selectedFile}
              className="text-sm font-semibold text-zinc-200 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-200 hover:border-zinc-300 hover:dark:border-zinc-700 px-2 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Image
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
