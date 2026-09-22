<script lang="ts">
/** 表格操作按钮配置弹框 */
export default {
  name: "TableOperation"
};
</script>
<script lang="ts" setup>
import type { FormInstance } from "element-plus";
import { PresetCodeType, type CurdType } from "../types";
import { FooterBtn, IconInput, PresetCode } from "../part";
import { computed, onBeforeMount, ref } from "vue";
import { reactive } from "vue";
import { getInputRule, useListDrag } from "@/hooks/common";
import { getOperationData } from "../data";
import { Fields, type FieldType } from "@/components/Fields";
import { deepClone } from "@/utils";
import { tableOperation } from "../data/html";
import type { TableOperationType } from "./types";
import { CodeEditor } from "@/components/CodeEditor";

const props = defineProps<TableOperationType.Props>();

const emit = defineEmits<{
  (event: "update:show", show: boolean): void;
  (event: "close"): void;
  (event: "closed"): void;
  (event: "submit", operations: Array<CurdType.Table.Operation>): void;
  (event: "form", target: CurdType.Table.Operation): void;
}>();

const open = computed({
  get() {
    return props.show;
  },
  set(val) {
    emit("close");
    emit("update:show", val);
  },
});

const formRef = ref<FormInstance>();

const state = reactive({
  list: [] as typeof props.operations,
  index: -1,
  /** 当前表单是否处于编辑状态 */
  formEdit: false
});

const form = reactive({
  data: getOperationData()
});

const formRules = {
  text: getInputRule("请输入按钮文字"),
  click: getInputRule("请输入按钮操作代码"),
  icon: getInputRule("请输入图标 class", false),
  type: getInputRule("请选择按钮类型", false),
};

const formItems: Array<FieldType.Member<CurdType.Table.Operation>> = [
  {
    label: "按钮文字",
    prop: "text",
    type: "textarea",
    placeholder: formRules.text.message
  },
  {
    label: "按钮提示文字",
    prop: "tooltip",
    type: "input",
    placeholder: "请输入提示文字"
  },
  {
    label: "按钮点击功能",
    prop: "click",
    type: "slot",
    slotName: "clickCode",
    tooltip: tableOperation.fnTips,
    show: () => !form.data.formConfig
  },
  {
    label: "表单功能",
    prop: "formConfig",
    type: "slot",
    slotName: "formConfig"
  },
  {
    label: "按钮显示条件",
    prop: "show",
    type: "slot",
    slotName: "showCode",
    placeholder: "请输入条件代码，为空则默认显示",
    tooltip: tableOperation.showTips
  },
  {
    label: "按钮类型",
    prop: "type",
    type: "select",
    options: [
      { label: "默认（蓝色）", value: "primary" },
      { label: "成功（绿色）", value: "success" },
      { label: "警告（橙色）", value: "warning" },
      { label: "危险（红色）", value: "danger" },
      { label: "文本（灰色）", value: "info" }
    ]
  },
  {
    label: "按钮图标",
    prop: "icon",
    type: "slot",
    slotName: "IconInput"
  },
  {
    label: "是否为实心按钮",
    prop: "solid",
    type: "switch"
  }
];

function onClose() {
  onRestBtn();
  open.value = false;
}

function onSubmit() {
  emit("submit", deepClone(state.list, true));
  onClose();
}

function onSubmitBtn(type: "add" | "edit") {
  formRef.value!.validate(val => {
    if (!val) return;
    const data = deepClone(form.data, true);
    if (type === "add") {
      state.list.push(data);
    } else {
      state.list[state.index] = form.data;
    }
    onRestBtn();
  });
}

function onRestBtn() {
  state.index = -1;
  form.data = getOperationData();
  state.formEdit = false;
  setTimeout(() => formRef.value?.clearValidate());
}

function onEdit(index: number) {
  const data = state.list[index];
  form.data = deepClone(data, true);
  state.index = index;
  state.formEdit = true;
}

function onDelete(index: number) {
  state.list.splice(index, 1);
}

// watch(
//   () => props.show,
//   show => {
//     state.show = show;
//     if (show) {
//       state.list = deepClone(props.list, true);
//       form.data = getOperationData();
//       state.index = -1;
//       setTimeout(() => {
//         formRef.value?.clearValidate();
//       });
//     }
//   },
//   { immediate: true }
// );

const { onDragStart, onDragMove, onDropEnd } = useListDrag({
  list: () => state.list,
  key: "key"
});

