import { mergeAttributes, Node } from "@tiptap/core";

export const IFrame = Node.create({
  name: "iframe",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameBorder: {
        default: "0",
      },
      allowFullscreen: {
        default: "true",
      },
      width: {
        default: "100%",
      },
      height: {
        default: "400px",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "iframe-wrapper" },
      ["iframe", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)],
    ];
  },

  addCommands() {
    return {
      setIframe:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

export default IFrame;
