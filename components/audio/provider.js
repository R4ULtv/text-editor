"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedAudio = localStorage.getItem("audio");
        return savedAudio ? JSON.parse(savedAudio) : true;
      } catch {
        return true;
      }
    }
    return true;
  });

  useEffect(() => {
    try {
      localStorage.setItem("audio", JSON.stringify(audio));
    } catch (error) {
      console.error("Failed to save audio preference:", error);
    }
  }, [audio]);

  const toggleAudio = useCallback(() => {
    setAudio((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleAudio();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleAudio]);

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
