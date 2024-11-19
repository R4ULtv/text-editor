"use client";
import { createContext, useContext, useState } from "react";

const DialogContext = createContext();

export function DialogProvider({ children }) {
  const [isOpenYoutube, setIsOpenYoutube] = useState(false);
  const [isOpenEmbed, setIsOpenEmbed] = useState(false);
  const [isOpenMention, setIsOpenMention] = useState(false);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [isOpenLink, setIsOpenLink] = useState(false);
  const [isOpenTweet, setIsOpenTweet] = useState(false);

  const value = {
    isOpenYoutube,
    setIsOpenYoutube,
    isOpenEmbed,
    setIsOpenEmbed,
    isOpenMention,
    setIsOpenMention,
    isOpenImage,
    setIsOpenImage,
    isOpenLink,
    setIsOpenLink,
    isOpenTweet,
    setIsOpenTweet,
  };

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
