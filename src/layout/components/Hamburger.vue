<template>
    <div :class="['hamburger', {'hamburger-active': isActive}]" @click="toggleClick">
        <svg-icon name="hamburger" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Hamburger extends Vue {
    @Prop({ default: false }) isActive!: boolean;

    toggleClick() {
        this.$emit("toggleClick");
    }
}
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
