<template>
  <TableOption
    v-if="!tableForm.show"
    class="mgb-10 w-full"
    :editMode="true"
    :config="props.config"
    @action="onOption"
  />
  <div class="the-curd-table-model the-curd-scrollbar">
    <TableForm
      v-if="tableForm.show"
      :config="tableForm.form!"
      :type="tableForm.type"
      :editMode="true"
      @change="onFormEdit"
    />
    <transition-group v-else name="the-group" tag="div" class="fake-table">
      <el-empty
        v-if="!props.config.columns.length"
        key="empty"
        style="padding: 10px 40px"
        :image-size="120"
        description="请添加表格列"
      />
      <div
        v-for="(column, columnIndex) in dragColumns"
        :key="column.prop"
        :data-key="column.prop"
        class="fake-table-item"
        :draggable="dragColumns.length > 1"
        :style="getColumnWidth(column)"
        @dragstart="onDragStart(columnIndex)"
        @dragover="onDragMove($event, columnIndex)"
        @drop="onDropEnd()"
      >
        <div class="fake-table-head f-vertical">
          <i class="el-icon-rank el-icon--left" />
          <TableHeader :column="column" />
        </div>
        <div class="fake-table-cell">
          <el-button
            circle
            plain
            type="success"
            size="small"
            @click="openConfigCol('edit', columnIndex)"
          >
            <i class="el-icon-edit" />
          </el-button>
          <el-button
            circle
            plain
            type="danger"
            size="small"
            @click="deleteColumn(columnIndex)"
          >
            <i class="el-icon-delete" />
          </el-button>
        </div>
        <div class="fake-table-cell f-vertical">
          <template v-if="column.cellType === 'text'">文本内容</template>
          <span v-else-if="column.cellType === 'js'" class="the-tag blue">自定义代码</span>
          <TableImage :column="column" :src="demoUrl" />
        </div>
      </div>
      <div v-if="actionColumn" :style="getColumnWidth(actionColumn)" :key="actionProp" class="fake-table-item" >
        <div class="fake-table-head fvc">操作</div>
        <div class="fake-table-cell" style="text-align: center;">
          <el-tooltip effect="dark" content="配置【操作按钮】和【操作列】的宽度" placement="top">
            <el-button 
              circle
              plain
              type="primary"
              size="small"
              @click="openConfigAction()"
            >
              <i class="el-icon-setting" />
            </el-button>
          </el-tooltip>
          <el-button 
            circle
            plain
            type="danger"
            size="small"
            @click="deleteActionColumn()"
          >
            <i class="el-icon-delete" />
          </el-button>
        </div>
        <div class="fake-table-cell">
          <base-table-actions
            v-if="props.config.actions.length"
            :row="{}"
            :index="1"
            :actions="props.config.actions"
          />
          <el-text v-else type="info">待添加操作~</el-text>
        </div>
      </div>
      <div class="f-vertical" key="fixed">
        <div>
          <p>
            <el-button type="primary" text @click="openConfigCol('add')">
              <i class="el-icon-plus el-icon--left" />
              添加内容列
            </el-button>
          </p>
          <p v-if="!actionColumn">
            <el-button type="primary" text @click="addActionColumn()">
              <i class="el-icon-plus el-icon--left" />
              添加操作列
            </el-button>
          </p>
        </div>
      </div>
    </transition-group>
  </div>
  <EditBtn v-if="!tableForm.show" :type="tableForm.type"  @action="e => emit('action', e)" />
  <TableColumnConfig
    v-model:show="configCol.show"
    :type="configCol.type"
    :keys="configCol.keys"
    :form="configCol.form"
    @submit="onColSubmit"
  />
  <TableDeleteConfig
    v-model:show="configDele.show"
    :select-key="configDele.keyword"
    @submit="onConfigDele"
  />
  <TableActionConfig
    v-model:show="configAction.show"
    :columnWidth="configAction.columnWidth"
    :list="props.config.actions"
    @submit="onConfigAction"
  />
</template>
<script>
/** 表格配置模型组件 */
export default {
  name: "TableModel"
}
</script>
<script lang="ts" setup>
import { computed, type PropType, reactive } from "vue";
import { actionEditKey, actionProp, getColumnData } from "./data";
import { useListDrag } from "@/hooks/common";
import { messageBox } from "@/utils/message";
import type { CurdType, EditBtnType, TableOptionType } from "./types";
import { EditBtn, TableImage, TableOption } from "./part";
import TableForm from "./TableForm.vue";
import TableHeader from "./TableHeader.vue";
import TableColumnConfig from "./TableColumnConfig.vue";
import TableDeleteConfig from "./TableDeleteConfig.vue";
import TableActionConfig from "./TableActionConfig.vue";

const props = defineProps({
  config: {
    type: Object as PropType<CurdType.Table.Config>,
    required: true
  }
});

const emit = defineEmits<{
  (event: "action", type: EditBtnType): void;
}>();

const demoUrl = "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";

const configCol = reactive({
  show: false,
  type: "add" as "add" | "edit",
  index: -1,
  form: undefined as CurdType.Table.Column | undefined,
  keys: [] as Array<string>
});

/** 可拖拽的列表 */
const dragColumns = computed(() =>
  props.config.columns.filter(item => item.prop !== actionProp)
);

