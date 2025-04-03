# 旧版代码

当前操代码实现方式有一个问题，就是在展开后，节点的高度是固定的（`onAfterEnter`并没有执行），也就意味着需要动态对节点内容操作时，因为高度被固定的原因而产生意想不到的预期，所以换了另外一种方式实现。

```html
<script lang="ts">
import { defineComponent, PropType, Transition, TransitionGroup } from "vue";
const transitionStyle = "0.3s height";

/**
 * 高度折叠过渡组件
 * - [api文档](https://cn.vuejs.org/guide/built-ins/transition.html#javascript-hooks)
 */
export default defineComponent({
  name: "CollapseHeight",
  components: {
    Transition,
    TransitionGroup
  }
})
</script>
<template>
  <component
    appear
    :is="type === 'list' ? 'TransitionGroup' : 'Transition'"
    :tag="type === 'list' ? 'section' : undefined"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <slot></slot>
  </component >
</template>
<script lang="ts" setup>
defineProps({
  /** 是单个过渡还是列表过渡 */
  type: {
    type: String as PropType<"single"|"list">,
    default: "single"
  }
});
/**
 * 在元素被插入到 DOM 之前被调用，用这个来设置元素的 "enter-from" 状态
 * @param el 
 */
function onBeforeEnter(el: HTMLElement) {
  // console.log("beforeEnter >>", el);
  el.style.transition = transitionStyle;
  el.style.height = "0px";
}

/**
 * 在元素被插入到 DOM 之后的下一帧被调用，用这个来开始进入动画
 * @param el 
 * @param done 
 */
function onEnter(el: HTMLElement, done?: () => void) {
  // console.log("enter >>", el);
  if (el.scrollHeight !== 0) {
    el.style.height = `${el.scrollHeight}px`;
  } else {
    el.style.height = "";
  }
  el.style.overflow = "hidden";
}

/**
 * 当进入过渡完成时调用。
 * @param el 
 */
function onAfterEnter(el: HTMLElement) {
  // console.log("afterEnter >>", el);
  el.style.transition = el.style.height = "";
}

/**
 * 在 leave 钩子之前调用，大多数时候，你应该只会用到 leave 钩子
 * @param el 
 */
function onBeforeLeave(el: HTMLElement) {
  // console.log("beforeLeave >>", el);
  el.style.display = "block";
  el.style.height = `${el.scrollHeight}px`;
  el.style.overflow = "hidden";
}

/**
 * 在离开过渡开始时调用，用这个来开始离开动画
 * @param el 
 * @param done 如果与 CSS 结合使用，则这个回调是可选参数
 */
function onLeave(el: HTMLElement, done?: () => void) {
  // console.log("leave >>", el);
  if (el.scrollHeight !== 0) {
    el.style.transition = transitionStyle;
    el.style.height = "0px";
  }
}

/**
 * 在离开过渡完成、且元素已从 DOM 中移除时调用
 * @param el 
 */
function onAfterLeave(el: HTMLElement) {
  // console.log("afterLeave >>", el);
  el.style.transition = el.style.height = "";
}

</script>
```

## 高度折叠过渡组件

使用时，注意`height`样式不要直接写在标签的`style`上，否则会覆盖组件设置样式操作；`min-height`、`max-height`也不可以设置，`padding`、`margin`这两个属性的值会参与高度的计算。

## 单个过渡

```html
<script lang="ts" setup>
import { ref } from "vue";
import CollapseHeight from "@/components/CollapseHeight/index.vue";

const switchBox = ref(false);
</script>
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
<style>
.demo .box {
  width: 100px;
  background-color: orange;
}
</style>
```

## 多个过渡

```html
<script lang="ts" setup>
import { ref } from "vue";
import CollapseHeight from "@/components/CollapseHeight/index.vue";

const count = ref(1);
</script>
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
