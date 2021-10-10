# 上传组件


## 上传图片组件

使用示例

```html
<template>
    <div>
        <!-- 默认使用方式 -->
        <UploadImage uploadId="logo" :src="formData.logo" @change="onUpload" />
        <!-- 自定义提示、尺寸等参数，更多配置请看组件代码 -->
        <UploadImage uploadId="banner" :src="formData.banner" @change="onUpload" tip="尺寸规格：750px * 391px" width="375px" height="195px" :maxSize="5" :autoHeight="true" />
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import UploadImage, { UploadChange } from "@/components/Upload/Image.vue";

export default defineComponent({
    components: {
        UploadImage
    },
    setup() {
        const formData = reactive({
            banner: "",
            logo: ""
        })

        /**
         * 监听上传图片
         * @param info 回调数据
         */
        function onUpload(info: UploadChange<"banner"|"logo">) {
            // info.id 就是组件绑定的 uploadId，多个上传组件的时候用来区分用，可传可不传
            formData[info.id] = info.src;
        }

        return {
            formData,
            onUpload
        }
    }
})
</script>
```