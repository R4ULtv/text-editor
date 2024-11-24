"use client";

export const CodeCopy = ({ text }) => {
  const handleCodeClick = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <code
      onClick={() => handleCodeClick(text)}
      className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700"
    >
      {text}
    </code>
  );
};
