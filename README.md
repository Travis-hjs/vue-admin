
# 无 UI 框架依赖的 Vue3 后台管理模板

> 描述：无 UI 框架依赖，可以无缝接入自己喜欢的 UI 框架使用

- 当前项目要求已安装`18.0`或更高版本的`Node.js`

- 每个文件夹目录的`README.md`都带有具体的说明，*注意查看！* *注意查看！* *注意查看！*

- `vue2.x`之后`v2`分支停止维护，当前项目不再做对应的调整，分支版本依然保留使用

- 因为项目工程的依赖包极少，所以可以随时升级某个依赖包，无需担心不匹配问题；同样，无论你是用`npm`、`pnpm`、`yarn`都是可以成功运行的。

[稀土掘金详细介绍](https://juejin.cn/post/7350874162011750400)

## 版本及分支说明

| 分支 | 演示地址 | 所用技术 | 补充/说明 |
| --- | --- | --- | --- |
| [master](https://github.com/Travis-hjs/vue-admin) | [预览](https://travis-hjs.github.io/vue-admin) | vite 5.x、vue 3.x、vue-router 4.x、typescript | vue3 版本，无引用任何 UI 框架 |
| [el-plus](https://github.com/Travis-hjs/vue-admin/tree/el-plus) | [预览](https://travis-hjs.github.io/vue-admin-el) | vite 5.x、vue 3.x、vue-router 4.x、typescript、element-plus | 基于`master`加入了 UI 框架的配置使用，并增加了 [curd 低代码功能](https://github.com/Travis-hjs/vue-admin/tree/el-plus/src/components/Curd) |
| [v2](https://github.com/Travis-hjs/vue-admin/tree/v2) | [预览](https://travis-hjs.github.io/vue2-admin) | vue-cli 4.x 、vue 2.x、vue-router 3.x、typescript、element-ui | vue2 版本，`element-ui`在这里默认作为常规功能展示引用，模板核心功能依然是无 UI 框架依赖 |

## 功能清单

| 功能 | 描述 & 说明 |
| ---- | ---- |
| layout-核心布局 | [详细说明](./src/layout/README.md) |
| 路由配置和权限使用 | 当前有 **静态** 和 **动态** 路由两种配置，[详细说明](./src/router/REAMDE.md) |
| http-网络请求 | 直接使用原生封装的一个工具函数，[详细说明](./src/api/README.md) |
| 状态管理 | 自行设计的一套管理方式，不限框架使用，[详细说明](./src/store/README.md) |
| svg-图标 | 自行写的一套图标加载方式，可以更好地控制打包后的体积，[详细说明](./src/icons/README.md) |
| 常用工具函数 | 在 [src/utils/index.ts](src/utils/index.ts) 中内置了一些使用频率极高的工具函数：类型判断、日期格式化、文本复制、深拷贝等。 |

当前模板只提供必需的功能，功能模块之间尽可能保证低耦合性，这对所有开发者都是一件非常有利的事情，例如你无需担心替换、修改某一功能时影响到其他。另外更为重要的是：当前所有已实现功能都不依赖任何第三方库（`vue-router`除外），这意味着你可以无需关心`package.json`的依赖版本，因为根本就没有其他依赖，所以根据自己的喜好去引入第三方库的时候会非常舒服。

像前端工程化配置`ESLint`、`StyleLint`、`git-husky`等这类开发约束工具这里一律不使用，理由有以下几点：

- 规则的东西不适用作为通用型项目，因为有很多自由开发者、初学者、后端开发者等，他们在使用时并不需要，这些工具只会使其在初次接触中变得束手无策，所以这违背了我写这个项目的初衷。

- 其次就是这些约束工具对开发效率的提升通常为 **0**，因为在提交代码的时候需要进行全局检查或者对部分文件检查，所以要花费大量的时间去干等；另外`ESlint`这个东西在实际的开发场景中，并不能有效地提高代码质量，因为爱写垃圾的人不管用什么工具都始终会写垃圾代码，有了这些工具只不过是让写出来的垃圾代码变得好看而已，而且在`ts`中，只要不是写的过多`any`，基本都有语法和写法的报错检查，所以`ESlint`的作用就显得很鸡肋，在过去`js`项目中或许有用，但在`ts`中真的可有可无，不如来一个`Prettier`代码格式化工具来得实际。

- 代码约束的工具运行时会消耗过大的内存，在一些电脑性能不那么高的设备上会非常卡顿，这使得开发过程十分笨重。更重要的是，有时候过多的工具检测报错会导致进程崩溃，尽管你的代码可以正常运行。

## 项目运行

**Tips：** 在`package.json`中，`vue-tsc`不是必需的，需要提高构建速度可以自行卸载该依赖，并在构建命令中删除对应`vue-tsc --noEmit &&`代码。但不建议这样做，因为在开发时会失去`ts`的全局代码检查。在官方的默认脚手架中，`tsc`是放在`build`中运行，这样的操作其实非常不利于排查问题，如果项目是放在远程或者其他服务器中进行构建，那么在`build`的过程中因为类型校验而不通过，对开发者来说，通过日志去排查问题的方式非常耗时，所以将`tsc`放在开发环境中才是比较合理的。

```bash
#安装依赖
npm install

# 运行项目
npm run dev

# 构建项目
npm run build
```
