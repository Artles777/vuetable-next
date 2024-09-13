import { defineConfig } from "vitest/config";
import AutoImport from "unplugin-auto-import/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ["vitest"],
      dts: true
    })
  ]
});