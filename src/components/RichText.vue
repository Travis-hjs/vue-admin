<template>
    <div class="rich_text">
        <div ref="content"></div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
// http://www.wangeditor.com/doc/
import wangEditor from "wangeditor";
import { RichTextChange } from "../utils/interfaces";

@Component({})
export default class RichText extends Vue {
    /** 富文本高度 */
    @Prop({
        type: Number,
        default: 380
    })
    height!: number

    /** 富文本层级 */
    @Prop({
        type: Number,
        default: 5
    })
    zIndex!: number

    /** 富文本默认提示 */
    @Prop({
        type: String,
        default: "请输入内容"
    })
    placeholder!: string

    /** 富文本内容 */
    @Prop({
        type: String,
        default: ""
    })
    content!: string

    /** 组件`id`，一个页面多个富文本时需要用到 */
    @Prop({
        type: [String, Number],
        default: ""
    })
    id!: string | number
    
    /** 富文本实例 */
    private editor!: wangEditor

    /** 设置富文本内容-给父组件用 */
    public setContent(value: string) {
        this.editor.txt.html(value);
    }

    beforeDestroy() {
        this.editor.destroy();
    }

    mounted() {
        // console.log(this.$refs["content"]);
        const editor = new wangEditor(this.$refs["content"] as any);

        // 监听输入内容
        editor.config.onchange = (value: string) => {
            this.$emit("change", {
                id: this.id,
                value
            } as RichTextChange)
        }
        // 设置富文本高度
        editor.config.height = this.height;
        // 设置富文本层级
        editor.config.zIndex = this.zIndex;
        // 设置富文本默认提示文字
        editor.config.placeholder = this.placeholder;
        // 开始
        editor.create();
        // 初始化的时候设置一次内容
        this.content && editor.txt.html(this.content);

        this.editor = editor;
    }
    
}
</script>
<style lang="scss">
.rich_text{
    width: 100%;
}
</style>