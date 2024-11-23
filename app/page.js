import fs from "fs";

import Editor from "@/components/Editor";
import { DialogProvider } from "@/components/dialogs/provider";
import { AudioProvider } from "@/components/audio/provider";

export default function Home() {
  const htmlContent = fs.readFileSync(`./app/blog-example.html`, "utf-8");
  return (
    <AudioProvider>
      <DialogProvider>
        <Editor html={htmlContent} />
      </DialogProvider>
    </AudioProvider>
  );
}
