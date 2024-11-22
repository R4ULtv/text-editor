import { Root, Separator, Button } from "@radix-ui/react-toolbar";
import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import AiMenu from "@/components/AiMenu";

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
    <AnimatePresence>
      {!editor.state.selection.empty && isToolbarVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.75, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.75, y: -20 }}
          className="fixed z-50 top-5 inset-x-0 flex items-center justify-center"
        >
          <Root
            className="shadow bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl flex items-center gap-1 w-fit"
            aria-label="Editor Options"
          >
            <AiMenu editor={editor} />
            <Separator className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 rounded-full" />
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
                      <Separator className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 rounded-full" />
                    )}
                </Fragment>
              ))}
          </Root>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToolbarEditor;
