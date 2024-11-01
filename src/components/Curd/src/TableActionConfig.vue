<template>
  <base-dialog
    v-model="state.show"
    title="配置操作列按钮功能"
    width="840px"
    @close="onClose"
  >
    <div class="flex">
      <el-form
        ref="formRef"
        :model="state.form"
        :rules="formRules"
        labelPosition="right"
        labelWidth="120px"
        class="f1"
      >
      <el-form-item label="操作列宽度">
        <el-input-number
          v-model="state.width"
          class="w-full"
          controls-position="right"
          placeholder="请输入表格列宽度，例如：160"
        />
      </el-form-item>
      <el-form-item label="按钮文字" prop="text">
        <el-input
          v-model="(state.form.text as string)"
          :placeholder="formRules.text.message"
          clearable
        />
      </el-form-item>
      <el-form-item label="按钮功能代码" prop="jsCode">
        <el-input
          v-model="state.form.jsCode"
          type="textarea"
          placeholder="请输入代码片段"
        />
        <span class="the-tag blue mgt-10" style="line-height: 18px">
          函数代码片段，点击的时候运行：第一个参数 row 是表格对象值，第二个参数 index 是当前索引
        </span>
      </el-form-item>
      <el-form-item label="按钮图标" prop="icon">
        <div class="f-vertical w-full">
          <el-input
            v-model="(state.form.icon as string)"
            :placeholder="formRules.icon.message"
            clearable
          />
          <el-text type="primary" style="width: 110px; text-align: right;">
            <a :href="iconLink" target="_blank">去官网复制</a>
          </el-text>
        </div>
      </el-form-item>
      <el-form-item label="按钮类型" prop="type">
        <el-select v-model="state.form.type" :placeholder="formRules.type.message">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <div class="f-right w-full">
          <el-button v-if="state.index > -1" type="primary" @click="onConfirm">
            <i class="el-icon--left el-icon-finished"></i>
            确认
          </el-button>
          <el-button v-else type="primary" @click="onAdd">
            <i class="el-icon--left el-icon-plus"></i>
            新增按钮
          </el-button>
        </div>
      </el-form-item>
      </el-form>
      <transition-group name="the-group" tag="div" class="the-curd-option-list f1">
        <div
          v-for="(item, itemIndex) in state.list"
          :class="['the-curd-option-item f-vertical', {'the-curd-selected': itemIndex === state.index}]"
          :key="item.key"
          :data-key="item.key !== actionEditKey ? item.key : null"
          :draggable="canDraggable(item)"
          @dragstart="onDragStart(itemIndex)"
          @dragover="e => onDragMove(e, itemIndex)"
          @drop="onDropEnd"
        >
          <el-button :type="item.type" link>
            <i v-if="item.icon" :class="['el-icon--left', item.icon]"></i>
            {{ item.text }}
          </el-button>
          <div class="f1"></div>
          <el-text v-if="item.key === actionEditKey" type="info">编辑按钮不可删除、拖拽等操作，且处于首位</el-text>
          <template v-else>
            <el-popconfirm
              width="186px"
              title="是否删除该按钮功能？"
              @confirm="onDelete(itemIndex)"
            >
              <template #reference>
                <el-button link type="danger">
                  <i class="el-icon-delete" />
                </el-button>
              </template>
            </el-popconfirm>
            <el-button link type="success" @click="onEdit(itemIndex)">
              <i class="el-icon-edit"></i>
            </el-button>
          </template>
        </div>
        <el-empty v-if="!state.list.length" key="empty" :image-size="120" description="请添加操作列功能按钮" />
      </transition-group>
    </div>
    <template #footer>
      <FooterBtn @close="onClose" @submit="onSubmit" />
    </template>
  </base-dialog>
</template>
<script lang="ts">
/** 表格操作列配置弹框 */
export default {
  name: "TableActionConfig"
}
</script>
<script lang="ts" setup>
import { reactive, ref, type PropType } from 'vue';
import { type CurdType } from './types';
import type { FormInstance } from 'element-plus';
import { actionEditKey, getActionData } from './data';
import { watch } from 'vue';
import { useListDrag } from '@/hooks/common';
import { FooterBtn } from './part';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  /** 操作列按钮列表 */
  list: {
    type: Array as PropType<Array<CurdType.Table.Action>>,
    required: true
  },
  /** 列宽 */
  columnWidth: {
    type: Number
  }
});

const emit = defineEmits<{
  (event: "update:show", show: boolean): void;
  (event: "submit", list: Array<CurdType.Table.Action>, width?: number): void;
}>();

const formRef = ref<FormInstance>();
const state = reactive({
  show: false,
  list: [] as typeof props.list,
  form: getActionData(),
  width: undefined as (number | undefined),
  index: -1,
  /** 是否有编辑按钮在当前列表中 */
  hasEdit: false
});

const formRules = {
  text: {
    required: true,
    message: "请输入按钮文字",
    trigger: "blur"
  },
  jsCode: {
    required: true,
    message: "请输入按钮操作代码",
    trigger: "blur"
  },
  icon: {
    required: false,
    message: "请输入图标 class",
    trigger: "blur"
  },
  type: {
    required: false,
    message: "请选择按钮类型",
    trigger: "change"
  }
};

function onClose() {
  emit("update:show", false);
}

function onSubmit() {
  onClose();
  emit("submit", JSON.parse(JSON.stringify(state.list)), state.width);
}

function onAdd() {
  formRef.value?.validate(val => {
    if (!val) return;
    const data = JSON.parse(JSON.stringify(state.form));
    state.list.push(data);
    state.form = getActionData();
  });
}

function onConfirm() {
  formRef.value?.validate(val => {
    if (!val) return;
    state.list[state.index] = state.form;
    state.index = -1;
    state.form = getActionData();
  });
}

function onEdit(index: number) {
  const data = state.list[index];
  state.form = JSON.parse(JSON.stringify(data));
  state.index = index;
}

function onDelete(index: number) {
  state.list.splice(index, 1);
}

watch(() => props.show, function (show) {
  state.show = show;
  if (!show) return;
  state.list = JSON.parse(JSON.stringify(props.list));
  state.form = getActionData();
  state.index = -1;
  state.hasEdit = state.list.some(item => item.key === actionEditKey);
  state.width = props.columnWidth;
  setTimeout(() => formRef.value?.clearValidate());
}, { immediate: true });

const typeOptions = [
  { label: "默认（蓝色）", value: "primary" },
  { label: "成功（绿色）", value: "success" },
  { label: "警告（橙色）", value: "warning" },
  { label: "危险（红色）", value: "danger" },
  { label: "文本（灰色）", value: "info" }
];

const iconLink = "https://element.eleme.cn/#/zh-CN/component/icon";

const { onDragStart, onDragMove, onDropEnd } = useListDrag({
  list: () => state.list,
  update(newList) {
    state.list = newList;
  }
});

/** 是否能拖拽 */
function canDraggable(action: CurdType.Table.Action) {
  if (action.key != actionEditKey && state.list.length > 1 && state.index === -1) {
    return true;
  }
  return undefined;
}
</script>
