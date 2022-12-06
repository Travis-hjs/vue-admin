# 高度折叠过渡组件

使用时，注意`height`样式不要直接写在标签的`style`上，否则会覆盖组件设置样式操作，`min-height`、`max-height`也不可以设置。

## 单个过渡

```html
<template>
  <div class="demo">
    <button @click="switchBox = !switchBox">switch the `div` show or hide</button>
    <CollapseHeight>
      <div class="box" v-show="switchBox">
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
      </div>
    </CollapseHeight>
  </div>
</template>
<script lang="ts" steup>
import { ref } from "vue";
import CollapseHeight from "@/components/CollapseHeight/index.vue";

const switchBox = ref(false);
</script>
<style>
.demo .box {
  width: 100px;
  background-color: orange;
}
</style>
```

## 多个过渡

```html
<template>
  <div class="demo">
    <button @click="count++">add count</button>
    <CollapseHeight type="list">
      <div key="one" v-show="(count % 3 == 0)" class="test-box">
        <p v-for="num in count" :key="num">{{ num }}</p>
      </div>
      <div key="two" v-show="(count % 2 == 0)" class="test-box">
        <p v-for="num in count" :key="num">{{ num }}</p>
      </div>
    </CollapseHeight>
  </div>
</template>
<script lang="ts" steup>
import { ref } from "vue";
import CollapseHeight from "@/components/CollapseHeight/index.vue";

const count = ref(1);
</script>
<style>
.test-box {
  width: 100px;
  background: blueviolet;
}
.test-box + .test-box {
  background-color: orange;
  margin-top: 10px;
}
</style>
```
