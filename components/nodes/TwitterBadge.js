import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { useEffect, useState } from "react";

const TwitterBadgeComponent = ({ node }) => {
  const [userData, setUserData] = useState(null);
  const username = node.attrs.username;

  useEffect(() => {
    setUserData({
      username: username,
      profileImage: `https://unavatar.io/twitter/${username}`,
    });
  }, [username]);

  if (!userData) return null;

  const handleClick = (e) => {
    if (!e.ctrlKey) {
      e.preventDefault();
    }
  };

  return (
    <NodeViewWrapper as="span">
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex not-prose items-center rounded border border-zinc-200 bg-zinc-50 p-1 text-sm leading-4 text-zinc-700 no-underline dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        href={`https://x.com/${userData.username}`}
        onClick={handleClick}
      >
        <img
          alt={`profile image ${userData.username}`}
          width={14}
          height={14}
          className="mr-1 rounded-full"
          src={userData.profileImage}
        />
        <span>{userData.username}</span>
      </a>
    </NodeViewWrapper>
  );
};

export default Node.create({
  name: "twitterBadge",
  group: "inline",
  inline: true,
  selectable: false,
  atom: true,

  addAttributes() {
    return {
      username: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="twitter-badge"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { "data-type": "twitter-badge" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TwitterBadgeComponent);
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /(@\w+)[\s\n]/,
        type: this.type,
        getAttributes: (match) => {
          return { username: match[1].slice(1) };
        },
      }),
    ];
  },

  addPasteRules() {
    return [
      {
        find: /@([\w_]+)/g,
        handler: ({ state, range, match }) => {
          const username = match[1];
          const { tr } = state;
          tr.replaceRangeWith(
            range.from,
            range.to,
            this.type.create({ username }),
          );
          return true;
        },
      },
    ];
  },
});
