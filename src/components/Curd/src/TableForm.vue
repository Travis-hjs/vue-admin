<template>
  <el-form
    ref="formRef"
    :model="state.form"
    :rules="state.rules"
    :labelWidth="convertPx(state.config.labelWidth)"
    :labelPosition="state.config.labelPosition"
    :disabled="props.disabled"
    :style="props.editMode ? { width: convertPx(state.config.width) } : null"
    :class="[{'is-edit-form': props.editMode}]"
  >
    <template v-if="props.editMode">
      <transition-group name="the-group" tag="div">
        <el-form-item
          v-for="(field, fieldIndex) in state.config.fields"
          :class="[{'the-curd-selected': provideState.editor.index === fieldIndex && isEdit}]"
          :prop="field.key"
          :key="field.key"
          :data-key="field.key"
          :draggable="state.config.fields.length > 1 && !provideState.editor.show ? true : null"
          @dragstart="onDragStart(fieldIndex)"
          @dragover="e => onDragMove(e, fieldIndex)"
          @drop="onDropEnd"
        >
          <template #label>
            <i
              v-if="state.config.fields.length > 1 && !provideState.editor.show"
              class="el-icon-rank el-icon--left"
              style="line-height: 32px"
            ></i>
            <span>{{ field.label }}</span>
          </template>
          <div class="f-vertical w-full">
            <Field class="mgr-10" :fieldData="field" editMode />
            <el-button link type="success" :disabled="isEdit" @click="openEditor(fieldIndex)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button link type="danger" :disabled="isEdit" @click="onDelete(fieldIndex)">
              <i class="el-icon-delete"></i>
            </el-button>
          </div>
        </el-form-item>
      </transition-group>
      <el-empty v-if="!state.config.fields.length" :description="emptyText" />
      <div v-if="isEdit">
        <el-button link @click="onExit()">
          退出编辑
        </el-button>
        <el-button type="danger" link :disabled="!state.config.fields.length" @click="onDeleteAll()">
          <i class="el-icon--left el-icon-delete"></i>
          删除表单
        </el-button>
        <el-button type="success" link @click="onComplete()">
          <i class="el-icon--left el-icon-finished"></i>
          完成表单
        </el-button>
        <el-button type="primary" link @click="openEditor(-1)">
          <i class="el-icon--left el-icon-plus"></i>
          添加一项
        </el-button>
        <el-button @click="validate()">调试验证</el-button>
      </div>
    </template>
    <template v-if="!props.editMode && state.config && state.config.fields">
      <el-form-item
        v-for="field in state.config.fields"
        :label="field.label"
        :prop="field.key"
        :key="field.key"
      >
        <Field :fieldData="field" />
      </el-form-item>
    </template>
  </el-form>
</template>
<script lang="ts">
/** 表格新增 or 编辑表单 */
export default {
  name: "TableForm"
}
</script>
<script lang="ts" setup>
import { computed, reactive, ref, type PropType } from 'vue';
import type { CurdType } from './types';
import type { FormInstance } from 'element-plus';
import { convertPx, getFormConfig, useProvideState } from './data';
import { watch } from 'vue';
import { messageBox } from '@/utils/message';
import { useListDrag } from '@/hooks/common';
import Field from './Field.vue';

const props = defineProps({
  /** 表单配置 */
  config: {
    type: Object as PropType<CurdType.Table.From>,
    default: () => getFormConfig()
  },
  /** 表单类型 */
  type: {
    type: String as PropType<"add" | "edit">
  },
  /** 是否编辑模式 */
  editMode: {
    type: Boolean
  },
  disabled: {
    type: Boolean
  }
});

const emit = defineEmits<{
  (event: "change", config?: CurdType.Table.From, sync?: boolean): void;
}>();

const formRef = ref<FormInstance>();
const config = getFormConfig();
const state = reactive({
  config,
  form: {} as BaseObj<any>,
  rules: {} as BaseObj<any>
});
/** 父组件注入的对象 */
const provideState = useProvideState();
/** 当前表单操作名 */
const currentName = props.type === "add" ? "新增" : "编辑";

const isEdit = computed(() => provideState.editor.show);

const emptyText = `当前没有表单项，当没有表单项时【${currentName}】功能按钮不会出现~`;

function openEditor(index: number) {
  clear();
  provideState.editor.action = index >= 0 ? "edit" : "add";
  provideState.editor.form = state.config;
  provideState.editor.index = index;
  provideState.editor.show = true;
}

function onDelete(index: number) {
  const list = state.config.fields;
  clear();
  messageBox({
    title: "操作提示",
    content: `是否删除【${list[index].label}】？`,
    cancelText: "取消",
    confirm() {
      list.splice(index, 1);
    }
  });
}

function onDeleteAll() {
  messageBox({
    title: "操作提示",
    content: `是否移除【${currentName}】表单？移除后将不会出现对应功能按钮。`,
    cancelText: "取消",
    confirm() {
      state.config.fields = [];
    }
  });
}

function onExit() {
  emit("change");
}

function onComplete() {
  const name = props.type === "add" ? "编辑" : "新增";
  messageBox({
    title: "操作提示",
    content: `是否将表单数据同步到【${name}】表单？`,
    cancelText: "不同步",
    confirmText: "同步",
    cancel() {
      emit("change", state.config);
    },
    confirm() {
      emit("change", state.config, true);
    }
  });
}

/**
 * 表单验证
 * @param callback
 */
function validate(callback?: () => void) {
  formRef.value?.validate(val => val && callback && callback());
}

/** 表单移除验证 */
function clear() {
  formRef.value?.clearValidate();
}

const { onDragStart, onDragMove, onDropEnd } = useListDrag({
  list: () => state.config.fields,
  update(newList) {
    state.config.fields = newList;
  },
  findLevel: 10
});

watch(() => props.config, function (config) {
  // console.log("config >>", config);
  if (config) {
    state.config = JSON.parse(JSON.stringify(config));
  }
}, { immediate: true });

watch(
  () => state.config.fields,
  function (fields) {
    // console.log("表单项变动 >>", fields);
    const form: typeof state.form = {};
    const rules: typeof state.rules = {};
    const blurs = ["input", "input-between", "textarea"];
    fields &&
      fields.forEach(field => {
        // TODO: 这里赋值什么都不重要，因为校验规则和组件绑定的数据不是这个对象，只是表单组件需要绑定而已
        form[field.key] = field.value;
        if (field.required) {
          // TODO: 验证数据的操作才是关键
          rules[field.key] = [
            {
              required: true,
              validator(_: any, val: any, callback: (err?: Error) => void) {
                // console.log("validator >>", val);
                if (field.type === "input-between" && !field.value[0] && !field.value[1]) {
                  callback(new Error("请输入两个范围字段"));
                  return;
                }
                if (field.valueType === "array" && !(field.value as Array<string>).length) {
                  callback(new Error((field.placeholder as string) || "请选择"));
                  return;
                }
                if (field.valueType !== "boolean" && [undefined, null, ""].includes(field.value as string)) {
                  const tips = blurs.includes(field.type) ? "请输入内容" : "请选择";
                  callback(new Error((field.placeholder as string) || tips));
                  return;
                }
                callback();
              },
              trigger: blurs.includes(field.type) ? "blur" : "change"
            }
          ];
        }
      });
    state.form = form;
    state.rules = rules;
    setTimeout(clear);
  },
  { immediate: true }
);

defineExpose({
  clear,
  validate
});
</script>
