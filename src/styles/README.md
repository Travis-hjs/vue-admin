# js/ts 中使用 scss 变量

[vite文档](https://cn.vitejs.dev/guide/features.html#css-modules)

之前`webpack`环境中导出的方式依然不变，稍作变动的是文件命名，例如`variables.scss`要作为`js/ts`中导入使用，只需要在名字后面加个`.module`即可，像这样：`variables.module.scss`

## 注意事项

在`main.ts`中引入带有`module.scss`后缀的文件作为样式引入使用，默认是不会加载到`<style>`去的，所以需要在没有`module.scss`后缀的文件中`@import ./xxx.module.scss`，然后再在`main.ts`引入该文件

## npm run build 报错

目前还不确定是什么原因，`npm run dev`的时候正常使用，但是`npm run build`就报错，出现：

```
[vite:css-post] value.replace is not a function
```

所以当前项目放弃`xxx.module.scss`这种命名导入使用方式，而是采用直接暴力的操作：正常导入`xxx.scss`之后，写一个提取导出变量的工具函数，这样就实现了相同的功能了。