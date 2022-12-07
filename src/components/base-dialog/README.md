# 基础 Dialog 弹出框

[详细介绍](https://juejin.cn/post/7054088327376404488)

使用方式，已注册为全局组件

```html
<template>
  <div>
    <button @click="show = true">打开弹出层</button>

    <base-dialog title="第一个 dialog" v-model="show">
      <div>
        ...your code
      </div>
      <template slot="footer">
        <button @click="show = false">关 闭</button>
      </template>
    </base-dialog>
  </div>
</template>
```

参数说明：

| props |  类型 | 是否必选 | 说明 |
| --- | --- | --- | --- | 
| v-model | boolean | 是 | 显示隐藏 |
| width | string | 否 | 弹出内容宽度：`px`,`%`,`vw`,`em`等 |
| title | string | 否 | 弹出框标题 |
| closeByMask | boolean | 否 | 是否可以通过点击遮罩层关闭`Dialog`，默认`true` |
| appendToBody | boolean | 否 | `Dialog`自身是否插入至`body`元素上。嵌套的`Dialog`必须指定该属性并赋值为`true`，默认`false` |

事件说明：

| 事件名 | 说明 |
| --- | --- |
| close | 关闭时触发 |
| afterLeave | 动画关闭结束时触发 |
| afterEnd | 动画打开结束时触发 |

