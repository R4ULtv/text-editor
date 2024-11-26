import { InputRule, markInputRule } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Link as TiptapLink } from "@tiptap/extension-link";

const inputRegex =
  /(?:^|\s)\[([^\]]*)?\]\(([A-Za-z0-9:/. ]+)(?:[""](.+)[""])?\)$/;

function linkInputRule(config) {
  const defaultMarkInputRule = markInputRule(config);

  return new InputRule({
    find: config.find,
    handler: (props) => {
      const { tr } = props.state;

      defaultMarkInputRule.handler(props);
      tr.setMeta("preventAutolink", true);
    },
  });
}

const Link = TiptapLink.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      title: {
        default: null,
      },
    };
  },
  addInputRules() {
    return [
      linkInputRule({
        find: inputRegex,
        type: this.type,

        getAttributes(match) {
          return {
            title: match.pop()?.trim(),
            href: match.pop()?.trim(),
          };
        },
      }),
    ];
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("customLinkHandler"),
        props: {
          handleClick: (view, pos, event) => {
            const { schema } = view.state;
            const markType = schema.marks.link;

            const $pos = view.state.doc.resolve(pos);
            const marks = $pos.marks();

            const linkMark = marks.find((mark) => mark.type === markType);

            if (linkMark) {
              const href = linkMark.attrs.href;

              if (event.ctrlKey || event.metaKey) {
                window.open(href, "_blank");
              }

              event.preventDefault();
              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});

export { Link };
