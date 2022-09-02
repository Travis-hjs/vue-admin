# 描述表格全局组件

> 已注册全局组件`<base-desc>`、`<base-desc-item>`

## `<base-desc>` props 说明

| 字段 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| column | `number,string` | 否 | 默认`2`，指定一行多少个`<base-desc-item>` |
| labelWidth | `string` | 否 | 默认`110px`，指定所有`<base-desc-item>`的 label 宽度 |

## `<base-desc-item>` props 说明

| 字段 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| column | `number,string` | 否 | 指定当前 item 在一行中占用多少个位置 |
| label | `string` | 否 | label 字段，当设置`<template slot="label">`时，会覆盖当前绑定值 |
| labelWidth | `string` | 否 | 指定当前 item 的 label 宽度，优先级比`<base-desc>`的高 |

## 使用说明

```html
<template>
  <div class="demo">
    <base-desc column="3">
      <base-desc-item label="商品名称">笔记本电脑</base-desc-item>
      <base-desc-item label="商品类型">电子产品</base-desc-item>
      <base-desc-item label="商品数量">× 18</base-desc-item>
      <base-desc-item label="商品价格">
        <span class="red-text">￥19999.99</span>
      </base-desc-item>
      <base-desc-item column="2">
        <template slot="label">
          <el-link type="text" icon="el-icon-goods">收货地址</el-link>
        </template>
        中国江苏省苏州市吴中区吴中大道 1188 号
      </base-desc-item>
    </base-desc>
  </div>
</template>
```
