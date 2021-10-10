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
import UploadImage from "@/components/Upload/Image.vue";
import { UploadChange } from "@/types";

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