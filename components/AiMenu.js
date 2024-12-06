import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GeminiIcon } from "@/utils/icons";
import {
  AcademicCapIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  ChatBubbleLeftEllipsisIcon,
  CursorArrowRaysIcon,
  DocumentTextIcon,
  LanguageIcon,
  NewspaperIcon,
  PaperAirplaneIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/16/solid";
import { marked } from "marked";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

const ai = async (type, options) => {
  if (!window.ai) throw new Error("AI is not available");

  const tools = {
    summarizer: window.ai.summarizer,
    rewriter: window.ai.rewriter,
    writer: window.ai.writer,
    languageDetector: window.ai.languageDetector,
    translator: window.ai.translator,
  };

  const tool = tools[type];
  if (!tool) throw new Error(`${type} is not available`);

  // TODO: remove this `rewriter` and `writer` once chrome re-add the `.capabilities()`
  if (type !== "rewriter" && type !== "writer") {
    const capabilities = await tool.capabilities();
    if (capabilities.available !== "readily") {
      throw new Error(`${type} is not properly enabled`);
    }
  }

  return await tool.create(options);
};

const processAIStream = async (stream, editor) => {
  let generatedText = "";
  for await (const chunk of stream) {
    generatedText = chunk;
    editor.commands.updateAttributes("aiGeneration", { text: chunk });
  }
  return generatedText;
};

const handleAIOperation = async ({
  editor,
  operation,
  aiType,
  context,
  selectedContent,
  format = "markdown",
  additionalOptions = {},
}) => {
  if (!selectedContent) {
    return;
  }
  try {
    const pos = editor.state.selection.from - 1;
    editor.commands.deleteSelection();
    editor.commands.setNode("aiGeneration", { text: "", type: operation });

    const tool = await ai(aiType, {
      sharedContext: context,
      format,
      ...additionalOptions,
    });

    const stream =
      aiType === "summarizer"
        ? await tool.summarizeStreaming(selectedContent)
        : await tool.rewriteStreaming(selectedContent);

    const generatedText = await processAIStream(stream, editor);

    editor.commands.deleteNode("aiGeneration");
    const htmlContent = marked(generatedText);
    editor.chain().focus().insertContentAt(pos, htmlContent).run();
  } catch (error) {
    editor.commands.deleteNode("aiGeneration");
    if (error.message !== `${aiType} is not available`) {
      toast.error(error.message, {
        description: "Make sure to have enabled the necessary AI flags.",
      });
    }
  }
};

export default function AiMenu({ editor }) {
  const [prompt, setPrompt] = useState("");
  const [open, setOpen] = useState(false);

  const getSelectedContent = useCallback(() => {
    return editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
    );
  }, [editor]);

  const generateText = async () => {
    setOpen(false);
    try {
      const selectedContent = getSelectedContent();
      const pos = editor.state.selection.from - 1;
      editor.commands.setNode("aiGeneration", { text: "", type: "generate" });

      if (selectedContent) {
        await handleAIOperation({
          editor,
          operation: "rewrite",
          aiType: "rewriter",
          context: prompt,
          selectedContent,
        });
      } else {
        const writer = await ai("writer", {
          sharedContext:
            "Generate professional, well-structured content in blog or article format",
          format: "markdown",
        });
        const stream = await writer.writeStreaming(prompt);
        const generatedText = await processAIStream(stream, editor);

        editor.commands.deleteNode("aiGeneration");
        const htmlContent = marked(generatedText);
        editor.chain().focus().insertContentAt(pos, htmlContent).run();
      }
      setPrompt("");
    } catch (error) {
      editor.commands.deleteNode("aiGeneration");
      toast.error("Failed to generate text", {
        description: error.message,
      });
    }
  };

  const improveWriting = () =>
    handleAIOperation({
      editor,
      operation: "improve",
      aiType: "rewriter",
      context:
        "Enhance the given text through advanced vocabulary and error correction",
      selectedContent: getSelectedContent(),
    });

  const fixErrorsAndGrammar = () =>
    handleAIOperation({
      editor,
      operation: "fix",
      aiType: "rewriter",
      context: "Fix grammar and spelling errors in the text",
      selectedContent: getSelectedContent(),
    });

  const longerWriting = () =>
    handleAIOperation({
      editor,
      operation: "longer",
      aiType: "rewriter",
      context:
        "Make the given text longer by adding more details and elaboration",
      selectedContent: getSelectedContent(),
      additionalOptions: { length: "longer" },
    });

  const shorterWriting = () =>
    handleAIOperation({
      editor,
      operation: "shorter",
      aiType: "rewriter",
      context: "Make the given text shorter while preserving key information",
      selectedContent: getSelectedContent(),
      additionalOptions: { length: "shorter" },
    });

  const summarizeWriting = () =>
    handleAIOperation({
      editor,
      operation: "summarize",
      aiType: "summarizer",
      context:
        "Create a concise summary of the main points from the given text",
      selectedContent: getSelectedContent(),
    });

  const changeTone = async (tone) => {
    await handleAIOperation({
      editor,
      operation: tone === "more-casual" ? "tone-casual" : "tone-formal",
      aiType: "rewriter",
      context: "Change the tone of the text",
      selectedContent: getSelectedContent(),
      additionalOptions: { tone },
    });
  };

  const translateText = async (target) => {
    try {
      const selectedContent = getSelectedContent();
      const pos = editor.state.selection.from - 1;

      editor.commands.deleteSelection();
      editor.commands.setNode("aiGeneration", { text: "", type: "translate" });

      const detector = await ai("languageDetector");
      const [{ detectedLanguage: from }] =
        await detector.detect(selectedContent);

      const translator = await ai("translator", {
        sourceLanguage: from,
        targetLanguage: target,
      });

      const translatedText = await translator.translate(selectedContent);

      editor.commands.deleteNode("aiGeneration");
      editor.chain().focus().insertContentAt(pos, marked(translatedText)).run();
    } catch (error) {
      editor.chain().focus().undo().run();
      toast.error(error.message, {
        description: "Make sure to have enabled the necessary AI flags.",
      });
    }
  };

  useEffect(() => {
    const keyMap = {
      i: improveWriting,
      s: summarizeWriting,
      l: longerWriting,
      h: shorterWriting,
      g: fixErrorsAndGrammar,
    };

    const handleKeyPress = (e) => {
      if (e.altKey && keyMap[e.key.toLowerCase()]) {
        e.preventDefault();
        keyMap[e.key.toLowerCase()]();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="group outline-none rounded-lg text-xs font-semibold border w-fit flex items-center gap-1.5 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-75 ease-out px-1.5 h-7 text-zinc-600 dark:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed overflow-visible">
        <GeminiIcon className="size-4 shrink-0 group-hover:scale-125 transition-transform ease-out" />
        <span className="font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-75 ease-out shrink-0 whitespace-nowrap select-none">
          Ask AI
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ChatBubbleLeftEllipsisIcon className="size-3.5 text-gemini-blue" />
            Generate Text
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="max-w-96">
            <DropdownMenuLabel>
              <span className="font-bold bg-clip-text text-transparent bg-gemini shrink-0 whitespace-nowrap select-none">
                AI Text Generation
              </span>
            </DropdownMenuLabel>
            <p className="text-sm mb-2 px-1.5">
              Enter a prompt or topic, and the AI will generate relevant text.
              {!editor.state.selection.empty && (
                <span className="font-normal text-sm">
                  {" "}
                  Selected{" "}
                  {
                    getSelectedContent()
                      .split(/\s+/)
                      .filter((word) => word !== "").length
                  }{" "}
                  words as context.
                </span>
              )}
            </p>
            <div className="flex flex-col space-y-2 px-1.5 pt-2">
              <textarea
                autoFocus
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a prompt or topic..."
                className="w-full min-h-[100px] resize-none outline-none bg-transparent text-sm px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800"
              />
              <button
                onClick={generateText}
                className="flex items-center justify-center gap-1.5 px-2 py-1 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-75 ease-out"
              >
                Generate <PaperAirplaneIcon className="size-3.5" />
              </button>
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Text Operations</DropdownMenuLabel>
          <DropdownMenuItem
            disabled={editor.state.selection.empty}
            onSelect={improveWriting}
          >
            <CursorArrowRaysIcon className="size-3.5 text-gemini-blue" />
            Improve writing
            <DropdownMenuShortcut>⌥ I</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={editor.state.selection.empty}
            onSelect={summarizeWriting}
          >
            <DocumentTextIcon className="size-3.5 text-gemini-blue" />
            Summarize
            <DropdownMenuShortcut>⌥ S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={editor.state.selection.empty}
            onSelect={longerWriting}
          >
            <ArrowUpRightIcon className="size-3.5 text-gemini-blue" />
            Make longer
            <DropdownMenuShortcut>⌥ L</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={editor.state.selection.empty}
            onSelect={shorterWriting}
          >
            <ArrowDownRightIcon className="size-3.5 text-gemini-blue" />
            Make shorter
            <DropdownMenuShortcut>⌥ H</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={editor.state.selection.empty}
            onSelect={fixErrorsAndGrammar}
          >
            <WrenchScrewdriverIcon className="size-3.5 text-gemini-blue" />
            Fix errors & grammar
            <DropdownMenuShortcut>⌥ G</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Advanced Options</DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={editor.state.selection.empty}>
              <AdjustmentsHorizontalIcon className="size-3.5 text-gemini-blue" />
              Tone changer
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuLabel>
                <span className="font-bold bg-clip-text text-transparent bg-gemini shrink-0 whitespace-nowrap select-none">
                  Adjust Text Tone
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => changeTone("more-formal")}>
                <AcademicCapIcon className="size-3.5 text-gemini-blue" />
                More Formal
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => changeTone("more-casual")}>
                <NewspaperIcon className="size-3.5 text-gemini-blue" />
                More Casual
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={editor.state.selection.empty}>
              <LanguageIcon className="size-3.5 text-gemini-blue" />
              Translate
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuLabel>
                <span className="font-bold bg-clip-text text-transparent bg-gemini shrink-0 whitespace-nowrap select-none">
                  Target Language
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => translateText("en")}>
                <img
                  src="https://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg"
                  className="h-3.5 w-auto rounded"
                />
                English
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => translateText("es")}>
                <img
                  src="https://purecatamphetamine.github.io/country-flag-icons/3x2/ES.svg"
                  className="h-3.5 w-auto rounded"
                />
                Spanish
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => translateText("fr")}>
                <img
                  src="https://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg"
                  className="h-3.5 w-auto rounded"
                />
                French
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => translateText("ja")}>
                <img
                  src="https://purecatamphetamine.github.io/country-flag-icons/3x2/JP.svg"
                  className="h-3.5 w-auto rounded"
                />
                Japanese
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => translateText("ru")}>
                <img
                  src="https://purecatamphetamine.github.io/country-flag-icons/3x2/RU.svg"
                  className="h-3.5 w-auto rounded"
                />
                Russian
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => translateText("it")}>
                <img
                  src="https://purecatamphetamine.github.io/country-flag-icons/3x2/IT.svg"
                  className="h-3.5 w-auto rounded"
                />
                Italian
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => translateText("pl")}>
                <img
                  src="https://purecatamphetamine.github.io/country-flag-icons/3x2/PL.svg"
                  className="h-3.5 w-auto rounded"
                />
                Polish
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => translateText("hi")}>
                <img
                  src="https://purecatamphetamine.github.io/country-flag-icons/3x2/IN.svg"
                  className="h-3.5 w-auto rounded"
                />
                Hindi
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => translateText("pt")}>
                <img
                  src="https://purecatamphetamine.github.io/country-flag-icons/3x2/PT.svg"
                  className="h-3.5 w-auto rounded"
                />
                Portuguese
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => translateText("ar")}>
                <img
                  src="https://purecatamphetamine.github.io/country-flag-icons/3x2/PS.svg"
                  className="h-3.5 w-auto rounded"
                />
                Arabic
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/help/how-to-enable-ai-feature-flags-in-chrome">
            <GeminiIcon className="size-3.5" />
            <span className="shrink-0 select-none">How to enable AI flags</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
