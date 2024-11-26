"use client";

import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/16/solid";
import { useAudio } from "@/components/audio/provider";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function AudioButton({ props }) {
  const { audio, toggleAudio } = useAudio();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label="Toggle Audio"
          onClick={() => toggleAudio()}
          className="rounded-lg text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 data-hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors duration-75 ease-out p-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {audio ? (
            <SpeakerWaveIcon className="size-3.5" />
          ) : (
            <SpeakerXMarkIcon className="size-3.5" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>Toggle Audio</TooltipContent>
    </Tooltip>
  );
}
