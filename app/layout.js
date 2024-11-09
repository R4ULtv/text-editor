import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";

import "./globals.css";
import ThemeChanger from "@/components/ThemeChanger";
import { GithubIcon } from "@/utils/icons";

export const metadata = {
  title: "Text Editor | by Raul Carini",
  description:
    "Create blog posts or articles with ease in a simple text editor and export to markdown, HTML, or doc formats",
  openGraph: {
    title: "Text Editor | by Raul Carini",
    description:
      "Create blog posts or articles with ease in a simple text editor and export to markdown, HTML, or doc formats",
    images: [
      {
        url: "/og-image.png",
        width: 843,
        height: 441,
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="antialiased scroll-smooth"
      suppressHydrationWarning
    >
      <body
        className={
          GeistSans.className +
          " bg-zinc-100 dark:bg-zinc-900 selection:bg-zinc-400/25 dark:selection:bg-zinc-600/25 relative"
        }
      >
        <ThemeProvider attribute="class" enableSystem={false}>
          <main className="max-w-3xl py-10 sm:py-16 px-4 sm:px-6 mx-auto min-h-svh">
            <header className="mb-10 sm:mb-16 flex items-start justify-between">
              <div className="flex flex-col items-start">
                <Link
                  href={"/"}
                  className="text-base inline-block font-medium no-underline text-zinc-800 dark:text-zinc-200"
                >
                  Text Editor
                </Link>
                <span className="text-base font-medium leading-none text-zinc-600 dark:text-zinc-400">
                  Create blogging content with ease ✨
                </span>
              </div>
              <ThemeChanger />
            </header>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
