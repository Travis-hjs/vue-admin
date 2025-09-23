import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import tailwindcss from "@tailwindcss/vite";

const version = Date.now();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
    {
      buildEnd() {
        const versionFilePath = path.join(__dirname, "./public/version.json");
        fs.writeFileSync(versionFilePath, JSON.stringify({ version }, null, 2));
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
      "@": path.resolve(__dirname, "src")
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
        manualChunks: {
          // "package-name": ["file-name"],
          "element-plus": ["element-plus"],
        },
        // manualChunks(id) {
        //   if (id.includes("node_modules")) {
        //     return "vendor";
        //   }
        // },
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
