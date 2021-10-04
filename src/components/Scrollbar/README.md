# 滚动条组件

使用示例

```html
<template>
    <div class="example-page">
        <p class="tips">横向滚动</p>
        <div class="list-x">
            <Scrollbar thumbColor="#87d068">
                <div class="item" v-for="(item) in list" :key="item"></div>
            </Scrollbar>
        </div>
        <p class="tips">垂直滚动</p>
        <div class="list-y">
            <Scrollbar :vertical="true" thumbColor="#87d068">
                <div class="item" v-for="(item) in list" :key="item"></div>
            </Scrollbar>
        </div>
    </div>
</template>
<script>
import { defineComponent } from "vue";
import Scrollbar from "@/components/Scrollbar/index.vue";

export default defineComponent({
    setup() {
        return {
            list: new Array(10).fill(0).map((_, index) => index)
        }
    }
})
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