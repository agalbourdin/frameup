import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.SITE_URL,
  output: "static",
  base: "./",
  build: { format: "file" },
  vite: {
    build: { assetsInlineLimit: 100_000 },
  },
});
