"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/components/dialogs/provider";
import { AtSymbolIcon } from "@heroicons/react/16/solid";
import { TwitterIcon } from "@/utils/icons";

export function MentionDialog({ editor }) {
  const { isOpenMention, setIsOpenMention } = useDialog();
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);

  const handlerInsert = (e) => {
    if (!username) {
      return;
    }
    editor.commands.insertContent({
      type: "twitterBadge",
      attrs: { username: username.replace(/^@/, "") },
    });
    setUsername("");
    setIsOpenMention(false);
  };

  return (
    <Dialog open={isOpenMention} onOpenChange={setIsOpenMention}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <AtSymbolIcon className="size-4" />
            Twitter User Mention
          </DialogTitle>
          <DialogDescription>
            Enter a Twitter username to mention them in your document.
          </DialogDescription>
        </DialogHeader>
        <div className="py-1.5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-left text-sm text-zinc-600 dark:text-zinc-400"
            >
              Twitter Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@lil_poop__"
              className="px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:dark:border-zinc-700 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500"
            />
          </div>
          <div className="mt-4 flex items-center justify-end">
            <button
              onClick={() => handlerInsert()}
              className="text-sm font-semibold text-zinc-200 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-200 hover:border-zinc-300 hover:dark:border-zinc-700 px-2 py-1.5 rounded-lg"
            >
              Insert Mention
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TweetDialog({ editor }) {
  const { isOpenTweet, setIsOpenTweet } = useDialog();
  const [tweet, setTweet] = useState("");
  const [error, setError] = useState(false);

  const handlerInsert = (e) => {
    if (!tweet) {
      return;
    }

    let id = tweet;
    if (tweet.includes("status/")) {
      id = tweet.split("status/")[1].split("?")[0];
    }

    editor.commands.insertContent({
      type: "tweetEmbed",
      attrs: { id: id },
    });
    setTweet("");
    setIsOpenTweet(false);
  };

  return (
    <Dialog open={isOpenTweet} onOpenChange={setIsOpenTweet}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <TwitterIcon className="size-4" />
            Tweet Embed
          </DialogTitle>
          <DialogDescription>
            Enter a Tweet id or link to inset in the document.
          </DialogDescription>
        </DialogHeader>
        <div className="py-1.5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="tweet"
              className="text-left text-sm text-zinc-600 dark:text-zinc-400"
            >
              Tweet ID or Tweet Link
            </label>
            <input
              id="tweet"
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
              placeholder="1858596645744603482"
              autoComplete="off"
              className="px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 hover:dark:border-zinc-700 rounded-lg outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500"
            />
          </div>
          <div className="mt-4 flex items-center justify-end">
            <button
              onClick={() => handlerInsert()}
              className="text-sm font-semibold text-zinc-200 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-200 hover:border-zinc-300 hover:dark:border-zinc-700 px-2 py-1.5 rounded-lg"
            >
              Insert Tweet
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
