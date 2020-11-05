<template>
    <div class="rich_text">
        <div ref="content" v-loading="loading"></div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
// http://www.wangeditor.com/doc/
import wangEditor from "wangeditor";
import api from "../api";
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
    
    /** 组件加载状态 */
    private loading = false;

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
        // 配置自定义上传图片
        editor.config.customUploadImg = (resultFiles: Array<File>, insertImgFn: (res: string) => void) => {
            this.loading = true;
            // console.log(resultFiles);
            // const formData = new FormData();
            // formData.append("img", resultFiles[0]);
            api.uploadImg(resultFiles[0], res => {
                // console.log(res);
                insertImgFn(res);
                this.loading = false;
            })
            // resultFiles 是 input 中选中的文件列表
            // insertImgFn 是获取图片 url 后，插入到编辑器的方法

            // 上传图片，返回结果，将图片插入到编辑器中
            // insertImgFn(imgUrl)
        }
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