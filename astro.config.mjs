import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  base: "./",
  build: { format: "file" },
  vite: {
    build: { assetsInlineLimit: 100_000 },
  },
});
