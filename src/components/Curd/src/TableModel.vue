<script lang="ts">
/** 表格配置模型组件 */
export default {
  name: "TableModel"
}
</script>
<script lang="ts" setup>
import { computed, type PropType, reactive } from "vue";
import { actionEditKey, getColumnData } from "./data";
import { useListDrag } from "@/hooks/common";
import { messageBox } from "@/utils/message";
import type { CurdType, TableOperationType } from "./types";
import { TableImage } from "./part";
import TableOperation from "./TableOperation.vue";
import TableColumnConfig from "./TableColumnConfig.vue";
import TableDeleteConfig from "./TableDeleteConfig.vue";
import TableActionConfig from "./TableActionConfig.vue";
import { deepClone } from "@/utils";
import { curdConfigState } from "./hooks";
import { columnActionProp, TableActionCell, TableHeader } from "@/components/Table";
import TableFormConfig from "./TableFormConfig.vue";

const props = defineProps({
  config: {
    type: Object as PropType<CurdType.Table.Config>,
    required: true
  }
});

const demoUrl = "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";

const columnMenus = [
  {
    key: "edit",
    label: "编辑列",
    icon: "el-icon-edit",
    // style: "el-button el-button--primary is-link",
    click(columnIndex: number) {
      openConfigCol("edit", columnIndex);
    }
  },
  {
    key: "copy",
    label: "复制列",
    icon: "el-icon-document-copy",
    // style: "el-button el-button--success is-link",
    click(columnIndex: number) {
      openConfigCol("copy", columnIndex);
    }
  },
  {
    key: "delete",
    label: "删除列",
    icon: "el-icon-delete",
    // style: "el-button el-button--danger is-link",
    click(columnIndex: number) {
      deleteColumn(columnIndex);
    }
  },
]; 

const configCol = reactive({
  show: false,
  type: "add" as "add" | "edit" | "copy",
  index: -1,
  form: undefined as CurdType.Table.Column | undefined,
  keys: [] as Array<string>
});

const columnInfo = computed(() => {
  const columns = props.config.columns;
  /** 可以拖拽的列表 */
  const drag = [];
  /** 操作列 */
  const action = [];
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.prop === columnActionProp) {
      action.push(column);
    } else {
      drag.push(column);
    }
  }
  return {
    drag,
    action
  }
});

function openConfigCol(type: typeof configCol.type, index?: number) {
  configCol.keys = props.config.columns.map(col => col.prop);
  const actionMap = {
    add() {
      configCol.form = undefined;
    },
    edit() {
      const form = props.config.columns[index!];
      configCol.keys = configCol.keys.filter(val => val !== form.prop);
      configCol.index = index!;
      configCol.form = form;
    },
    copy() {
      const form = props.config.columns[index!];
      configCol.index = index!;
      configCol.form = form;
    }
  }
  actionMap[type]();
  configCol.type = type;
  configCol.show = true;
}

function onColSubmit(form: CurdType.Table.Column) {
  const config = props.config;
  if (["add", "copy"].includes(configCol.type)) {
    const drag = deepClone(columnInfo.value.drag);
    if (configCol.type === "add") {
      drag.push(form);
    } else {
      drag.splice(configCol.index + 1, 0, form);
    }
    config.columns = drag.concat(columnInfo.value.action);
  } else {
    config.columns[configCol.index] = form;
  }
}

function deleteColumn(index: number) {
  const col = columnInfo.value.drag[index];
  messageBox({
    title: "操作提示",
    content: `是否删除【${col.title}】列？`,
    cancelText: "取消",
    confirm() {
      const n = props.config.columns.findIndex(item => item.prop === col.prop);
      props.config.columns.splice(n, 1);
    }
  });
}

