import { defineConfig } from "vite";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

// Chaque fichier .html à la racine de /site devient une page du build.
const root = import.meta.dirname;
const pages = Object.fromEntries(
  readdirSync(root)
    .filter((f) => f.endsWith(".html"))
    .map((f) => [f.replace(/\.html$/, ""), resolve(root, f)])
);

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: { input: pages },
  },
  server: { port: 5173 },
});
