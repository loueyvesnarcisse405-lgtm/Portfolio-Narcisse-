import { defineConfig } from "vite";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = import.meta.dirname;
const partialsDir = resolve(root, "partials");

// Chaque fichier .html à la racine du projet devient une page du build.
const pages = Object.fromEntries(
  readdirSync(root)
    .filter((f) => f.endsWith(".html"))
    .map((f) => [f.replace(/\.html$/, ""), resolve(root, f)])
);

// <!-- @include header.html --> insère le contenu de partials/header.html
function htmlIncludes() {
  const include = (html, depth = 0) =>
    html.replace(/<!--\s*@include\s+([\w.-]+)\s*-->/g, (_, file) => {
      if (depth > 5) throw new Error("Inclusions imbriquées trop profondes");
      return include(readFileSync(resolve(partialsDir, file), "utf8"), depth + 1);
    });

  return {
    name: "html-includes",
    transformIndexHtml: { order: "pre", handler: (html) => include(html) },
    handleHotUpdate({ file, server }) {
      if (file.replace(/\\/g, "/").includes("/partials/")) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [htmlIncludes()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: { input: pages },
  },
  server: { port: 5173 },
});
