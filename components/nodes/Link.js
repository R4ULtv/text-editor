import { InputRule, markInputRule } from "@tiptap/core";
import { Link as TiptapLink } from "@tiptap/extension-link";

const inputRegex =
  /(?:^|\s)\[([^\]]*)?\]\(([A-Za-z0-9:/. ]+)(?:["“](.+)["”])?\)$/;

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
});

export { Link };
