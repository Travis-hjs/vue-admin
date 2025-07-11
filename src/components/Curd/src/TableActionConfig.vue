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
import { actionEditKey, getActionData, getBoldLabel } from "./data";
import { useListDrag } from "@/hooks/common";
import { FooterBtn, IconInput } from "./part";
import { deepClone, isType } from "@/utils";
import { Fields, type FieldType } from "@/components/Fields";

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

const textTips = `
<p>可以输入代码片段，</p>
<p>以${getBoldLabel("return")}关键字为函数标记，</p>
<p>函数第一个参数${getBoldLabel("row")}是表格对象值</p>
<p>例如：${getBoldLabel('return row.status === 1 ? "下架" : "上架";')}</p>
`;

const fnTips = `
<p>函数代码片段，点击的时候运行</p>
<p>函数第一个参数${getBoldLabel("row")}是表格对象值</p>
<p>第二个参数${getBoldLabel("index")}是当前索引</p>
<p>例如：${getBoldLabel("console.log(row, index);")}</p>
`;

const booleanTips = `
<p>可以输入代码片段，</p>
<p>以${getBoldLabel("return")}关键字为函数标记，</p>
<p>函数第一个参数${getBoldLabel("row")}是表格对象值</p>
<p>例如：${getBoldLabel("return row.status === 1;")}返回布尔值进行判断</p>
`;

const formBtn = ref<FormInstance>();

const formColumn = ref<FormInstance>();

const state = reactive({
  show: false,
  /** 按钮列表 */
  list: [] as typeof props.list,
  /** 当前编辑的索引 */
  index: -1,
  /** 是否有编辑按钮在当前列表中 */
  hasEdit: false,
  /** 当前表单是否处于编辑状态 */
  formEdit: false,
});

const form = reactive({
  btn: getActionData(),
  column: {
    width: 160,
    max: 3
  },
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

const columnItems: Array<FieldType.Member<typeof form.column>> = [
  {
    label: "操作列宽度",
    prop: "width",
    type: "number",
    placeholder: columnRules.width.message
  },
  {
    label: "操作按钮限制",
    prop: "max",
    type: "number",
    min: 2,
    placeholder: columnRules.max.message
  }
];

const btnRules = {
  text: {
    required: true,
    message: "请输入按钮文字",
    trigger: "blur"
  },
  click: {
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

const btnItems: Array<FieldType.Member<CurdType.Table.Action>> = [
  {
    label: "按钮文字",
    prop: "text",
    type: "textarea",
    placeholder: btnRules.text.message,
    tooltip: textTips
  },
  {
    label: "按钮功能代码",
    prop: "click",
    type: "textarea",
    placeholder: "请输入代码片段",
    tooltip: fnTips
  },
  {
    label: "按钮显示条件",
    prop: "show",
    type: "textarea",
    placeholder: "请输入条件代码，为空则默认显示",
    tooltip: booleanTips
  },
  {
    label: "按钮禁用条件",
    prop: "disabled",
    type: "textarea",
    placeholder: "请输入条件代码，为空则默认不禁用",
    tooltip: booleanTips
  },
  {
    label: "按钮图标",
    prop: "icon",
    type: "slot",
    slotName: "iconInput"
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
  }
];

function onClose() {
  emit("update:show", false);
}

function onSubmit() {
  formColumn.value!.validate(val => {
    if (!val) return;
    onClose();
    const { width, max } = form.column;
    emit("submit", deepClone(state.list), width, max);
  });
}

function onSubmitBtn(type: "add" | "edit") {
  formBtn.value!.validate(val => {
    if (!val) return;
    const data = deepClone(form.btn);
    if (type === "add") {
      state.list.push(data);
    } else {
      state.list[state.index] = form.btn;
    }
    onRestBtn();
  });
}

function onRestBtn() {
  state.index = -1;
  form.btn = getActionData();
  state.formEdit = false;
  setTimeout(() => formBtn.value?.clearValidate());
}

function onEdit(index: number) {
  const data = state.list[index];
  form.btn = JSON.parse(JSON.stringify(data));
  state.index = index;
  state.formEdit = true;
}

function onDelete(index: number) {
  state.list.splice(index, 1);
}

watch(
  () => props.show,
  function (show) {
    state.show = show;
    if (!show) return;
    state.list = deepClone(props.list);
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

const { onDragStart, onDragMove, onDropEnd } = useListDrag({
  list: () => state.list,
  key: "key",
});

/** 是否能拖拽 */
function canDraggable(action: CurdType.Table.Action) {
  if (action.key != actionEditKey && state.list.length > 1 && state.index === -1) {
    return true;
  }
  return undefined;
}

function getBtnText(action: CurdType.Table.Action) {
  const text = action.text;
  if (isType(text, "string")) {
    if (!text.includes("return")) return text; 
    let str = "文字配置有误";
    try {
      const fn = new Function("row", text);
      str = fn({});
    } catch (error) {
      console.warn("解析按钮文字代码错误 >>", error);
    }
    return str;
  }
  if (isType(text, "function")) {
    return text({});
  }
  return "未设置按钮";
}
</script>
<template>
  <base-dialog
    v-model:show="state.show"
    title="配置操作列按钮功能"
    width="880px"
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
          labelWidth="128px"
        >
          <Fields :data="form.column" :list="columnItems" />
        </el-form>
        <el-divider content-position="left" border-style="dashed">
          <el-text type="info">操作按钮配置</el-text>
        </el-divider>
        <el-form
          ref="formBtn"
          :model="form.btn"
          :rules="btnRules"
          labelPosition="right"
          labelWidth="128px"
          :class="{'the-filter-mask': !state.formEdit}"
          data-tips="待新增或编辑操作"
        >
          <Fields :data="form.btn" :list="btnItems">
            <template #iconInput>
              <IconInput v-model:value="form.btn.icon" />
            </template>
          </Fields>
          <el-form-item>
            <div class="f-right w-full">
              <el-button @click="onRestBtn()">取 消</el-button>
              <el-button v-if="state.index > -1" type="primary" plain @click="onSubmitBtn('edit')">
                <i class="el-icon--left el-icon-finished"></i>
                确认修改
              </el-button>
              <el-button v-else type="primary" plain @click="onSubmitBtn('add')">
                <i class="el-icon--left el-icon-plus"></i>
                确认新增
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
        <div v-if="!state.formEdit" class="w-full f-right">
          <el-button v-if="!state.formEdit" type="primary" plain @click="state.formEdit = true">
            <i class="el-icon--left el-icon-plus"></i>
            新增功能按钮
          </el-button>
        </div>
      </transition-group>
    </div>
    <template #footer>
      <FooterBtn :disabledSubmit="state.formEdit" @close="onClose" @submit="onSubmit" />
    </template>
  </base-dialog>
</template>

