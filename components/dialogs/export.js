"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/components/dialogs/provider";
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import html2md from "html-to-md";

const EXPORT_FORMATS = {
  html: {
    extension: ".html",
    process: (html) => html,
    type: "text/plain",
  },
  md: {
    extension: ".md",
    process: (html, title, description) => {
      const md = html2md(html);
      if (title || description) {
        const metadata = `---\n${title ? `title: "${title}"\n` : ""}${description ? `description: "${description}"\n` : ""}---\n\n`;
        return metadata + md;
      }
      return html2md(html);
    },
    type: "text/plain",
  },
  json: {
    extension: ".json",
    process: (json) => {
      return JSON.stringify(json, null, 2);
    },
    type: "application/json",
  },
};

export function ExportDialog({ editor }) {
  const { isOpenExport, setIsOpenExport } = useDialog();
  const [format, setFormat] = useState("html");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filename, setFilename] = useState(
    new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-"),
  );

  useEffect(() => {
    if (isOpenExport) {
      setFilename(new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-"));
    }
  }, [isOpenExport]);

  const handleDownload = useCallback(async () => {
    if (!filename) return;

    const name = filename + EXPORT_FORMATS[format].extension;

    const content = await EXPORT_FORMATS[format].process(
      format === "json" ? editor.getJSON() : editor.getHTML(),
      title,
      description,
    );
    const blob =
      format === "docx"
        ? content
        : new Blob([content], { type: EXPORT_FORMATS[format].type });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();

    window.URL.revokeObjectURL(url);
    setIsOpenExport(false);
  }, [editor, format, setIsOpenExport, filename]);

  return (
    <Dialog open={isOpenExport} onOpenChange={setIsOpenExport}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <ArrowDownTrayIcon className="size-4" /> Export Document
          </DialogTitle>
          <DialogDescription>
            Choose the export format for your document and download it.
          </DialogDescription>
        </DialogHeader>
        <div className="py-1.5 w-full text-zinc-800 dark:text-zinc-200">
          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="title"
                className="text-left text-sm text-zinc-600 dark:text-zinc-400"
              >
                Title
              </label>
              <div className="relative">
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoComplete="false"
                  placeholder="My Awesome Document"
                  className="pl-3 pr-8 py-1.5 w-full bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:dark:border-zinc-700 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500"
                />
                {title && (
                  <button
                    onClick={() => setTitle("")}
                    className="absolute top-3 right-3"
                  >
                    <XMarkIcon className="size-3.5 fill-zinc-500" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="description"
                className="text-left text-sm text-zinc-600 dark:text-zinc-400"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="false"
                placeholder="A comprehensive guide exploring the key concepts and strategies for effective document organization and management."
                className="px-3 py-1.5 max-h-96 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:dark:border-zinc-700 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3 w-full">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="filename"
                  className="text-left text-sm text-zinc-600 dark:text-zinc-400"
                >
                  File Name (*)
                </label>

                <div className="relative">
                  <input
                    id="filename"
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    autoComplete="false"
                    placeholder="Enter file name"
                    required
                    className="px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:dark:border-zinc-700 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500"
                  />
                  {filename && (
                    <button
                      onClick={() => setFilename("")}
                      className="absolute top-3 right-3"
                    >
                      <XMarkIcon className="size-3.5 fill-zinc-500" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="file-format"
                  className="text-left text-sm text-zinc-600 dark:text-zinc-400"
                >
                  File Format (*)
                </label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger id="file-format">
                    <DocumentTextIcon className="size-4" />
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="md">Markdown</SelectItem>
                      <SelectItem disabled value="docx">
                        DOCX
                      </SelectItem>
                      <SelectItem disabled value="odt">
                        ODT
                      </SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end">
            <button
              onClick={handleDownload}
              disabled={!filename}
              className="text-sm font-semibold text-zinc-200 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-200 hover:border-zinc-300 hover:dark:border-zinc-700 px-2 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
