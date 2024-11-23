"use client";

import { useState, useEffect, useCallback } from "react";
import { Howl } from "howler";
import { useAudio } from "@/components/audio/provider";

const creamSwitch = {
  a: [0, 1000],
  b: [2000, 1000],
  c: [4000, 1000],
  d: [6000, 1000],
  e: [8000, 1000],
  f: [20000, 1000],
  g: [22000, 1000],
  enter: [10000, 1000],
  shift: [12000, 1000],
  backspace: [14000, 1000],
  ctrl: [16000, 1000],
  alt: [18000, 1000],
  " ": [24000, 1000],
};

const RANDOM_SOUNDS_LETTER = ["a", "b", "c", "d"];
const RANDOM_SOUNDS_SYMBOLS = ["e", "f", "g"];

const useKeyboardSound = (
  soundUrl = "/sounds/cream.webm",
  debounceTime = 50,
) => {
  const audioProvider = useAudio();
  const [audio, setAudio] = useState(null);
  const [lastKeystrokeTime, setLastKeystrokeTime] = useState(0);

  useEffect(() => {
    const howl = new Howl({
      src: [soundUrl],
      sprite: creamSwitch,
      volume: 0.5,
    });
    setAudio(howl);
    return () => howl.unload();
  }, [soundUrl]);

  useEffect(() => {
    audio?.mute(!audioProvider.audio);
  }, [audio, audioProvider.audio]);

  const playSound = useCallback(
    (key) => {
      const currentTime = Date.now();
      if (!audio || currentTime - lastKeystrokeTime <= debounceTime) return;

      const keyLower = key.toLowerCase();
      let soundToPlay;

      if (/^[a-z0-9]$/.test(keyLower)) {
        soundToPlay =
          RANDOM_SOUNDS_LETTER[
            Math.floor(Math.random() * RANDOM_SOUNDS_LETTER.length)
          ];
      } else if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(keyLower)) {
        soundToPlay =
          RANDOM_SOUNDS_SYMBOLS[
            Math.floor(Math.random() * RANDOM_SOUNDS_SYMBOLS.length)
          ];
      } else {
        soundToPlay = keyLower;
      }

      if (audio._sprite[soundToPlay]) {
        audio.play(soundToPlay);
        setLastKeystrokeTime(currentTime);
      }
    },
    [audio, debounceTime, lastKeystrokeTime],
  );

  return playSound;
};

export default useKeyboardSound;
