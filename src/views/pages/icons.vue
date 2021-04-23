<template>
    <div class="icons-container">
        <el-tabs type="border-card">
            <el-tab-pane label="Svg Icons">
                <div v-for="item of svgIcons" :key="item" v-copy="getSvgIconCode(item)">
                    <el-tooltip placement="top">
                        <div slot="content">{{ getSvgIconCode(item) }}</div>
                        <div class="icon-item">
                            <svg-icon :name="item" class="disabled" />
                            <span>{{ item }}</span>
                        </div>
                    </el-tooltip>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Element-UI Icons">
                <div v-for="item of elementIcons" :key="item" v-copy="getElementIconCode(item)">
                    <el-tooltip placement="top">
                        <div slot="content">{{ getElementIconCode(item) }}</div>
                        <div class="icon-item">
                            <i :class="'el-icon-' + item" />
                            <span>{{ item }}</span>
                        </div>
                    </el-tooltip>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
const elementIcons = ["info","error","success","warning","question","back","arrow-left","arrow-down","arrow-right","arrow-up","caret-left","caret-bottom","caret-top","caret-right","d-arrow-left","d-arrow-right","minus","plus","remove","circle-plus","remove-outline","circle-plus-outline","close","check","circle-close","circle-check","zoom-out","zoom-in","d-caret","sort","sort-down","sort-up","tickets","document","goods","sold-out","news","message","date","printer","time","bell","mobile-phone","service","view","menu","more","more-outline","star-on","star-off","location","location-outline","phone","phone-outline","picture","picture-outline","delete","search","edit","edit-outline","rank","refresh","share","setting","upload","upload2","download","loading"];
const req = require.context('../../icons/svg', false, /\.svg$/);
const requireAll = (requireContext: any) => requireContext.keys();
const svgIcons = requireAll(req).map((str: string) => {
    return str.match(/\.\/(.*)\.svg/)![1];
});

@Component({
    name: "Icons"
})
export default class Icons extends Vue {

    private svgIcons = svgIcons;

    private elementIcons = elementIcons;
    
    private getElementIconCode(symbol: string) {
        return `<i class="el-icon-${symbol}" />`;
    }

    private getSvgIconCode(symbol: string) {
        return `<svg-icon name="${symbol}" />`;
    }
}
</script>

<style lang="scss">
.icons-container {
    overflow: hidden;

    .icon-item {
        margin: 20px;
        height: 85px;
        text-align: center;
        width: 100px;
        float: left;
        font-size: 30px;
        color: #24292e;
        cursor: pointer;
    }

    span {
        display: block;
        font-size: 16px;
        margin-top: 10px;
    }

    .disabled {
        pointer-events: none;
    }
}
</style>