/** 是否能拖拽 */
function canDraggable() {
  if (state.list.length > 1 && state.index === -1) {
    return true;
  }
  return undefined;
}

function onFormConfig() {
  emit("form", form.data);
}

onBeforeMount(() => {
  state.list = deepClone(props.operations, true);
  form.data = getOperationData();
  state.index = -1;
})
</script>
<template>
  <base-dialog
    v-model:show="open"
    title="配置自定义按钮功能"
    width="1000px"
    @close="onClose"
    @closed="emit('closed')"
  >
    <div class="flex">
      <section class="f3">
        <el-form
          ref="formRef"
          :model="form.data"
          :rules="formRules"
          labelPosition="right"
          labelWidth="128px"
          :class="{ 'the-filter-mask': !state.formEdit }"
          data-tips="待新增或编辑操作"
        >
          <Fields :data="form.data" :list="formItems">
            <template #clickCode>
              <PresetCode
                v-model:value="form.data.click"
                :type="PresetCodeType.Map.OperationSubmit"
                :page-id="props.pageId"
              />
            </template>
            <template #showCode>
              <CodeEditor
                v-model:value="(form.data.show as string)"
                language="js"
                placeholder="请输入条件代码，为空则默认显示"
              />
            </template>
            <template #formConfig>
              <el-button
                :type="form.data.formConfig ? 'success' : 'primary'"
                size="small"
                plain
                @click="onFormConfig"
              >
                <i :class="['el-icon--left', form.data.formConfig ? 'el-icon-edit' : 'el-icon-setting']" />
                {{ form.data.formConfig ? "修改表单" : "配置表单" }}
              </el-button>
              <el-button
                v-if="form.data.formConfig"
                type="danger"
                size="small"
                plain
                @click="form.data.formConfig = undefined"
              >
                <i class="el-icon--left el-icon-delete" />
                删除表单
              </el-button>
            </template>
            <template #IconInput>
              <IconInput v-model:value="form.data.icon" />
            </template>
          </Fields>
          <el-form-item>
            <div class="f-right w-full">
              <el-button @click="onRestBtn()">取 消</el-button>
              <el-button
                v-if="state.index > -1"
                type="primary"
                plain
                @click="onSubmitBtn('edit')"
              >
                <i class="el-icon--left el-icon-finished" />
                确认修改
              </el-button>
              <el-button
                v-else
                type="primary"
                plain
                @click="onSubmitBtn('add')"
              >
                <i class="el-icon--left el-icon-plus" />
                确认新增
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </section>
      <transition-group
        class="f2 the-curd-option-list"
        name="the-group"
        tag="div"
      >
        <div
          v-for="(item, itemIndex) in state.list"
          :key="item.key"
          :class="[
            'the-curd-option-item f-vertical',
            { 'the-curd-selected': itemIndex === state.index }
          ]"
          :data-key="item.key"
          :draggable="canDraggable()"
          @dragstart="onDragStart(itemIndex)"
          @dragover="e => onDragMove(e, itemIndex)"
          @drop="onDropEnd"
        >
          <i
            v-if="state.index === -1 && state.list.length > 1"
            class="el-icon--left el-icon-rank"
          />
          <el-button :type="item.type" link>
            <i v-if="item.icon" :class="['el-icon--left', item.icon]" />
            {{ item.text }}
          </el-button>
          <div class="f1" />
          <el-popconfirm
            width="186px"
            title="是否删除该按钮功能？"
            @confirm="onDelete(itemIndex)"
          >
            <template #reference>
              <el-button link type="danger" :disabled="state.index > -1">
                <i class="el-icon-delete" />
              </el-button>
            </template>
          </el-popconfirm>
          <el-button link type="success" @click="onEdit(itemIndex)">
            <i class="el-icon-edit" />
          </el-button>
        </div>
        <div v-if="!state.formEdit" class="f-right mt-[14px] w-full">
          <el-button
            v-if="!state.formEdit"
            type="primary"
            plain
            @click="state.formEdit = true"
          >
            <i class="el-icon--left el-icon-plus" />
            新增功能按钮
          </el-button>
        </div>
        <el-empty
          v-if="!state.list.length"
          key="empty"
          :image-size="120"
          description="请添加操作列功能按钮"
        />
      </transition-group>
    </div>
    <template #footer>
      <FooterBtn
        :disabledSubmit="state.formEdit"
        @close="onClose"
        @submit="onSubmit"
      />
    </template>
  </base-dialog>
</template>
