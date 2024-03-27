
# 无 UI 框架依赖的 Vue3 后台管理模板

> 描述：无 UI 框架依赖，可以无缝接入自己喜欢的 UI 框架使用

- 每个文件夹目录的`README.md`都带有具体的说明，注意查看
- `vue2.x`之后停止维护后，当前项目不再做对应的调整，分支版本依然保留使用

[详细介绍]()

## 版本分支说明

| 分支名 | 预览地址 | 脚手架 | 技术依赖 | 补充/说明 |
| --- | --- | --- | --- | --- |
| [master](https://github.com/Travis-hjs/vue-admin) | [在线预览](https://huangjingsheng.gitee.io/hjs/vue-admin) | vite 4.x | typescript、vue 3.x、vue-router 4.x | vue3 版本，无引用任何 UI 框架 |
| [el-plus](https://github.com/Travis-hjs/vue-admin/tree/el-plus) | [在线预览](https://huangjingsheng.gitee.io/hjs/vue-admin-el) | vite 4.x | typescript、vue 3.x、vue-router 4.x、element-plus | 基于`master`加入了 UI 框架的配置使用 |
| [v2](https://github.com/Travis-hjs/vue-admin/tree/v2) | [在线预览](https://huangjingsheng.gitee.io/hjs/vue2-admin) | vue-cli 4.x | typescript、vue 2.x、vue-router 3.x、element-ui | vue2 版本，`element-ui`在这里默认作为常规功能展示引用，模板核心功能依然是无 UI 框架依赖 |
| [hjs](https://github.com/Travis-hjs/vue-admin/tree/hjs) | [在线预览](https://huangjingsheng.gitee.io/hjs/vue-admin-hjs) | vue-cli 4.x | typescript、vue 2.x、vue-router 3.x、element-ui、echarts、xlsx、wangeditor | 自用分支，基于`v2`增加了一些：图表、Excel、富文本插件、手写签名等功能 |

## 项目初始化

**Tips：** 在`package.json`中，`vue-tsc`不是必需的，需要提高构建速度可以自行卸载该依赖，并在构建命令中删除对应`vue-tsc --noEmit && `代码。但不建议这样做，因为在开发时会失去`ts`的全局代码检查

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



