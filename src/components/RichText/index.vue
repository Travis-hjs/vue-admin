<template>
  <div ref="content"></div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
// http://www.wangeditor.com/doc/
import wangEditor from "wangeditor";
import { uploadImg } from "@/api/common";

/** 富文本组件 */
@Component({
  name: "RichText",
})
export default class RichText extends Vue {
  /** 双向绑定值 */
  @Prop({
    type: [Number, String],
    default: "",
  })
  value!: string;

  /** 富文本高度 */
  @Prop({
    type: Number,
    default: 380,
  })
  height!: number;

  /** 富文本层级 */
  @Prop({
    type: Number,
    default: 5,
  })
  zIndex!: number;

  /** 富文本默认提示 */
  @Prop({
    type: String,
    default: "请输入内容",
  })
  placeholder!: string;

  /** 富文本实例 */
  private editor!: wangEditor;

  /**
   * 设置富文本内容
   * @description 给父组件使用
   */
  setContent(value: string) {
    this.editor && this.editor.txt.html(value);
  }

  $refs!: {
    content: HTMLElement
  }

  private init() {
    // console.log(this.$refs["content"]);
    const editor = new wangEditor(this.$refs["content"] as any);

    // 监听输入内容
    editor.config.onchange = (value: string) => {
      // console.log('onchange >>', value);
      this.$emit("input", value);
    };
    // 设置富文本高度
    editor.config.height = this.height;
    // 设置富文本层级
    editor.config.zIndex = this.zIndex;
    // 设置富文本默认提示文字
    editor.config.placeholder = this.placeholder;
    // 配置字体颜色
    editor.config.colors = [
      "#ffffff",
      "#000000",
      "#e7e6e6",
      "#44546a",
      "#5b9bd5",
      "#ed7d31",
      "#a5a5a5",
      "#ffc000",
      "#4472c4",
      "#70ad47",
      "#c00000",
      "#ff0000",
      "#ffc000",
      "#fff000",
      "#92d050",
      "#00b050",
      "#00b0f0",
      "#0070c0",
      "#002060",
      "#7030a0",
    ];
    // 配置自定义上传图片
    editor.config.customUploadImg = (resultFiles: Array<File>, insertImage: (res: string) => void) => {
      const loading = this.$loading({
        target: this.$refs["content"],
        text: "上传中...",
      });
      // console.log(resultFiles);
      // const formData = new FormData();
      // formData.append("file", resultFiles[0]);
      uploadImg(resultFiles[0]).then((res) => {
        console.log(res);
        if (res.code == 1) {
          // console.log('上传图片路径 >>', res.data);
          insertImage(res.data.img!);
        } else {
          this.$message.error("上传图片失败");
        }
      }).finally(() => loading.close());
      // resultFiles 是 input 中选中的文件列表
      // insertImage 是获取图片 url 后，插入到编辑器的方法

      // 上传图片，返回结果，将图片插入到编辑器中
      // insertImage(imgUrl)
    };
    // 开始
    editor.create();
    // 初始化的时候设置一次内容
    if (this.value !== undefined || this.value !== null) {
      editor.txt.html(this.value.toString());
    }

    this.editor = editor;
  }

  beforeDestroy() {
    this.editor.destroy();
  }

  mounted() {
    this.init();
  }
}
</script>
