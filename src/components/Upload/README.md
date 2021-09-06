# 上传组件


## 上传图片组件

使用示例

```html
<template>
    <div>
        <!-- 默认使用方式 -->
        <UploadImage :src="formData.pageAdImg" @change="onUpload" />
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

## 上传Excel组件并读取对应数据

使用示例

```html
<template>
    <div>
        <UploadExcel :onSuccess="handleSuccess" :beforeUpload="beforeUpload" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UploadExcel from "@/components/Upload/Excel.vue";

interface UploadResult {
    results: Array<any>
    header: Array<string>
}

@Component({
    components: {
        UploadExcel
    }
})
export default class Demo extends Vue {
    tableData: Array<any> = [];
    
    tableHeader: Array<string> = [];

    beforeUpload(file: File) {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (isLt1M) {
            return true;
        }
        this.$message({
            message: "请不要上传大于 1M 的文件。",
            type: "warning",
        });
        return false;
    }

    handleSuccess(res: UploadResult) {
        this.tableData = res.results;
        this.tableHeader = res.header;
    }
}
</script>
```