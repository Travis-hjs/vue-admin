<script lang="ts">
/** 表格列配置弹框 */
export default {
  name: "TableColumnConfig"
}
</script>
<script lang="ts" setup>
import type { CurdType } from "./types";
import type { FormInstance } from "element-plus";
import { computed, reactive, ref, watch, type PropType } from "vue";
import { getBoldLabel, getColumnData } from "./data";
import { deepClone } from "@/utils";
import { FooterBtn, PresetCode } from "./part";
import { Fields, type FieldType } from "@/components/Fields";
import { getInputRule, getSelectRule } from "@/hooks/common";

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  type: {
    type: String as PropType<"add" | "edit" | "copy">,
    required: true
  },
  keys: {
    type: Array as PropType<Array<string>>,
    required: true
  },
  form: Object as PropType<CurdType.Table.Column>
});

const emit = defineEmits<{
  (event: "update:show", show: boolean): void;
  (event: "submit", form: CurdType.Table.Column): void;
}>();

const state = reactive({
  show: false,
  form: getColumnData("", "")
});

const title = computed(() => {
  const map = {
    add: "新增",
    edit: "编辑",
    copy: "复制"
  }
  return map[props.type] + "表格列";
});

const formRef = ref<FormInstance>();

const formRules = {
  title: getInputRule("请输入表格列标题"),
  prop: {
    required: true,
    validator(_: any, v: string, callback: (err?: Error) => void) {
      if (!v) {
        callback(new Error("输入字段不能为空！"));
      } else {
        if (props.keys.includes(state.form.prop)) {
          callback(new Error("已经存在相同的值！"));
        } else {
          callback();
        }
      }
    },
    trigger: "blur"
  },
  cellType: getSelectRule("请选择展示类型"),
  sort: getSelectRule("请选择排序操作"),
  jsCode: {
    required: true,
    validator(_: any, v: string, callback: (err?: Error) => void) {
      if (!v) {
        callback(new Error("代码片段不能为空！"));
      } else {
        if (v.includes("return")) {
          callback();
        } else {
          callback(new Error(`代码片段必须带有返回字段 "return"`));
        }
      }
    },
    trigger: "blur"
  }
};

const cellTypeOptions: Array<CurdType.Table.ColumnOption<"cellType">> = [
  { label: "默认普通文本", value: "text" },
  { label: "图片预览组件", value: "image" },
  { label: "自定义 js 代码", value: "js" }
];

const sortOptions: Array<CurdType.Table.ColumnOption<"sort">> = [
  { label: "不可排序", value: false },
  { label: "可排序", value: true },
  { label: "默认升序", value: "asc" },
  { label: "默认降序", value: "desc" }
];

const codeTips = `
<p>函数代码片段：</p>
<p>第一个参数${getBoldLabel("cellValue")}是表格值;</p>
<p>第二个参数${getBoldLabel("row")}是完整对象;</p>
<p>例如：${getBoldLabel("return cellValue + row.id;")};</p>
<p>也可以是HTML：${getBoldLabel("return `<html 标签>`")};</p>
`;

const itemList: Array<FieldType.Member<CurdType.Table.Column>> = [
  {
    label: "表格列标题",
    prop: "title",
    type: "input",
    placeholder: formRules.title.message
  },
  {
    label: "表格列键值",
    prop: "prop",
    type: "input",
    placeholder: "请输入表格列键值"
  },
  {
    label: "表格列宽度",
    prop: "width",
    type: "number",
    placeholder: "请输入表格列宽度，例如：120（默认自适应）"
  },
  {
    label: "表格列最小宽度",
    prop: "minWidth",
    type: "number",
    placeholder: "请输入表格列最小宽度，例如：120（默认自适应）"
  },
  {
    label: "表格列展示类型",
    prop: "cellType",
    type: "select",
    options: cellTypeOptions
  },
  {
    label: "图片宽度",
    prop: "imageWidth",
    type: "number",
    placeholder: "请输入数字（默认80px）",
    show: () => state.form.cellType === "image"
  },
  {
    label: "图片高度",
    prop: "imageHeight",
    type: "number",
    placeholder: "请输入数字（默认80px）",
    show: () => state.form.cellType === "image"
  },
  {
    label: "JS代码",
    prop: "jsCode",
    type: "slot",
    slotName: "jsCode",
    tooltip: codeTips,
    show: () => state.form.cellType === "js"
  },
  {
    label: "表格列排序操作",
    prop: "sort",
    type: "select",
    options: sortOptions
  },
  {
    label: "表格列排版",
    prop: "align",
    type: "select",
    options: [
      {
        label: "靠左对齐(默认)",
        value: "left"
      },
      {
        label: "居中对齐",
        value: "center"
      },
      {
        label: "靠右对齐",
        value: "right"
      }
    ],
    placeholder: "请选择"
  },
  {
    label: "表头提示文字",
    prop: "titleTips",
    type: "input",
    placeholder: "请输入提示文字",
    tooltip: "鼠标放到表格头时出现提示文案"
  },
  {
    label: "内容溢出截断",
    prop: "tooltip",
    type: "switch"
  },
  {
    label: "表格列默认展示",
    prop: "visible",
    type: "switch",
    inactiveText: "隐藏",
    activeText: "显示"
  },
];

function onClose() {
  emit("update:show", false);
}

function onSubmit() {
  formRef.value?.validate(val => {
    if (!val) return;
    const form = deepClone(state.form);
    // TODO: 转换数字类型
    const keys = [
      "width",
      "minWidth",
      "imageWidth",
      "imageHeight"
    ] as const;
    keys.forEach(item => {
      if (form[item]) {
        form[item] = Number(form[item]);
      }
    });
    // TODO: 设置预览图片插槽
    if (form.cellType === "image") {
      form.slot = `preview-image-${form.prop}`;
    }
    // TODO: 设置渲染`js`插槽
    if (form.cellType === "js") {
      form.slot = `render-cell-${form.prop}`;
    }
    emit("submit", form);
    onClose();
  });
}

watch(
  () => props.show,
  function (show) {
    state.show = show;
    if (!show) return;
    if (props.type === "add") {
      state.form = getColumnData("", "");
    } else {
      state.form = deepClone(props.form)!;
      if (props.type === "copy") {
        state.form.prop = "";
      }
    }
    setTimeout(() => formRef.value?.clearValidate());
  },
  { immediate: true }
);
</script>
<template>
  <base-dialog
    v-model:show="state.show"
    :title="title"
    width="580px"
    @close="onClose"
  >
    <el-form
      ref="formRef"
      :model="state.form"
      :rules="formRules"
      label-position="right"
      label-width="130px"
    >
      <Fields :data="state.form" :list="itemList">
        <template #jsCode>
          <PresetCode v-model:value="state.form.jsCode" type="table-cell" />
        </template>
      </Fields>
    </el-form>
    <template #footer>
      <FooterBtn @close="onClose" @submit="onSubmit" />
    </template>
  </base-dialog>
</template>
