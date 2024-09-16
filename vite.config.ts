import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { name, PascalCasedName } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), AutoImport({
    viteOptimizeDeps: true
  })],
  optimizeDeps: {
    exclude: ["vue-demi"]
  },
  build: {
    lib: {
      name,
      entry: "src/index.ts"
    },
    sourcemap: true,
    rollupOptions: {
      external: ["vue-demi"],
      output: {
        globals: {
          [name]: PascalCasedName,
        },
      }
    }
  }
});
