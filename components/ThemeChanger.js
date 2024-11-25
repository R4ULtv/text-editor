"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/16/solid";
import { useTheme } from "next-themes";
import { useEffect, useState, useCallback } from "react";

export default function ThemeChanger() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === "L") {
        toggleTheme();
      }
    },
    [toggleTheme],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!mounted) {
    return;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className="flex justify-center items-center cursor-pointer group duration-150 text-gray-800 dark:text-gray-200 p-2"
    >
      {theme === "light" ? (
        <SunIcon className="size-4 group-hover:scale-110 duration-150" />
      ) : (
        <MoonIcon className="size-4 group-hover:scale-110 duration-150" />
      )}
    </button>
  );
}
