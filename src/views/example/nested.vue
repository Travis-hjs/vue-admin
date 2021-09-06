<template>
    <div class="nested">
        <h2 class="title">{{ content }}</h2>
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

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    setup() {
        const content = "多级菜单嵌套";
        return {
            content
        }
    }
})
</script>

<style>
.title {
    font-weight: 500; font-size: 24px; margin-bottom: 10px;
}
</style>