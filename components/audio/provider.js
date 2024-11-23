"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(() => {
    if (typeof window !== "undefined") {
      const savedAudio = localStorage.getItem("audio");
      return savedAudio ? JSON.parse(savedAudio) : true;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem("audio", JSON.stringify(audio));
  }, [audio]);

  const toggleAudio = () => {
    setAudio((prev) => !prev);
  };

  const value = {
    audio,
    toggleAudio,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within a AudioProvider");
  }
  return context;
}
