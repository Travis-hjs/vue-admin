# 上传组件


## 上传图片组件

使用示例

```html
<template>
  <div>
    <!-- 默认使用方式 -->
    <UploadImage :src="formData.logo" @change="onUpload" />
    <!-- 自定义提示、尺寸等参数，更多配置请看组件代码 -->
    <UploadImage uploadId="banner" :src="formData.banner" @change="onUpload" tip="尺寸规格：750px * 391px" width="375px" height="195px" :maxSize="5" :autoHeight="true" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UploadImage, { UploadChange } from "@/components/Upload/Image.vue";

@Component({
  components: {
    UploadImage
  }
})
export default class Demo extends Vue {
  formData = {
    logo: "",
    banner: ""
  }
    
  /**
   * 监听上传图片
   */
  onUpload(info: UploadChange) {
    // info.id 就是组件绑定的 uploadId，多个上传组件的时候用来区分用，可传可不传
    if (info.id === "banner") {
      this.formData.banner = info.src;
    } else {
      this.formData.logo = info.src;
    }
  }
}
</script>
```

# 上传文件包裹组件

使用示例

```html
<template>
  <div>
    <!-- 默认使用方式 -->
    <UploadWrap @change="onUpload" @load="onLoad">
      <el-button :loading="loading">点击上传</el-button>
    </UploadWrap>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import UploadWrap, { UploadChange } from '@/components/Upload/Wrap.vue';

@Component({
  components: {
    UploadWrap
  }
})
export default class Demo extends Vue {
  loading = false;

  onLoad(val: boolean) {
    this.loading = val;
  }

  /**
   * 监听文件上传
   */
  onUpload(info: UploadChange) {
    console.log(info.result);
  }
}
</script>
```