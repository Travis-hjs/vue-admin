const path = require('path');
　　
function resolve(dir) {
　　return path.join(__dirname, dir);
}

module.exports = {
    /** 打包构建后的资源路径 */
    publicPath: './',

    devServer: {
        port: 2048,
    },

    chainWebpack(config) {
        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    },

    /** 剔除.map文件构建 */
    productionSourceMap: false
}