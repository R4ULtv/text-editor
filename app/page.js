import Editor from "@/components/Editor";
import { DialogProvider } from "@/components/dialogs/provider";
import { AudioProvider } from "@/components/audio/provider";

import { json } from "@/app/blog-starter";
import { ShortcutsDialog } from "@/components/dialogs/shortcuts";

export default function Home() {
  return (
    <AudioProvider>
      <DialogProvider>
        <Editor content={json} />
        <ShortcutsDialog />
      </DialogProvider>
    </AudioProvider>
  );
}
