# 富文本组件

使用示例

```html
<template>
  <div>
    <RichText ref="rich-text" :height="400" v-model="content" />
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
export default class RichTextDemo extends Vue {

  content = "";

  $refs!: {
    "rich-text": RichText
  }

  /** 设置组件富文本内容 */
  setRichText(val: string) {
    this.$refs["rich-text"].setContent(val);
  }

}
</script>
```