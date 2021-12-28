# 折叠盒子组件

使用示例

```html
<template>
    <div>
        <FoldBox>
            <button v-for="item in list" :key="item">选项-{{ item }}</button>
        </FoldBox>
    </div
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FoldBox from "@/components/FoldBox/index.vue";

@Component({
    components: {
        FoldBox
    }
})
export default class Example extends Vue {
    // 注意，当 list 为异步或者动态变化时，需要在 <FoldBox v-if="show"> 组件中设置显示绑定值
    // 因为内部获取自动高度为初始化时获取节点高度然后设置的动态最大高度
    // 或者执行内部的 this.$refs[组件绑定名].updateSize() 来更新动态最大高度
    list = new Array(20).fill(0).map((_, index) => index + 1)
}
</script>
```