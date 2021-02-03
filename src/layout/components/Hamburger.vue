<template>
    <div :class="['hamburger', {'hamburger-active': isActive}]" @click="toggleClick">
        <svg-icon name="hamburger" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "Hamburger",
    props: {
        isActive: {
            type: Boolean,
            default: false
        }
    },
    setup(props, context) {
        function toggleClick() {
            context.emit("toggleClick");
        }

        return {
            toggleClick
        }
    }
})
</script>

<style lang="scss">
.hamburger{
    .svg-icon {
        width: 20px;
        height: 20px;
    }
}

.hamburger-active {
    transform: rotate(180deg);
}
</style>
