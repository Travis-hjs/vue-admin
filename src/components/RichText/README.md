# 富文本组件

使用示例

```html
<template>
  <div>
    <RichText ref="richText" :height="400" v-model="content" />
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
    this.$refs["richText"].setContent("");
  }

}
</script>
```