import fs from "fs";

import Editor from "@/components/Editor";

export default function Home() {
  const htmlContent = fs.readFileSync(`./app/blog-example.html`, "utf-8");
  return <Editor html={htmlContent} />;
}
