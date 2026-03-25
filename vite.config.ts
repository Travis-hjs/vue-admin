import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import tailwindcss from "@tailwindcss/vite";

const [version, __dirname] = [Date.now(), dirname(fileURLToPath(import.meta.url))];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
    {
      buildEnd() {
        const versionFilePath = join(__dirname, "./public/version.json");
        writeFileSync(versionFilePath, JSON.stringify({ version }, null, 2));
      },
      name: "inject-version",
      transformIndexHtml(html) {
        return html.replace(
          /<\/head>/,
          `<script>window._version = ${version};</script></head>`,
        );
      },
    },
  ],
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  server: {
    port: 1088,
    host: "0.0.0.0",
    // proxy: {
    //   "/free": {
    //     target: "https://www.tianqiapi.com",
    //     changeOrigin: true,
    //     rewrite: path => path.replace(/^\//, "")
    //   }
    // }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // plugin-vue:export-helper 默认会被构建成下划线开头的文件，在一些浏览器中会404
          if (id.includes("plugin-vue:export-helper")) {
            return "plugin-vue-export-helper";
          }
          // 处理第三方库
          if (id.includes("node_modules")) {
            if (id.includes("element-plus")) {
              return "ui";
            }
            return "vendor";
          }
        },
        entryFileNames: "js/[name]-[hash].js",
        chunkFileNames: "js/[name]-[hash].js",
        /**
         * 处理资源目录结构
         * @param target 
         */
        assetFileNames(target) {
          const fileName = target.name || target.names[0];
          
          if (fileName?.endsWith(".css")) {
            return "css/[name]-[hash].css";
          }

          const imageTypes = [".png", "jpg", "jpeg", ".webp", ".gif"];

          if (fileName && imageTypes.some(type => fileName.endsWith(type))) {
            return "image/[name]-[hash].[ext]";
          }

          return "assets/[name]-[hash].[ext]";
        }
      }
    }
  },
})
