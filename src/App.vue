<template>
    <router-view />
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";

export default defineComponent({
    name: "App",
    setup() {
        // onMounted(() => {
        //     console.log("App.vue onMounted");
        // })
    }
})
</script>
<style lang="scss">

</style>
