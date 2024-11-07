<template>
  <base-dialog
    v-model="state.show"
    title="配置操作列按钮功能"
    width="860px"
    @close="onClose"
  >
    <div class="flex">
      <section class="f1">
        <el-divider content-position="left" border-style="dashed">
          <el-text type="info">操作列配置</el-text>
        </el-divider>
        <el-form
          ref="formColumn"
          :model="form.column"
          :rules="columnRules"
          labelPosition="right"
          labelWidth="120px"
        >
          <el-form-item label="操作列宽度" prop="width">
            <el-input-number
              v-model="form.column.width"
              class="w-full"
              controls-position="right"
              :placeholder="columnRules.width.message"
            />
          </el-form-item>
          <el-form-item label="操作按钮限制" prop="max">
            <el-input-number
              v-model="form.column.max"
              class="w-full"
              controls-position="right"
              :min="2"
              :placeholder="columnRules.max.message"
            />
          </el-form-item>
        </el-form>
        <el-divider content-position="left" border-style="dashed">
          <el-text type="info">操作按钮配置</el-text>
        </el-divider>
        <el-form
          ref="formBtn"
          :model="form.btn"
          :rules="btnRules"
          labelPosition="right"
          labelWidth="120px"
        >
          <el-form-item label="按钮文字" prop="text">
            <el-input
              v-model="(form.btn.text as string)"
              type="textarea"
              :placeholder="btnRules.text.message"
            />
            <span class="the-tag blue mgt-10" style="line-height: 18px">
              可以输入代码片段，以 return 关键字为函数标记，函数传参和下面一致
            </span>
          </el-form-item>
          <el-form-item label="按钮功能代码" prop="jsCode">
            <el-input
              v-model="form.btn.jsCode"
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
                v-model="(form.btn.icon as string)"
                :placeholder="btnRules.icon.message"
                clearable
              />
              <el-text type="primary" style="width: 110px; text-align: right;">
                <a :href="iconLink" target="_blank">去官网复制</a>
              </el-text>
            </div>
          </el-form-item>
          <el-form-item label="按钮类型" prop="type">
            <el-select v-model="form.btn.type" :placeholder="btnRules.type.message">
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
      </section>
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
          <i v-if="state.index === -1 && item.key !== actionEditKey" class="el-icon--left el-icon-rank"></i>
          <el-button :type="item.type" link>
            <i v-if="item.icon" :class="['el-icon--left', item.icon]"></i>
            {{ getBtnText(item) }}
          </el-button>
          <div class="f1"></div>
          <el-text v-if="item.key === actionEditKey" type="info" size="small">编辑按钮不可删除、拖拽等操作，且处于首位</el-text>
          <template v-else>
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
import { reactive, ref, watch, type PropType } from "vue";
import { type CurdType } from "./types";
import type { FormInstance } from "element-plus";
import { actionEditKey, getActionData } from "./data";
import { useListDrag } from "@/hooks/common";
import { FooterBtn } from "./part";

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
  },
  /** 最大限制几个按钮出现，超过则用【更多】下拉菜单代替展示 */
  actionMax: {
    type: Number
  }
});

const emit = defineEmits<{
  (event: "update:show", show: boolean): void;
  (event: "submit", list: Array<CurdType.Table.Action>, width?: number, max?: number): void;
}>();

const formBtn = ref<FormInstance>();

const formColumn = ref<FormInstance>();

const state = reactive({
  show: false,
  list: [] as typeof props.list,
  index: -1,
  /** 是否有编辑按钮在当前列表中 */
  hasEdit: false,
});

const form = reactive({
  btn: getActionData(),
  column: {
    width: 160,
    max: 3
  }
});

const columnRules = {
  width: {
    required: true,
    message: "请输入表格列宽度，例如：160",
    trigger: "blur"
  },
  max: {
    required: false,
    message: "请输入数量，超出用“更多”下拉展示",
    trigger: "blur"
  }
}

const btnRules = {
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
}

function onClose() {
  emit("update:show", false);
}

function onSubmit() {
  formColumn.value!.validate(val => {
    if (!val) return;
    onClose();
    const { width, max } = form.column;
    emit("submit", JSON.parse(JSON.stringify(state.list)), width, max);
  });
}

function onAdd() {
  formBtn.value!.validate(val => {
    if (!val) return;
    const data = JSON.parse(JSON.stringify(form.btn));
    state.list.push(data);
    form.btn = getActionData();
  });
}

function onConfirm() {
  formBtn.value!.validate(val => {
    if (!val) return;
    state.list[state.index] = form.btn;
    state.index = -1;
    form.btn = getActionData();
  });
}

function onEdit(index: number) {
  const data = state.list[index];
  form.btn = JSON.parse(JSON.stringify(data));
  state.index = index;
}

function onDelete(index: number) {
  state.list.splice(index, 1);
}

watch(
  () => props.show,
  function (show) {
    state.show = show;
    if (!show) return;
    state.list = JSON.parse(JSON.stringify(props.list));
    state.hasEdit = state.list.some(item => item.key === actionEditKey);
    state.index = -1;
    form.btn = getActionData();
    form.column = {
      width: props.columnWidth as number,
      max: props.actionMax as number
    };
    setTimeout(() => {
      formBtn.value?.clearValidate();
      formColumn.value?.clearValidate();
    });
  },
  { immediate: true }
);

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

function getBtnText(action: CurdType.Table.Action) {
  const text = action.text as string;
  if (text.includes("return")) {
    return "自定义文字";
  }
  return text;
}
</script>
