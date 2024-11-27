"use client";

import { useState } from "react";
import { GeminiIcon } from "@/utils/icons";

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
      className="group outline-none rounded-lg text-xs font-semibold border w-fit flex items-center gap-1.5 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-75 ease-out px-1.5 h-7 text-zinc-600 dark:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed overflow-visible"
    >
      <GeminiIcon className="size-4 shrink-0 group-hover:scale-125 transition-transform ease-out" />
      <span className="font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-75 ease-out shrink-0 whitespace-nowrap select-none">
        {availableAi === null
          ? "Ask AI"
          : availableAi === "no"
          ? "AI is not installed"
          : availableAi === "afterDownload"
          ? "Still installing"
          : "AI is ready to use"}
      </span>
    </button>
  );
};
