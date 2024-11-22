import { mergeAttributes, Node } from "@tiptap/core";
import { Tweet } from "react-tweet";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";

const TweetComponent = ({ node }) => {
  return (
    <NodeViewWrapper>
      <div className="mx-auto w-fit">
        <Tweet
          id={node.attrs.id}
          components={{
            AvatarImg: (props) => <img {...props} className="my-0" />,
            MediaImg: (props) => (
              <img {...props} fill="true" className="my-0" />
            ),
          }}
        />
      </div>
    </NodeViewWrapper>
  );
};

export const TweetEmbed = Node.create({
  name: "tweetEmbed",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-tweet-id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }
          return {
            "data-tweet-id": attributes.id,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-tweet-embed]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-tweet-embed": "" }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TweetComponent);
  },
});
