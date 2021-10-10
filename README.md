
# 无 UI 框架依赖的 Vue 后台管理模板

**描述**：无 UI 框架依赖，可以无缝接入自己喜欢的 UI 框架使用

## 版本分支说明

当前模板有两套路线：要稳定、兼容性较高就使用`vue 2.x`，最求激进技术就选`vue 3.x`

| 分支名 | 预览地址 | 脚手架 | 技术依赖 | 补充/说明 |
| --- | --- | --- | --- | --- |
| [master](https://github.com/Hansen-hjs/vue-admin) | [在线预览](https://huangjingsheng.gitee.io/hjs/vue2-admin) | vue-cli 4.x | typescript、vue 2.x、vue-router 3.x、element-ui | element-ui在这里默认作为常规功能展示引用，模板核心功能并没有使用该框作为依赖  |
| [hjs](https://github.com/Hansen-hjs/vue-admin/tree/hjs)| [在线预览](https://huangjingsheng.gitee.io/hjs/vue-admin-hjs) | vue-cli 4.x | typescript、vue 2.x、vue-router 3.x、element-ui、echarts、xlsx、wangeditor | 自用分支，基于master增加了一些：图表、Excel、富文本插件 |
| [next](https://github.com/Hansen-hjs/vue-admin/tree/next) | [在线预览](https://huangjingsheng.gitee.io/hjs/vue3-admin) | vite 2.x | typescript、vue 3.x、vue-router 4.x | vue3 版本，没有引用任何 UI 框架 |


## layout 核心布局整体

整体布局功能清单

> 带路由权限的侧边菜单栏

> 路由导航面包屑+路由历史记录标签组合的顶部栏

> 路由视图内容主体+路由缓存配置

**侧边菜单栏（特别说明）**

在写之前我特意去调研了一部分运营人员（他们才是日常使用者），像下面这种缩略的菜单功能使用的频率情况...

![微信截图_20211009135533.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e197e793083e4a16b000be497f3f375c~tplv-k3u1fbpfcp-watermark.image?)

他们的回答几乎和我预想的一致，就是收起的目的是为了浏览更多的正文内容，并不是使用缩略版的菜单导航；而且菜单层级数到达`3层`或以上时，这个功能就十分鸡肋，比如：当我要找到某个子菜单时，我要一层一层的将鼠标放上去逐个找到并且点击。既然这个功能作为使用者并不是那么好用，那接下来就剔除这个鸡肋的功能，只保留核心的基础展示功能（在上面预览地址中可以体验）。

## 路由权限

先来看一下数据结构，基本和以往使用的路由配置相同，只是多加一两个字段作为功能权限标记

```ts
import { RouteConfig } from "vue-router";

export interface RouteMeta {
    /** 侧边栏菜单名、document.title */
    title: string,
    /** `svg`名 */
    icon?: string
    /** 是否在侧边菜单栏不显示该路由 */
    hidden?: boolean
    /**
     * 路由是否需要缓存
     * - 当设置该值为`true`时，路由必须要设置`name`，页面组件中的`name`也是，不然路由缓存不生效
     */
    keepAlive?: boolean
}

/** 自定义的路由类型-继承`RouteConfig` */
export interface RouteItem extends RouteConfig {
    /**
     * 路由名，类似唯一`key`
     */
    name?: string
    /** 外链地址，优先级会比`path`高 */
    link?: string
    /**
     * 可以访问该权限的用户类型数组，与`userInfo.type`对应；
     * 传空数组或者不写该字段代表可以全部用户访问
     * 
     * | number | 用户类型 |
     * | --- | --- |
     * | 0 | 超级管理员 |
     * | 1 | 普通用户 |
     */
    auth?: Array<number>
    /** 标头 */
    meta: RouteMeta
    /** 子级路由 */
    children?: Array<RouteItem>
}
```

需要说明一下的是：`path`这个字段在路由子菜单，也就是下级的时候需要补全路径，像这样：

```js
const example = [
    {
        path: "/example",
        name: "example",
        component: Layout,
        meta: { title: "示例页栏目", icon: "menu" },
        redirect: "/example/request",
        children: [
            {
                path: "/example/request", // 这里要补全，
                // path: "/request",      // 这样写就是跳出了 /example 的下级
                name: "example-request",
                meta: { title: "http-请求示例", keepAlive: true },
                component: () => import("../views/example/xxx.vue"),
            }
        ]
    }
]
```

用户角色权限路由根据`auth`该字段单独对每个路由配置；侧边菜单栏实现的方式十分简单，就是在登录成功后，或者已经登录过的情况下，路由初始化的时候，在组件内部做了数组的过滤，也就是根据路由数组中的`auth`和`hidden`来配置是否显示，然后生成菜单栏，其他几个字段看代码注释提示即可。

## HTTP网络请求

这里我使用的是根据个人习惯用原生写的`ajax`（[代码地址](https://github.com/Hansen-hjs/my-note/blob/master/JavaScript/js/ajax.js)），理由是代码少，功能够用；另外可根据自己喜好可以扩展 `axios` 这类型第三方库。

## SVG图标组件

使用方式：到 [阿里云图标库](https://www.iconfont.cn) 中下载想要的图标，然后下载`svg`文件，最后放到`src/icons/svg`目录下即可

svg加载器使用`svg-sprite-loader`

## 状态管理

这里我没有使用`vuex`，而是采用了代码更少、代码片段更直观、且更适合`typescript`的设计模式去使用：参考 [你不需要vuex](https://juejin.im/post/5d425a83f265da03d8719cb8)

## 项目初始化

```
npm install
```
### 开发运行

```
npm run dev
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
