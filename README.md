# vue 后台管理模板

**项目描述**：基于`vue.js`+`typescript`+`element-ui`写的一套超轻量、可根据实际情况自由地扩展的前端中后台管理基础模板。

**vue 2.x | [vue 3.x](https://github.com/Hansen-hjs/vue-admin/tree/next)**

## 功能清单

* `layout`核心布局模板

* `vue-router`用户权限路由管理

* `svg-icon`组件配置

* `http-请求`功能模块配置，这里我使用的是根据个人习惯用原生写的`ajax`（[代码地址](https://github.com/Hansen-hjs/my-note/blob/master/JavaScript/js/ajax.js)）， 可根据自己喜好可以扩展 `axios` 这类型第三方库。

* `状态管理`这里我没有使用`Vuex`，而是采用了代码更少、代码片段更直观、且更适合`typescript`的设计模式去使用：参考 [你不需要vuex](https://juejin.im/post/5d425a83f265da03d8719cb8)

为保证当前模板的轻量，像`图表`、`富文本编辑`、`Excel`等一些扩展功能根据自己项目选择喜欢的导入使用，这里只提供一个基础的框架模板，另外["hjs"](https://github.com/Hansen-hjs/vue-admin/tree/hjs)分支是我个人用的一个分支，会有额外的功能扩展模块例如：`Excel`、`wangEditor-富文本`；也是根据个人使用的频率添加的一些实用功能，后续会按需增加。

## 预览地址

[vue-admin](https://huangjingsheng.gitee.io/hjs/vue2-admin/)

## sass安装失败时配置（window系统）cmd 窗口首先执行命令再初始化**

```
set sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
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
