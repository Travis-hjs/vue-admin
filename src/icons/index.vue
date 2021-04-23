<template>
    <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
        <use :xlink:href="iconName"></use>
    </svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
// <svg>加载处理
const requireAll = (requireContext: any) => requireContext.keys().map(requireContext);
const req = require.context("./svg", false, /\.svg$/);
requireAll(req);

@Component({
    name: "SvgIcon"
})
export default class SvgIcon extends Vue {
    @Prop({
        type: String,
        required: true,
        default: ""
    })
    name!: string;

    @Prop({
        type: String,
        default: ""
    })
    className!: string;

    get iconName() {
        return `#icon-${this.name}`;
    }

    get svgClass() {
        if (this.className) {
            return "svg-icon " + this.className;
        } else {
            return "svg-icon";
        }
    }
    
    // mounted() {
    //     // console.log("mounted", this.name, this.className);
    // }
}
</script>

<style lang="scss">
.svg-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    color: inherit;
    overflow: hidden;
    vertical-align: middle;
    fill: currentColor;
    stroke: currentColor;
}

.svg-fill {
    fill: currentColor;
    stroke: none;
}
</style>