"use client";
import { SunIcon, MoonIcon } from "@heroicons/react/16/solid";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeChanger() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
