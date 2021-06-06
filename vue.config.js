const path = require("path");
/** 时间戳 */
const timestamp = Date.now();
/** 文件后缀，处理版本更新浏览器缓存问题 */
const fileSuffix = process.env.NODE_ENV === "production" ? `?time=${timestamp}` : "";

const resolve = dir => path.join(__dirname, dir);

/**
 * 项目webpack配置
 * @learn https://cli.vuejs.org/zh/config/#vue-config-js 
 */
module.exports = {

    /**
     * @learn https://blog.csdn.net/Liu_yunzhao/article/details/90520028
     * @learn https://blog.csdn.net/qq_38910842/article/details/102972197
     */
    devServer: {
        port: 2048,
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
        //         changeOrigin: true,
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

    /** 打包构建后的资源路径 */
    publicPath: "./",
    // 打包的时候不使用 hash 值.因为我们有时间戳来确定项目的唯一性了
    filenameHashing: false,

    configureWebpack: config => {
        // js 文件名称添加时间戳
        config.output.filename = `js/[name].js${fileSuffix}`;
        config.output.chunkFilename = `js/[name].js${fileSuffix}`;
    },

    css: {
        extract: {
            // css 文件名称添加时间戳
            filename: `css/[name].css${fileSuffix}`,
            chunkFilename: `css/[name].css${fileSuffix}`,
        }
    },
    /** 剔除.map文件构建 */
    productionSourceMap: false
}