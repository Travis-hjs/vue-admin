# vue 后台管理模板-纯净版

## 描述
参考原版 [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template) 重写的一个超轻量的模板（`typescript`+`element-ui`），只保留了核心功能`layout`、`vue-router`、`svg-icon`、`路由权限管理`。主要是想提供一个项目体积更小、可根据实际情况更自由地扩展的一套中后台管理基础模板。

**部分功能说明**

1. `http请求` 这里我使用的是根据个人习惯用原生写的`ajax`（[参考地址](https://github.com/Hansen-hjs/my-note/blob/master/JavaScript/js/ajax.js)）， 可根据自己喜好可以扩展 `axios` 这类型第三方库。

2. `vuex` 的使用方式我换成了更好的代码提示追踪和更少的代码实现方式，参考 [你不需要vuex](https://juejin.im/post/5d425a83f265da03d8719cb8) 。

3. `layout` 特别说明：组件代码大部分基本重写、代码会比原作者的更少、代码提示更直观、功能效果和原版保持一致。

4. 大写字母的文件均是`calss`模块。

5. 为保证每次`npm run serve`、`npm run build`的时候有极致的编译速度，像`图表`、`富文本编辑`、`Excel`等一些扩展功能根据自己项目选择喜欢的导入使用，这里只提供一个基础的框架模板，另外`hjs`分支是我个人用的一个分支，会有额外的功能扩展模块例如：`Excel`，也是根据个人使用的频率添加的一个实用功能，后续会按需增加。

**后续 `vue-3.0` 正式发布后会继续更新多一套**

## 项目用到的依赖
```json
{
	"dependencies": {
        "core-js": "^3.4.4",
        "element-ui": "^2.13.0",
        "nprogress": "^0.2.0",
        "save-dev": "0.0.1-security",
        "vue": "^2.6.10",
        "vue-class-component": "^7.0.2",
        "vue-property-decorator": "^8.3.0",
        "vue-router": "^3.1.3"
    },
	"devDependencies": {
        "@types/node": "^13.1.4",
        "@types/nprogress": "^0.2.0",
        "@vue/cli-plugin-babel": "^4.1.0",
        "@vue/cli-plugin-router": "^4.0.5",
        "@vue/cli-plugin-typescript": "^4.1.0",
        "@vue/cli-service": "^4.1.0",
        "node-sass": "^4.14.1",
        "sass-loader": "^8.0.0",
        "svg-sprite-loader": "^4.1.6",
        "typescript": "~3.5.3",
        "vue-template-compiler": "^2.6.10"
    },
}
```
## 参考文档（其实看我代码注释就够了）

[原版文档](https://armour.github.io/vue-typescript-admin-docs/zh)

[掘金介绍](https://juejin.im/post/5e154afae51d45410f123afc)

## 预览地址

[demo](https://huangjingsheng.gitee.io/hjs/vue2-admin/)


### sass安装失败时配置（window系统）cmd 窗口首先执行命令再初始化
```
set sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
```

**项目启动的时候命令窗口会有一个类型模块的报错，这个不是代码问题，是`typescript`版本的问题，之后升级到`vue3.0`之后会做调整，所以可以忽略，有强迫症的可以这样操作**

```ts
// 找到 node_modules/@type/node/globals.d.ts 文件
// 把下面这两行注释掉就行

// interface NodeRequire extends NodeJS.Require {} 
interface RequireResolve extends NodeJS.RequireResolve {}
// interface NodeModule extends NodeJS.Module {} 
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