const { onDragStart, onDragMove, onDropEnd } = useListDrag({
  list: () => props.config.columns,
  key: "prop",
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

const actionColumn = computed(function () {
  const list = props.config.columns;
  // TODO: 因为操作栏永远都是处于最后一列，所以可以直接判最后一个即可
  if (list.length > 0 && list[list.length - 1].prop === columnActionProp) {
    return list[list.length - 1];
  }
  // for (let i = list.length - 1; i >= 0; i--) {
  //   const column = list[i];
  //   if (column.key === actionColumn) {
  //     return column;
  //   }
  // }
  return undefined;
});

/** 添加操作列 */
function addActionColumn() {
  const action = getColumnData(columnActionProp, "操作");
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
        props.config.formEdit = undefined;
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
  columnWidth: 0,
  actionMax: 0
});

function openConfigAction() {
  configAction.show = true;
  configAction.columnWidth = actionColumn.value!.width as number;
  configAction.actionMax = props.config.actionMax as number;
}

function onConfigAction(list: typeof props.config.actions, width?: number) {
  props.config.actions = list;
  const column = props.config.columns.find(item => item.prop === columnActionProp);
  column!.width = width;
}

interface EditTarget {
  formConfig?: CurdType.Table.From;
}

const tableForm = reactive({
  form: null as (CurdType.Table.From | null),
  type: "add" as "add" | "edit" | "other",
  editTarget: {} as EditTarget,
});

/**
 * 打开表单配置弹框
 * @param type 进行编辑的表单类型
 * @param target `type === "other"`时用，需要进行编辑的目标对象
 */
function openFormConfig(type: typeof tableForm.type, target: EditTarget = {}) {
  tableForm.type = type;
  tableForm.editTarget = target;
  switch (type) {
    case "add":
      tableForm.form = props.config.formAdd!;
      break;

    case "edit":
      tableForm.form = props.config.formEdit!;
      break;

    case "other":
      tableForm.form = target.formConfig!;
      break;
  }
  curdConfigState.editor.showForm = true;
}

/**
 * 表单配置编辑
 * @param formConfig 表单配置
 * @param sync 是否同步其他表单
 */
function onFormConfig(formConfig?: CurdType.Table.From, sync?: boolean) {
  const data = props.config;
  const actions = data.actions;
  /** 判断并在操作列中添加一个数据 */
  function handleEditAction() {
    const hasEditAction = actions.length > 0 && actions[0].key === actionEditKey;
    if (formConfig && formConfig.fields.length > 0) {
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
  if (formConfig) {
    switch (tableForm.type) {
      case "add":
        data.formAdd = formConfig;
        if (sync) {
          if (!data.formEdit) {
            data.formEdit = {
              title: "编辑",
              width: formConfig.width,
              labelWidth: formConfig.labelWidth,
              labelPosition: formConfig.labelPosition,
              fields: deepClone(formConfig.fields)
            };
          } else {
            data.formEdit.fields = deepClone(formConfig.fields);
          }
          handleEditAction();
        }
        break;

      case "edit":
        data.formEdit = formConfig;
        if (sync) {
          if (!data.formAdd) {
            data.formAdd = {
              title: "新增",
              width: formConfig.width,
              labelWidth: formConfig.labelWidth,
              labelPosition: formConfig.labelPosition,
              fields: deepClone(formConfig.fields)
            };
          } else {
            data.formAdd.fields = deepClone(formConfig.fields);
          }
        }
        handleEditAction();
        break;

      case "other":
        // TODO: 这里目前没有使用到，留着后面其他按钮需要配置表单时用
        tableForm.editTarget.formConfig = formConfig;
        tableForm.editTarget = {}; // 用完移除引用
        break;
    }
  }
  curdConfigState.editor.showForm = false;
  tableForm.form = null;
}

function onOption(type: TableOperationType) {
  switch (type) {
    case "delete":
      openConfigDele();
      break;

    case "add":
      openFormConfig("add");
      break;

    case "edit":
      openFormConfig("edit");
      break;
  }
}

/** 是否有未设置宽度或最小宽度的列 */
const hasNotWidth = computed(() => columnInfo.value.drag.some(col => !col.width && !col.minWidth));

function onSetWidth() {
  const heads: Array<HTMLElement> = Array.from(document.querySelectorAll(".fake-table-head"));
  const domInfo: BaseObj<number> = {};
  heads.forEach(el => {
    const key = el.dataset.head || "";
    if (key) {
      domInfo[key] = Math.round(el.clientWidth);
    }
  });  
  props.config.columns.forEach(col => {
    if (Object.prototype.hasOwnProperty.call(domInfo, col.prop)) {
      col.minWidth = domInfo[col.prop];
    }
  });
}
</script>
<template>
  <TableOperation
    v-if="!curdConfigState.editor.showForm"
    :editMode="true"
    :config="props.config"
    @action="onOption"
  />
  <div class="the-curd-table-model">
    <transition-group name="the-group" tag="div" class="fake-table">
      <el-empty
        v-if="!props.config.columns.length"
        key="empty"
        style="padding: 10px 40px"
        :image-size="120"
        description="请添加表格列"
      />
      <div
        v-for="(column, columnIndex) in columnInfo.drag"
        :key="column.prop"
        :data-key="column.prop"
        :draggable="columnInfo.drag.length > 1"
        :style="getColumnWidth(column)"
        class="fake-table-item"
        @dragstart="onDragStart(columnIndex)"
        @dragover="onDragMove($event, columnIndex)"
        @drop="onDropEnd()"
      >
        <div class="fake-table-head f-vertical" :style="{ 'text-align': column.align }" :data-head="column.prop">
          <i class="el-icon-rank el-icon--left"></i>
          <TableHeader :column="column" />
        </div>
        <div class="fake-table-cell operation f-vertical" :class="[column.align ? `f-${column.align}` : undefined]">
          <el-dropdown trigger="click">
            <el-button link type="primary">
              配置列
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="menu in columnMenus"
                  :key="menu.key"
                  @click="menu.click(columnIndex)"
                >
                  <i :class="['el-icon--left', menu.icon]"></i>
                  {{ menu.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="fake-table-cell f-vertical" :class="[column.align ? `f-${column.align}` : undefined]">
          <template v-if="column.cellType === 'text'">文本内容</template>
          <span v-else-if="column.cellType === 'js'" class="the-tag blue">自定义代码</span>
          <TableImage :column="column" :src="demoUrl" />
        </div>
      </div>
      <div v-if="actionColumn" :key="columnActionProp" :style="getColumnWidth(actionColumn)" class="fake-table-item">
        <div class="fake-table-head fvc">操作</div>
        <div class="fake-table-cell operation fvc">
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
        <div class="fake-table-cell disabled">
          <TableActionCell
            v-if="props.config.actions.length"
            :row="{}"
            :index="1"
            :actions="props.config.actions"
          />
          <el-text v-else type="info">待添加操作~</el-text>
        </div>
      </div>
      <div key="column-setting" class="f-vertical">
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
  <div v-if="!curdConfigState.editor.showForm && hasNotWidth">
    <el-button type="primary" @click="onSetWidth()">一键设置最小宽度</el-button>
    <span class="the-tag blue ml-[10px]">
      <i class="el-icon--left el-icon-info"></i>
      当前表格列配置中存在没配置【宽度/最小宽度】，建议一件设置最小宽度，提高表格美观性。
    </span>
  </div>
  
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
  
  <!-- @openFormConfig="e => openFormConfig('other', e)" -->
  <TableActionConfig
    v-model:show="configAction.show"
    :columnWidth="configAction.columnWidth"
    :actionMax="configAction.actionMax"
    :list="props.config.actions"
    @submit="onConfigAction"
  />

  <TableFormConfig
    v-model:show="curdConfigState.editor.showForm"
    :config="tableForm.form!"
    :type="tableForm.type"
    @change="onFormConfig"
  />
</template>

