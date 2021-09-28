<template>
    <div class="nested">
        <p class="title">多级嵌套菜单</p>
        <router-view v-slot="{ Component, route }">
            <!-- <transition name="fadeSlideX" mode="out-in"> -->
                <!-- 需要保持缓存时开启 -->
                <!-- <keep-alive> -->
                    <component :is="Component" :key="route.path" />
                <!-- </keep-alive> -->
            <!-- </transition> -->
        </router-view>
    </div>
</template>
<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
    setup(props, context) {
        
    }
})
</script>
<style lang="scss">
.nested {
    width: 100%;
    .title {
        font-size: 24px;
        color: #555;
        margin-bottom: 14px;
    }
    .nested-item {
        padding: 8px 20px;
        background-color: #e7faf0;
        .nested-text {
            color: #13ce66;
        }
    }
    .nested {
        padding: 10px 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
}
</style>