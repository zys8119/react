import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Unocss from "unocss/vite";
import Vue from "@vitejs/plugin-vue";
export default defineConfig({
  plugins: [
    Vue(),
    Unocss(),
    AutoImport({
      imports: ["vue", "@vueuse/core"],
      // include: [/\.tsx?$/],
      dts: true,
      resolvers: [
        (name) => {
          switch (name) {
            case "React":
              return {
                name: "*",
                from: "react",
                as: name,
              };
            default:
              break;
          }
        },
      ],
    }),
    {
      name: "tab-test",
      enforce: "post",
      transform(code, id, options) {
        if (/node_modules.*\.js/.test(id)) {
          return `${code}\n;console.log("tab-test");`;
        }
        return code;
      },
    },
  ],
  build: {
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ["opencv.js"],
  },
});
