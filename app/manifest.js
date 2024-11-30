export default function manifest() {
  return {
    name: "Texta - Editor",
    short_name: "Texta",
    description: "Create blogging content with ease ✨",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f4f5",
    theme_color: "#18181b",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
