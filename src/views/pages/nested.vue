<template>
    <div class="nested">
        <transition name="fade-transform" mode="out-in">
            <router-view />
        </transition>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    setup() {
        const content = "nested";
        return {
            content
        }
    }
})
</script>

<style>

</style>