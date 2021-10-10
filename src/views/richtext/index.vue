<template>
    <div class="richtext-home">
        <h2 class="title">wangEditor-富文本编辑器</h2>
        <RichText ref="richText" v-model="content" />
        <h2 class="title pdt_10">内容预览</h2>
        <div class="flex">
            <textarea class="f1" rows="14" v-model="content" @input="setRichText(content)"></textarea>
            <div style="margin-left: 20px">
                <el-button type="success" @click="setRichText('')">清空富文本</el-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RichText from "@/components/RichText/index.vue";

@Component({
    components: {
        RichText
    }
})
export default class RichTextHome extends Vue {

    content = "";

    $refs!: {
        richText: RichText
    }

    /** 设置组件富文本内容 */
    setRichText(val: string) {
        this.$refs["richText"].setContent(val);
    }
}
</script>
<style lang="scss">
.richtext-home{
    .title {
        font-size: 24px;
        color: #444;
        margin-bottom: 22px;
    }
}
</style>