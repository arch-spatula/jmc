/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "../cmd/wiki",
    emptyOutDir: true,
    lib: {
      entry: "src/main.ts",
      formats: ["iife"],
      fileName: () => "main.js",
      name: "JMC",
      cssFileName: "style",
    },
    rollupOptions: {
      output: { assetFileNames: "[name].[ext]" },
    },
  },
  test: {
    environment: "jsdom",
  },
});
