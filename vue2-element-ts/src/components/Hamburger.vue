<template>
    <div :class="[{'is-active': isActive}]" @click="toggleClick">
        <svg-icon name="hamburger" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    name: "Hamburger"
})
export default class Hamburger extends Vue {
    @Prop({ default: false }) private isActive!: boolean;

    private toggleClick() {
        this.$emit("toggleClick");
    }
}
</script>

<style lang="scss" scoped>
.svg-icon {
    vertical-align: middle;
    width: 20px !important;
    height: 20px !important;
}

.is-active {
    transform: rotate(180deg);
}
</style>
