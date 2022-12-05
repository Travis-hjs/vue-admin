
# 无 UI 框架依赖的 Vue3 后台管理模板

**描述**：无 UI 框架依赖，可以无缝接入自己喜欢的 UI 框架使用

## 版本分支说明

> 当前模板有两套路线：`vue 2.x`和`vue 3.x`，自行决定使用

| 分支名 | 预览地址 | 脚手架 | 技术依赖 | 补充/说明 |
| --- | --- | --- | --- | --- |
| [master](https://github.com/Hansen-hjs/vue-admin) | [在线预览](https://huangjingsheng.gitee.io/hjs/vue3-admin) | vite 3.x | typescript、vue 3.x、vue-router 4.x | vue3 版本，无引用任何 UI 框架 |
| [el-plus](https://github.com/Hansen-hjs/vue-admin/tree/el-plus) | 暂无在线预览 | vite 3.x | typescript、vue 3.x、vue-router 4.x、element-plus | 基于`master`加入了 UI 框架的配置使用 |
| [v2](https://github.com/Hansen-hjs/vue-admin/tree/v2) | [在线预览](https://huangjingsheng.gitee.io/hjs/vue2-admin) | vue-cli 4.x | typescript、vue 2.x、vue-router 3.x、element-ui | vue2 版本，`element-ui`在这里默认作为常规功能展示引用，模板核心功能并没有使用该框作为依赖 |
| [hjs](https://github.com/Hansen-hjs/vue-admin/tree/hjs) | [在线预览](https://huangjingsheng.gitee.io/hjs/vue-admin-hjs) | vue-cli 4.x | typescript、vue 2.x、vue-router 3.x、element-ui、echarts、xlsx、wangeditor | 自用分支，基于`v2`增加了一些：图表、Excel、富文本插件、手写签名等功能 |

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
import { RouteRecordRaw } from "vue-router";

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

/** 自定义的路由类型-继承`RouteRecordRaw` */
export type RouteItem = {
  /**
   * 路由名，类似唯一`key`
   * - 路由第一层必须要设置，因为动态路由删除时需要用到，且唯一
   * - 当设置`meta.keepAlive`为`true`时，该值必填，且唯一，另外组件中的`name`也需要对应的同步设置，不然路由缓存不生效
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
  /** 子级路由 */
  children?: Array<RouteItem>
  /** 标头 */
  meta: RouteMeta
} & RouteRecordRaw
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

使用方式：到[阿里云图标库](https://www.iconfont.cn)中下载想要的图标，然后下载`svg`文件，最后放到`src/icons/svg`目录下即可

也是自己写的一个加载器，代码也十分简单：

```ts
import { readFileSync, readdirSync } from "fs";

// svg-sprite-loader 这个貌似在 vite 中用不了
// 该文件只能作为`vite.config.ts`导入使用
// 其他地方导入会报错，因为浏览器环境不支持`fs`模块

/** `id`前缀 */
let idPerfix = "";

const svgTitle = /<svg([^>+].*?)>/;

const clearHeightWidth = /(width|height)="([^>+].*?)"/g;

const hasViewBox = /(viewBox="[^>+].*?")/g;

const clearReturn = /(\r)|(\n)/g;

/**
 * 查找`svg`文件
 * @param dir 文件目录
 */
function findSvgFile(dir: string): Array<string> {
  const svgRes = []
  const dirents = readdirSync(dir, {
    withFileTypes: true
  })
  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      svgRes.push(...findSvgFile(dir + dirent.name + "/"));
    } else {
      const svg = readFileSync(dir + dirent.name).toString().replace(clearReturn, "").replace(svgTitle, (value, group) => {
        // console.log(++i)
        // console.log(dirent.name)
        let width = 0;
        let height = 0;
        let content = group.replace(clearHeightWidth, (val1: string, val2: string, val3: number) => {
          if (val2 === "width") {
            width = val3;
          } else if (val2 === "height") {
            height = val3;
          }
          return "";
        }
        )
        if (!hasViewBox.test(group)) {
          content += `viewBox="0 0 ${width} ${height}"`;
        }
        return `<symbol id="${idPerfix}-${dirent.name.replace(".svg", "")}" ${content}>`;
      }).replace("</svg>", "</symbol>");
      svgRes.push(svg);
    }
  }
  return svgRes;
}

/**
 * `svg`打包器
 * @param path 资源路径
 * @param perfix 后缀名（标签`id`前缀）
 */
export function svgBuilder(path: string, perfix = "icon") {
  if (path.trim() === "") return;
  idPerfix = perfix;
  const res = findSvgFile(path);
  // console.log(res.length)
  return {
    name: "svg-transform",
    transformIndexHtml(html: string) {
      return html.replace("<body>",
      `<body>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0">
        ${res.join("")}
        </svg>`)
    }
  }
}

```

## 状态管理

`Vue3`之后不需要`Vuex`了（虽然我Vue2也不用），而是采用了代码更少、代码片段更直观、且更适合`typescript`的设计模式去使用，简单来理解就是：把共享的数据提取到独立的模块文件中，通过`reactive`来声明，然后导出到各个组件去使用，参考 [你不需要vuex](https://juejin.im/post/5d425a83f265da03d8719cb8)。

关于状态管理，有人会说，都`Vue 3.x`了，为什么不使用`hooks`模式去代替一个全局单例`store`模式？没错，确实是可以用`hooks`的设计模式去代替全局单例`store`。最开始我重写这个项目的时候就是用的`hooks`，后来发现代码多的时候，`hooks`的使用太过于零散了，每个方法，每个变量都要导出导入来使用，这导致我在某个组件或者页面用到的依赖过多的时候，`hooks`的导入实在太多，且太难看了，如果命名不规范，还会有重名函数或变量。有时代码过于细分会并不会带来合理的代码维护，所以还是分模块的单例形式比较合理。于是我又改回到单例模式来使用。

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

**Tips：** 在`package.json`中，`vue-tsc`不是必需的，需要提高构建速度可以自行卸载该依赖，并在构建命令中删除对应`vue-tsc --noEmit && `代码。

