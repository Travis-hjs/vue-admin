# 滚动条组件

[详细介绍](https://juejin.cn/post/7068617486186479653)

`<Scrollbar>`根据外部节点自动撑满宽高，尺寸只需要设置父节点即可。

## 使用示例

```html
<template>
  <div class="example-page">
    <p class="tips">横向滚动</p>
    <div class="list-x">
      <Scrollbar thumbColor="#42b983">
        <div class="item" v-for="(item) in list" :key="item"></div>
      </Scrollbar>
    </div>
    <p class="tips">垂直滚动</p>
    <div class="list-y">
      <Scrollbar thumbColor="#42b983">
        <div class="item" v-for="(item) in list" :key="item"></div>
      </Scrollbar>
    </div>
    <p class="tips">宽高超出滚动</p>
    <div style="width: 300px; height: 140px;" class="mgb-30">
      <Scrollbar>
        <div style="width: 500px; height: 300px; background-color: yellow; color: #555; line-height: 28px">
          <p>内容内容内容内容内容内容内容</p>
          <p>内容内容内容内容内容内容内容内容内容</p>
          <p>内容内容内容内容内容内容内容</p>
        </div>
      </Scrollbar>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Scrollbar } from "@/components/Scrollbar";

const list = new Array(10).fill(0).map((_, index) => index);
</script>
<style lang="scss">
.example-page {
  width: 100%;
  .tips {
    font-size: 16px;
    color: #555;
    padding: 8px 0;
  }
  .list-x {
    width: 300px;
    height: 88px;
    .item {
      display: inline-block;
      width: 120px;
      height: 100%;
      background-color: tomato;
    }
    .item + .item {
      margin-left: 14px;
    }
  }
  .list-y {
    width: 120px;
    height: 400px;
    .item {
      width: 100%;
      height: 88px;
      margin-bottom: 14px;
      background-color: tomato;
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
}
</style>
```

## 参数说明

| props |  类型 | 是否必选 | 说明 |
| --- | --- | --- | --- |
| thumbColor | string | 否 | 滚动条颜色 |
| thumbSize | string | 否 | 滚动条厚度 |

## 事件说明

当前组件对外暴露了两个方法，用于特殊场景需要手动更新界面用。

| 事件名 | 说明 |
| --- | --- |
| updateWrapStyle | 更新滚动包裹器样式 |
| updateThumbStyle | 更新滚动指示器样式 |

例如：

```ts
import { ref } from "vue";
import { Scrollbar } from "@/components/Scrollbar";

const barRef = ref<InstanceType<typeof Scrollbar>>();

function onUpdate() {
  barRef.value?.updateThumbStyle();
}
```