function openConfigCol(type: typeof configCol.type, index?: number) {
  configCol.keys = props.config.columns.map(col => col.prop);
  if (type === "edit") {
    const form = props.config.columns[index!];
    configCol.keys = configCol.keys.filter(val => val !== form.prop);
    configCol.index = index!;
    configCol.form = form;
  } else {
    configCol.form = undefined;
  }
  configCol.type = type;
  configCol.show = true;
}

function onColSubmit(form: CurdType.Table.Column) {
  if (configCol.type === "add") {
    props.config.columns.push(form);
  } else {
    props.config.columns[configCol.index] = form;
  }
}

function deleteColumn(index: number) {
  const col = dragColumns.value[index];
  messageBox({
    title: "操作提示",
    content: `是否删除【${col.label}】列？`,
    cancelText: "取消",
    confirm() {
      const n = props.config.columns.findIndex(item => item.prop === col.prop);
      props.config.columns.splice(n, 1);
    }
  });
}

const { onDragStart, onDragMove, onDropEnd } = useListDrag({
  list: () => props.config.columns,
  update(newList) {
    // TODO: 如果丢失响应式，则要改用数组方法进行替换
    props.config.columns = newList;
  },
  findLevel: 5
});

function getColumnWidth(column?: CurdType.Table.Column) {
  const style: { width?: string; minWidth?: string } = {};
  if (column && column.width) {
    style.width = `${column.width}px`;
  }
  if (column && column.minWidth) {
    style.minWidth = `${column.minWidth}px`;
  }
  return style;
}

const actionColumn = computed(() => {
  const list = props.config.columns;
  // TODO: 因为操作栏永远都是处于最后一列，所以可以直接判最后一个即可
  if (list.length > 0 && list[list.length - 1].prop === actionProp) {
    return list[list.length - 1];
  }
  // for (let i = list.length - 1; i >= 0; i--) {
  //   const column = list[i];
  //   if (column.prop === actionProp) {
  //     return column;
  //   }
  // }
  return undefined;
});

/** 添加操作列 */
function addActionColumn() {
  const action = getColumnData();
  action.label = "操作";
  action.prop = actionProp;
  action.minWidth = 120;
  action.width = 160;
  props.config.columns.push(action);
}

function deleteActionColumn() {
  const list = props.config.columns;
  messageBox({
    title: "操作提示",
    content: "是否删除操作列？删除之后需要重新配置。",
    cancelText: "取消",
    confirm() {
      list.splice(list.length - 1, 1);
      props.config.actions = [];
      // TODO: 记得把编辑表单也清空
      if (props.config.formEdit) {
        props.config.formEdit = null;
      }
    }
  });
}

const configDele = reactive({
  show: false,
  keyword: ""
});

function openConfigDele() {
  const key = props.config.selectKey;
  configDele.keyword = key ? key.toString() : "";
  configDele.show = true;
}

function onConfigDele(val: string) {
  props.config.selectKey = val;
}

const configAction = reactive({
  show: false,
  columnWidth: undefined as (number | undefined)
});

function openConfigAction() {
  configAction.show = true;
  configAction.columnWidth = (actionColumn.value!.width as number);
}

function onConfigAction(list: typeof props.config.actions, width?: number) {
  props.config.actions = list;
  const column = props.config.columns.find(item => item.prop === actionProp);
  column!.width = width;
}

const tableForm = reactive({
  show: false,
  form: null as (CurdType.Table.From | null),
  type: "add" as "add" | "edit"
});

function openTableForm(type: typeof tableForm.type) {
  tableForm.type = type;
  if (type === "add" && props.config.formAdd) {
    tableForm.form = props.config.formAdd;
  }
  if (type === "edit" && props.config.formEdit) {
    tableForm.form = props.config.formEdit;
  }
  tableForm.show = true;
}

/**
 * 表单配置编辑
 * @param config 表单配置
 * @param sync 是否同步其他表单
 */
function onFormEdit(config?: CurdType.Table.From, sync?: boolean) {
  const data = props.config;
  const actions = data.actions;
  /** 判断并在操作列中添加一个数据 */
  function handleEditAction() {
    const hasEditAction = actions.length > 0 && actions[0].key === actionEditKey;
    if (config && config.fields.length > 0) {
      if (!actionColumn.value) {
        addActionColumn();
      }
      if (!hasEditAction) {
        actions.unshift({
          key: actionEditKey,
          text: "编辑",
          type: "success",
          icon: "el-icon-edit"
        });
      }
    } else {
      hasEditAction && actions.splice(0, 1);
    }
  }
  if (config) {
    if (tableForm.type === "add") {
      data.formAdd = config;
      if (sync) {
        data.formEdit = JSON.parse(JSON.stringify(config));
        handleEditAction();
      }
    } else {
      data.formEdit = config;
      if (sync) {
        data.formAdd = JSON.parse(JSON.stringify(config));
      }
      handleEditAction();
    }
  }
  tableForm.show = false;
  tableForm.form = null;
}

function onOption(type: TableOptionType) {
  switch (type) {
    case "delete":
      openConfigDele();
      break;

    case "add":
      openTableForm("add");
      break;

    case "edit":
      openTableForm("edit");
      break;
  }
}
</script>
