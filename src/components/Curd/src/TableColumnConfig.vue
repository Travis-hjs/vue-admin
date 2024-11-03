<template>
  <base-dialog
    v-model="state.show"
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
    <el-form-item label="表格列标题" prop="label">
        <el-input
          v-model="state.form.label"
          clearable
          :placeholder="formRules.label.message"
        />
      </el-form-item>
      <el-form-item label="表格列键值" prop="prop">
        <el-input
          v-model="state.form.prop"
          clearable
          placeholder="请输入表格列键值"
        />
      </el-form-item>
      <el-form-item label="表格列宽度" prop="width">
        <el-input-number
          v-model="(state.form.width as number)"
          class="w-full"
          controls-position="right"
          placeholder="请输入表格列宽度，例如：120（默认自适应）"
        />
      </el-form-item>
      <el-form-item label="表格列最小宽度" prop="minWidth">
        <el-input-number
          v-model="(state.form.minWidth as number)"
          class="w-full"
          controls-position="right"
          placeholder="请输入表格列最小宽度，例如：120（默认自适应）"
        />
      </el-form-item>
      <el-form-item label="表格列展示类型" prop="cellType">
        <el-select v-model="state.form.cellType">
          <el-option
            v-for="item in cellTypeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <template v-if="state.form.cellType === 'image'">
        <el-form-item label="图片宽度(像素)" prop="imageWidth">
          <el-input-number
            v-model="state.form.imageWidth"
            class="w-full"
            controls-position="right"
            placeholder="请输入数字（默认80px）"
          />
        </el-form-item>
        <el-form-item label="图片高度(像素)" prop="imageHeight">
          <el-input-number
            v-model="state.form.imageHeight"
            class="w-full"
            controls-position="right"
            placeholder="请输入数字（默认80px）"
          />
        </el-form-item>
      </template>
      <template v-if="state.form.cellType === 'js'">
        <el-form-item label="js代码" prop="jsCode">
          <el-input
            v-model="state.form.jsCode"
            type="textarea"
            placeholder="请输入代码片段"
          />
          <span class="the-tag blue mgt-10" style="line-height: 18px">
            函数代码片段：第一个参数 cellValue 是表格值，第二个参数 row
            是完整对象
          </span>
        </el-form-item>
      </template>
      <el-form-item label="表格列排序操作" prop="sort">
        <el-select v-model="state.form.sort">
          <el-option
            v-for="item in sortOptions"
            :key="item.value.toString()"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="内容溢出截断" prop="tooltip">
        <el-switch
          v-model="state.form.tooltip"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="表头图标提示文字" prop="iconTips">
        <el-input
          v-model="state.form.iconTips"
          clearable
          placeholder="请输入表头图标提示文字"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <FooterBtn @close="onClose" @submit="onSubmit" />
    </template>
  </base-dialog>
</template>
<script lang="ts">
/** 表格列配置弹框 */
export default {
  name: "TableColumnConfig"
}
</script>
<script lang="ts" setup>
import { computed, reactive, ref, watch, type PropType } from 'vue';
import type { CurdType } from './types';
import { getColumnData } from './data';
import type { FormInstance } from 'element-plus';
import { deepClone } from '@/utils';
import { FooterBtn } from './part';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  type: {
    type: String as PropType<"add" | "edit">,
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

const title = computed(() => `${props.type === "add" ? "新增" : "编辑"}表格列`);

const formRef = ref<FormInstance>();

const formRules = {
  label: { required: true, message: "请输入表格列标题", trigger: "blur" },
  prop: {
    required: true,
    validator(r: any, v: string, callback: (err?: Error) => void) {
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
  jsCode: {
    required: true,
    validator(r: any, v: string, callback: (err?: Error) => void) {
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
    // TODO: 设置必须属性
    // form.key = form.prop;
    if (form.cellType === "image") {
      form.slot = form.prop;
    }
    if (form.sort || form.iconTips) {
      form.slotHead = `header-${form.prop}`;
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
    }
    setTimeout(() => formRef.value?.clearValidate());
  },
  { immediate: true }
);
</script>
