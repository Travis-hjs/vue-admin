import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx";
import { svgBuilder } from "./src/icons/loader";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx(), svgBuilder("./src/icons/svg/")],
    base: "./",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    // css: {
    //     preprocessorOptions: { 
    //         scss: {
    //             // 全局的scss ，跨域放多个，例如：主题的变量，和一些混合等
    //             additionalData: `@import "./src/style/variables.scss";`,
    //         }
    //     }
    // },
    server: {
        port: 3030,
        /**
         * 这边设置代理域名的时候，`request.ts`里面的`webUrl`请求域名要换成本机地址 => `location.origin`
         * 打包到线上的时候则要把`request.ts`里面的`webUrl`请求域名换成正式环境域名
         * 所以比较繁琐，干脆直接让后台打开跨域好了
         */
        // proxy: "http://10.0.18.207",
        // proxy: {
        //     "/api": {
        //         //要访问的跨域的域名
        //         target: "http://10.0.18.207",
        //         /** 是否启用websockets */
        //         ws: false,
        //         /** 使用的是http协议则设置为false，https协议则设置为true */
        //         secure: false, 
        //         /** 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样客户端端和服务端进行数据的交互就不会有跨域问题 */
        //         changOrigin: true,
        //         /** 对应上面的即可 */
        //         pathRewrite: {
        //             "^/api": "/api"
        //         }
        //     }
        // }
    }
})
