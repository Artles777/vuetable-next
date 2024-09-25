import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { name, PascalCasedName } from "./package.json";
import { isVue2 } from "vue-demi";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "html-transform",
      transformIndexHtml (html: string) {
        return html.replace(/\{\{ NAME \}\}/, name).replace(/\{\{ VUE_VERSION \}\}/g, String(isVue2 ? 2 : 3));
      },
    },
    vue(),
    dts({
      rollupTypes: true
    })
  ],
  optimizeDeps: {
    exclude: ["vue-demi"]
  },
  build: {
    lib: {
      name,
      entry: resolve(__dirname, "src/index.ts")
    },
    copyPublicDir: false,
    sourcemap: true,
    rollupOptions: {
      external: [
        "vue",
        "vue-demi"
      ],
      output: {
        globals: {
          [name]: PascalCasedName
        }
      }
    }
  }
});
