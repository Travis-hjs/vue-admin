# svg 模块目录

图标的使用和修改非常简单，添加时只需要往`src/icons/svg/`目录下放入你想要的`svg`图标即可。使用时只需要在标签上设置`name`即可，其中`name`就是目录下的`.svg`文件名。图标可以在 [阿里图库](https://www.iconfont.cn/) 中自行下载

像这样：

```html
<template>
  <!-- exit 则是 src/icons/svg/exit.svg -->
  <svg-icon name="exit" />
</template>
```
