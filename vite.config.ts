import { defineConfig } from "vite";

// Library build: one ESM file per entry point, no dependencies.
export default defineConfig({
  build: {
    lib: { entry: { server: "src/server.ts", live: "src/live.ts" }, formats: ["es"] },
    sourcemap: true,
    target: "es2022",
  },
});
