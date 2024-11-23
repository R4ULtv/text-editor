import { Fragment, useEffect, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { Root, Separator, Button } from "@radix-ui/react-toolbar";

import AiMenu from "@/components/AiMenu";
import { cn } from "@/utils/cn";

const ToolbarEditor = ({ editor, commands }) => {
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  useEffect(() => {
    const targetDiv = document.getElementById("editor");
    if (!targetDiv) return;

    const handleScroll = () => {
      const rect = targetDiv.getBoundingClientRect();
      setIsToolbarVisible(window.scrollY > rect.bottom);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Dialog.Root
      open={isToolbarVisible && !editor.state.selection.empty}
      onOpenChange={setIsToolbarVisible}
    >
      <Dialog.Portal>
        <div
          data-state={isToolbarVisible ? "open" : "closed"}
          className={cn(
            "fixed z-50 top-5 inset-x-0 flex items-center justify-center",
            "ease-out-bounce data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-75 data-[state=open]:zoom-in-75",
          )}
        >
          <Root
            aria-label="Editor Options"
            className="shadow bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl flex items-center gap-1 w-fit overflow-x-auto no-scrollbar"
          >
            <AiMenu editor={editor} />
            <Separator className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 rounded-full shrink-0" />
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
                    className={`rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 outline-none focus:border-zinc-300 dark:focus:border-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors duration-75 ease-out p-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                      editor.isActive(command.action)
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-600 dark:text-zinc-400"
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
                      <Separator className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 rounded-full shrink-0" />
                    )}
                </Fragment>
              ))}
          </Root>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ToolbarEditor;
