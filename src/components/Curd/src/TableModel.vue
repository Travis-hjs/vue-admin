<script lang="ts">
/** 表格配置模型组件 */
export default {
  name: "TableModel"
}
</script>
<script lang="ts" setup>
import { computed } from "vue";
import { getColumnData } from "./data";
import { useListDrag } from "@/hooks/common";
import { messageBox } from "@/utils/message";
import { CurdEnum, type ComponentProps, type CurdType } from "./types";
import { TableImage } from "./part";
import TableOperation from "./TableOperation.vue";
import { deepClone } from "@/utils";
import { TableActionCell, TableEnum, TableHeader } from "@/components/Table";
import {
  openTableActionConfig,
  openTableBatchConfig,
  openTableColumnConfig,
  openTableFormConfig,
  openTableOperationConfig
} from "./popup";
import type { TableColumnType, TableFormType } from "./popup/types";

const props = defineProps<ComponentProps.TableModel>();

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

const columnInfo = computed(() => {
  const columns = props.config.columns;
  /** 可以拖拽的列表 */
  const drag = [];
  /** 操作列 */
  const action = [];
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.prop === TableEnum.Right) {
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

/**
 * 打开表格列配置
 * @param type 
 * @param index 
 */
function openConfigCol(type: TableColumnType.Props["type"], index?: number) {
  const table = props.config;
  let keys = table.columns.map(col => col.prop);
  let cForm: CurdType.Table.Column | undefined;
  let cIndex: number | undefined;
  let label = "";
  const actionMap = {
    add() {
      label = "新增";
      cForm = undefined;
    },
    edit() {
      label = "编辑";
      const form = table.columns[index!];
      keys = keys.filter(val => val !== form.prop);
      cIndex = index!;
      cForm = form;
    },
    copy() {
      label = "复制";
      const form = table.columns[index!];
      cIndex = index!;
      cForm = form;
    }
  }
  actionMap[type]();
  type = type;
  openTableColumnConfig({
    title: `${label}表格列`,
    keys,
    type,
    column: cForm,
    pageId: props.pageId,
    onSubmit(column) {
      if (["add", "copy"].includes(type)) {
        const drag = deepClone(columnInfo.value.drag);
        if (type === "add") {
          drag.push(column);
        }
        else {
          drag.splice(cIndex! + 1, 0, column);
        }
        table.columns = drag.concat(columnInfo.value.action);
      }
      else {
        table.columns[cIndex!] = column;
      }
    },
  });
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
  const style: { minWidth?: string } = {};
  let width = 0;
  let minWidth = 0;
  if (column && column.width) {
    width = Number.parseFloat(column.width.toString());
  }
  if (column && column.minWidth) {
    minWidth = Number.parseFloat(column.minWidth.toString());
  }
  const size = Math.max(width, minWidth);
  if (size) {
    style.minWidth = `${size}px`;
  }
  return style;
}

const actionColumn = computed(function () {
  const list = props.config.columns;
  // TODO: 因为操作栏永远都是处于最后一列，所以可以直接判最后一个即可
  if (list.length > 0 && list[list.length - 1].prop === TableEnum.Right) {
    return list[list.length - 1];
  }
  // for (let i = list.length - 1; i >= 0; i--) {
  //   const column = list[i];
  //   if (column.key === TableEnum.Right) {
  //     return column;
  //   }
  // }
  return undefined;
});

/** 添加操作列 */
function addActionColumn() {
  const action = getColumnData(TableEnum.Right, "操作");
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

function openConfigBatch() {
  const table = props.config;
  openTableBatchConfig({
    list: table.batchs,
    selectKey: table.selectKey,
    pageId: props.pageId,
    onSubmit(key, list) {
      table.selectKey = key;
      table.batchs = list;
    },
    onForm(target) {
      openFormConfig("other", target);
    },
  });
}

function openConfigAction() {
  const table = props.config;
  openTableActionConfig({
    actionMax: table.actionMax,
    actions: table.actions,
    columnWidth: actionColumn.value!.width as number,
    pageId: props.pageId,
    onSubmit(actions, width, max) {
      table.actions = actions;
      const column = table.columns.find(item => item.prop === TableEnum.Right);
      column!.width = width;
      table.actionMax = max;
    },
    onForm(target) {
      openFormConfig("other", target);
    },
  });
}

interface EditTarget {
  formConfig?: CurdType.Table.From;
}

/**
 * 打开表单配置弹框
 * @param type 进行编辑的表单类型
 * @param target `type === "other"`时用，需要进行编辑的目标对象
 */
function openFormConfig(type: TableFormType.Props["type"], target: EditTarget = {}) {
  let form: CurdType.Table.From;
  switch (type) {
    case "add":
      form = props.config.formAdd!;
      break;

    case "edit":
      form = props.config.formEdit!;
      break;

    case "other":
      form = target.formConfig!;
      break;
  }
  openTableFormConfig({
    type,
    config: form!,
    pageId: props.pageId,
    onSubmit(formConfig, sync) {
      const data = props.config;
      const actions = data.actions;
      /** 判断并在操作列中添加一个数据 */
      function handleEditAction() {
        const hasEditAction = actions.length > 0 && actions[0].key === CurdEnum.ActionEdit;
        if (formConfig && formConfig.fields.length > 0) {
          if (!actionColumn.value) {
            addActionColumn();
          }
          if (!hasEditAction) {
            actions.unshift({
              key: CurdEnum.ActionEdit,
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
        switch (type) {
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
            target.formConfig = formConfig
            break;
        }
      }
    },
  })
}

/**
 * 操作栏配置
 * @param type 
 */
function onOperation(type: CurdEnum) {
  switch (type) {
    case CurdEnum.Batch:
      openConfigBatch();
      break;

    case CurdEnum.Add:
      openFormConfig("add");
      break;

    case CurdEnum.Edit:
      openFormConfig("edit");
      break;
      
    case CurdEnum.Operation:
      {
        const table = props.config;
        openTableOperationConfig({
          operations: table.operations!,
          pageId: props.pageId,
          onSubmit(operations) {
            table.operations = operations;
          },
          onForm(target) {
            openFormConfig("other", target);
          },
        })
      }
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
    :editMode="true"
    :config="props.config"
    :page-id="props.pageId"
    @action="onOperation"
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
      <div v-if="actionColumn" :key="TableEnum.Right" :style="getColumnWidth(actionColumn)" class="fake-table-item">
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
            :max="props.config.actionMax"
            :actions="props.config.actions"
            :page-id="props.pageId"
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
  <div v-if="hasNotWidth">
    <el-button type="primary" @click="onSetWidth()">一键设置最小宽度</el-button>
    <span class="the-tag blue ml-[10px]">
      <i class="el-icon--left el-icon-info"></i>
      当前表格列配置中存在没配置【宽度/最小宽度】，建议一件设置最小宽度，提高表格美观性。
    </span>
  </div>
</template>

