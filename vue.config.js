const path = require("path");
　　
const resolve = dir => path.join(__dirname, dir);

/**
 * 项目webpack配置
 * @learn https://cli.vuejs.org/zh/config/#vue-config-js 
 */
module.exports = {
    /** 打包构建后的资源路径 */
    publicPath: "./",

    /**
     * @learn https://blog.csdn.net/Liu_yunzhao/article/details/90520028
     * @learn https://blog.csdn.net/qq_38910842/article/details/102972197
     */
    devServer: {
        port: 2048,
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
    },

    chainWebpack(config) {
        // set svg-sprite-loader
        config.module
            .rule("svg")
            .exclude.add(resolve("src/icons"))
            .end()
        config.module
            .rule("icons")
            .test(/\.svg$/)
            .include.add(resolve("src/icons"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]"
            })
            .end()
    },

    /** 剔除.map文件构建 */
    productionSourceMap: false
}