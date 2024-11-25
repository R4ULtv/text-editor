"use client";

import { useState } from "react";

export const AvailableAiCheck = () => {
  const [availableAi, setAvailableAi] = useState(null);

  const checkAiAvailability = async () => {
    try {
      if (window?.ai) {
        const languageModel = await window.ai.languageModel.capabilities();
        setAvailableAi(languageModel.available);
        if (languageModel.available === "no") {
          await window.ai.languageModel.create();
        }
      } else {
        setAvailableAi("no");
      }
    } catch (error) {
      setAvailableAi("no");
    }
  };
  return (
    <button
      disabled={availableAi === "readily"}
      onClick={checkAiAvailability}
      className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700"
    >
      {availableAi === null
        ? "Check if AI is installed"
        : availableAi === "no"
          ? "AI is not installed"
          : availableAi === "afterDownload"
            ? "Still installing"
            : "AI is ready to use"}
    </button>
  );
};
