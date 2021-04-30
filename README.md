# vue 后台管理模板

**项目描述**：基于`vue.js`+`typescript`+`element-ui`写的一套超轻量、可根据实际情况自由地扩展的前端中后台管理基础模板。

**vue 3.x | [vue 2.x](https://github.com/Hansen-hjs/vue-admin)**

## 预览地址

[vue-admin](https://huangjingsheng.gitee.io/hjs/vue3-admin/)

## 功能清单

* `layout`核心布局模板

* `vue-router`用户权限路由管理

* `svg-icon`组件配置

* `http-请求`功能模块配置，这里我使用的是根据个人习惯用原生写的`ajax`（[代码地址](https://github.com/Hansen-hjs/my-note/blob/master/JavaScript/js/ajax.js)）， 可根据自己喜好可以扩展 `axios` 这类型第三方库。

* `状态管理`这里我没有使用`vuex`，而是采用了代码更少、代码片段更直观、且更适合`typescript`的设计模式去使用：参考 [你不需要vuex](https://juejin.im/post/5d425a83f265da03d8719cb8)。

**大写字母开头的文件的均为`calss`功能模块**

为保证当前模板的轻量，像`图表`、`富文本编辑`、`Excel`等一些扩展功能根据自己项目选择喜欢的导入使用，这里只提供一个基础的框架模板，另外["hjs"](https://github.com/Hansen-hjs/vue-admin/tree/hjs)分支是我个人用的一个分支，会有额外的功能扩展模块例如：`Excel`、`wangEditor-富文本`；也是根据个人使用的频率添加的一些实用功能，后续会按需增加。

### 特别说明一下

关于状态管理，有人会说，都`vue 3.x`了，为什么不使用`hooks`模式去代替一个全局单例`store`模式？没错，确实是可以用`hooks`的设计模式去代替全局单例`store`。最开始我重写这个项目的时候就是用的`hooks`，后来发现代码多的时候，`hooks`的使用太过于零散了，每个方法，每个变量都要导出导入来使用，这导致我在某个组件或者页面用到的依赖过多的时候，`hooks`的导入实在太多，且太难看了，如果命名不规范，还会有重名函数或变量。有时代码过于细分会并不会带来合理的代码维护，所以还是分模块的单例形式比较合理。于是我又改回到单例模式来使用。

## 项目初始化

```
npm install
```
### 开发运行

```
npm run serve
```

### 打包构建

```
npm run build
```

## npm 镜像设置

**sass 安装失败时先执行以下命令再初始化**

```
set sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
```

**设置 npm 为淘宝镜像，注意不是设置为 cnpm 使用，依然是使用 npm**

```
npm config set registry http://registry.npm.taobao.org/
```

**还原 npm 镜像，要发布自己的 npm 包用**

```
npm config set registry http://registry.npmjs.org/
```
