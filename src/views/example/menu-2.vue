<script lang="ts" setup>
import { message } from "@/utils/message";
import { type FormInstance } from "element-plus";
import { reactive, ref } from "vue";
import { validateEX } from "@/utils/dom";
import { Fields, type FieldType } from "@/components/Fields";

const options = Array.from({ length: 10000 }).map((_, index) => ({
  value: index + 1,
  label: `最多${index + 1}次`,
}));

const formRef = ref<FormInstance>();

function useFormData() {
  return {
    name: "",
    region: "",
    count: "",
    startDate: "",
    endDate: "",
    delivery: false,
    type: [] as Array<string>,
    resource: "",
    desc: "",
    labels: [] as Array<string>,
  }
}

const formRules = {
  name: [
    { required: true, message: "请输入活动名称", trigger: "blur" },
    { min: 3, max: 20, message: "长度为3到20个字符", trigger: "blur" },
  ],
  region: { required: true, message: "请选择活动地区", trigger: "change" },
  count: { required: true, message: "请选择活动次数", trigger: "change" },
  startDate: { required: true, message: "请选择活动时间", trigger: "change" },
  type: { required: true, message: "请选择活动类型", trigger: "change" },
  resource: { required: true, message: "请选择活动来源", trigger: "change" },
  desc: { required: false, message: "请输入活动描述", trigger: "blur" },
}

const fields: Array<FieldType.Member<ReturnType<typeof useFormData>>> = [
  {
    label: "活动名称",
    prop: "name",
    type: "input",
    placeholder: formRules.name[0].message,
  },
  {
    label: "活动区域",
    prop: "region",
    type: "radio",
    options: [
      { label: "上海", value: "shanghai" },
      { label: "北京", value: "beijing" },
      { label: "深圳", value: "shenzhen" },
    ],
    placeholder: formRules.region.message,
  },
  {
    label: "活动次数",
    prop: "count",
    type: "select",
    options: options,
    placeholder: formRules.count.message,
  },
  {
    label: "活动时间",
    prop: "startDate",
    type: "date",
    dateType: "daterange",
    bind: ["startDate", "endDate"],
    format: "Y-M-D",
    placeholder: formRules.startDate.message,
  },
  {
    label: "即时送达",
    prop: "delivery",
    type: "switch",
  },
  {
    label: "活动类型",
    prop: "type",
    type: "select",
    multiple: true,
    max: 999,
    options: [
      { label: "在线活动", value: "a" },
      { label: "促销活动", value: "b" },
      { label: "线下活动", value: "c" },
      { label: "简单的品牌曝光", value: "d" },
    ],
    placeholder: formRules.type.message,
  },
  {
    label: "来源",
    prop: "resource",
    type: "radio",
    options: [
      { label: "赞助", value: 1 },
      { label: "地点", value: 2 },
    ],
    placeholder: formRules.resource.message,
  },
  {
    label: "活动描述",
    prop: "desc",
    type: "textarea",
    placeholder: formRules.desc.message,
  },
  {
    label: "标签分类",
    prop: "labels",
    type: "input-tag",
    placeholder: "请输入内容摁回车新增标签",
  }
];

const form = reactive({
  data: useFormData(),
  fields,
});

function onSubmit() {
  formRef.value!.validate(valid => {
    validateEX("#the-form", valid);
    if (valid) {
      message.success("验证成功，表单数据已打印至控制台");
      console.log("form.data >>", JSON.parse(JSON.stringify(form.data)));
    }
  })
}

function onReset() {
  form.data = useFormData();
  setTimeout(() => formRef.value!.clearValidate());
}

</script>
<template>
  <div class="menu-2">
    <span class="the-tag green mb-[20px]">表单验证操作</span>
    <el-form class="w-[600px]" id="the-form" ref="formRef" :model="form.data" :rules="formRules" label-width="120px">
      <Fields :data="form.data" :list="form.fields" />
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss">
.menu-2 {
  width: 100%;
}
</style>
