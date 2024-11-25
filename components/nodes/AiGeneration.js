import { Plugin, PluginKey } from "@tiptap/pm/state";
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { useEffect, useState } from "react";
import { SparklesIcon } from "@heroicons/react/16/solid";

const AiGenerationComponent = ({ node }) => {
  const [generatedText, setGeneratedText] = useState("");
  const streamText = node.attrs.text;

  useEffect(() => {
    if (streamText) {
      setGeneratedText(streamText);
    }
  }, [streamText]);

  return (
    <NodeViewWrapper
      contentEditable={false}
      className="outline outline-1 outline-gemini-blue/25 outline-offset-[8px] rounded-sm"
    >
      <div className="flex items-center gap-1 animate-pulse py-2">
        <SparklesIcon className="size-4 fill-gemini-blue" />
        <span className="text-sm bg-clip-text text-transparent bg-gemini">
          {node.attrs.type === "generate"
            ? "Crafting your content..."
            : node.attrs.type === "improve"
              ? "Enhancing your text..."
              : node.attrs.type === "translate"
                ? "Converting to new language..."
                : node.attrs.type === "summarize"
                  ? "Creating concise version..."
                  : node.attrs.type === "longer"
                    ? "Expanding your text..."
                    : node.attrs.type === "shorter"
                      ? "Condensing your text..."
                      : node.attrs.type === "tone-formal"
                        ? "Making your tone more formal..."
                        : node.attrs.type === "tone-casual"
                          ? "Making your tone more casual..."
                          : node.attrs.type === "fix"
                            ? "Fixing errors and grammar..."
                            : "Processing..."}
        </span>
      </div>
      <p className="my-0 mb-2">{generatedText}</p>
    </NodeViewWrapper>
  );
};

export default Node.create({
  name: "aiGeneration",
  group: "block",
  content: "inline+",
  atom: true,
  selectable: false,
  draggable: false,
  marks: "",

  addAttributes() {
    return {
      text: {
        default: "",
      },
      type: {
        default: "generate",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="ai-generation"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "ai-generation" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AiGenerationComponent);
  },

  // TODO: find a way to not show this node in the history
  // addProseMirrorPlugins() {
  //   return [
  //     new Plugin({
  //       key: new PluginKey("eventHandler"),
  //       filterTransaction: (transaction, state) => {},
  //     }),
  //   ];
  // },
});
