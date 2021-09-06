<template>
    <div class="richtext_home">
        <h2 class="title">wangEditor-富文本编辑器</h2>
        <RichText ref="richText" @change="setEditorValue" />
        <h2 class="title">内容预览</h2>
        <div class="flex">
            <textarea class="f1" rows="14" name="" readonly v-model="editorValue"></textarea>
            <div style="margin-left: 20px">
                <el-button type="success" @click="setRichTextContent">清空富文本</el-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { RichTextChange } from "@/types";
import { Component, Vue } from "vue-property-decorator";
import RichText from "@/components/RichText/index.vue";

@Component({
    components: {
        RichText
    }
})
export default class RichTextHome extends Vue {

    /** 富文本内容 */
    editorValue: string = "";

    /**
     * 设置富文本内容
     */
    setEditorValue(info: RichTextChange) {
        this.editorValue = info.value;
    }

    /** 设置组件富文本内容 */
    setRichTextContent() {
        (this.$refs["richText"] as RichText).setContent("");
        this.editorValue = "";
    }
    
    mounted() {

    }
}
</script>
<style lang="scss">
.richtext_home{
    .title{
        font-size: 24px;
        color: #444;
        margin-bottom: 22px;
    }
}
</style>