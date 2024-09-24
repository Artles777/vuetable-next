import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { name, PascalCasedName } from "./package.json";
import { version } from "vue";
import type { SemVer } from "semver";
import { parse } from "semver";
import dts from "vite-plugin-dts";
import { resolve } from "path";

const { major, minor } = parse(version) as SemVer;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "html-transform",
      transformIndexHtml (html: string) {
        return html.replace(/\{\{ NAME \}\}/, name).replace(/\{\{ VUE_VERSION \}\}/g, String(major === 3 ? major : `${major}.${minor}`));
      },
    },
    vue(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true
    }),
    AutoImport({
      viteOptimizeDeps: true
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
      external: ["vue-demi", "vue"],
      output: {
        globals: {
          [name]: PascalCasedName,
          "vue-demi": "VueDemi",
          vue: "Vue"
        }
      }
    }
  }
});
