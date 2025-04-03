# 复选框组件

## 使用示例

```html
<script lang="ts" setup>
import { reactive } from "vue";
import { CheckBox } from "@/components/CheckBox";

const state = reactive({
  check1: false,
  check2: false
})

</script>
<template>
  <div>
    <CheckBox v-model="state.check1" label="带label的复选框" />
    <CheckBox v-model="state.check2" />
  </div>
</template>
```

## 参数

看`index.vue`，懒得写了

## 开关切换样式

```scss
.the-switch {
  --width: 40px;
  --height: 22px;
  display: inline-block;
  width: var(--width);
  height: var(--height);
  border-radius: var(--height);
  background-color: #dcdfe6;
  transition: var(--transition);
  cursor: pointer;
  position: relative;
  appearance: none;
  outline: none;
  border: none;

  &::after {
    position: absolute;
    content: "";
    top: 1px;
    left: 1px;
    width: calc(var(--height) - 2px);
    height: calc(var(--height) - 2px);
    transition: var(--transition);
    transform: translateX(0px);
    background-color: #fff;
    border-radius: 50%;
  }

  &:checked {
    background-color: var(--blue);
    &::after {
      transform: translateX(calc(var(--width) - var(--height) - 1px));
    }
  }
}
```
