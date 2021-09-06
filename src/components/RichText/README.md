# 富文本组件

使用示例

```html
<template>
    <div>
        <RichText ref="richText" @change="setEditorValue" />
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RichText from "@/components/RichText/index.vue";
import { RichTextChange } from "@/types";

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

}
</script>
```