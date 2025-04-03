# 上传组件目录

## 上传图片组件

- 使用示例

```html
<script lang="ts" setup>
import { reactive } from "vue";
import { UploadImage, type UploadChange } from "@/components/Upload";

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
</script>
<template>
  <div>
    <!-- 默认使用方式 -->
    <UploadImage uploadId="logo" :src="formData.logo" @change="onUpload" />
    <!-- 自定义提示、尺寸等参数，更多配置请看组件代码 -->
    <UploadImage uploadId="banner" :src="formData.banner" @change="onUpload" tip="尺寸规格：750px * 391px" width="375px" height="195px" :maxSize="5" :autoHeight="true" />
  </div>
</template>
```

- 参数说明

| props |  类型 | 是否必选 | 说明 |
| --- | --- | --- | --- |
| src | string | 是 | 组件上传图片路径 |
| uploadId | string/number | 否 | 传组件唯一标记 |
| width | string | 否 | 图片宽度 |
| height | string | 否 | 图片高度 |
| autoHeight | boolean | 否 | 是否自动高度 |
| tip | string/number | 否 | 图片上传提示 |
| maxSize | number | 否 | 上传图片最大体积，单位`M` |
| disabled | boolean | 否 | 是否禁用状态 |

- 事件说明

| 事件名 | 说明 |
| --- | --- |
| change | 上传成功时回调，参数类型为`UploadChange` |

## 上传包裹组件

do some ...

## 上传视频组件

do some ...
