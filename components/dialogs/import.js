"use client";

import { useState, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/components/dialogs/provider";
import { ArrowUpTrayIcon } from "@heroicons/react/16/solid";
import { useDropzone } from "react-dropzone";

export const ImportDialog = memo(({ editor }) => {
  const { isOpenImport, setIsOpenImport } = useDialog();
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "text/html": [".html"],
      "text/markdown": [".md"],
      "application/json": [".json"],
    },
  });

  const handleImport = () => {
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const setContent =
        file.type === "application/json" ? JSON.parse(content) : content;

      editor.commands.setContent(setContent);
    };

    reader.readAsText(file);
    setFile(null);
    setIsOpenImport(false);
  };

  return (
    <Dialog open={isOpenImport} onOpenChange={setIsOpenImport}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <ArrowUpTrayIcon className="size-4" /> Import Document
          </DialogTitle>
          <DialogDescription>
            Import your document to the editor. We support HTML, Markdown and
            JSON formats.
          </DialogDescription>
        </DialogHeader>
        <div className="py-1.5 w-full text-zinc-800 dark:text-zinc-200">
          <div className="space-y-3">
            <div
              {...getRootProps()}
              className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-6 text-center cursor-pointer hover:border-zinc-400 hover:dark:border-zinc-600"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the file here ...</p>
              ) : (
                <div>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Drag & drop a file here, or click to select file.
                  </p>
                  <p className="text-zinc-500 text-sm mt-0.5">
                    Only *.html, *.md, *.json files are allowed.
                  </p>
                </div>
              )}
              {file && (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end">
            <button
              onClick={handleImport}
              className="text-sm font-semibold text-zinc-200 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-200 hover:border-zinc-300 hover:dark:border-zinc-700 px-2 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!file}
            >
              Import
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
