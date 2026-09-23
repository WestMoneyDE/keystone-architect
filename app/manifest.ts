import type { MetadataRoute } from "next";

// Next.js's idiomatic manifest convention (App Router, Next 13.3+) — served
// automatically at /manifest.webmanifest. Colors match the light-default
// design tokens in app/globals.css (--background: #f7f7f8, --accent:
// #4f46e5). Icons are simple generated placeholders at public/icons/
// (see scope note in public/sw.js for what this PWA v1 actually covers).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Keystone — Enterprise Architecture Knowledge Platform",
    short_name: "Keystone",
    description:
      "Self-hosted, LLM-augmented Enterprise Architecture knowledge base, reader and certification platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f7f8",
    theme_color: "#4f46e5",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
