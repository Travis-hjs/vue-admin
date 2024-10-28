<template>
  <div class="the-curd-main-page">
    <section :class="[state.editor.show ? 'f1' : 'w-full']">
      <Search v-if="showSearch" :data="props.data.search" @search="onSearch" />
      <TableModel v-if="state.editor.type === 'table'" :config="props.data.table" @action="onEditChange" />
      <template v-else-if="state.editor.type === 'search'">
        <EditBtn @action="onEditChange" />
      </template>
      <template v-else>
        <template v-if="props.data.table.columns.length > 0">
          <div class="f-vertical mgb-10">
            <span v-if="props.data.table.selectKey" class="the-tag blue">
              已选择 {{ tableState.selectList.length }} 条数据
            </span>
            <div class="f1" />
            <TableOption :config="props.data.table" @action="onTableOption" />
          </div>
          <base-table
            v-model:select-list="tableState.selectList"
            :data="tableState.data"
            :columns="tableColumns"
            :actions="actionList"
            :loading="state.loading"
            :select-key="props.data.table.selectKey!"
          >
            <template v-for="head in tableSlot.head" :key="head" v-slot:[head]="scope">
              <TableHeader :column="tableColumns[scope.$index]" @sort="onSort" />
            </template>
            <template v-for="cell in tableSlot.cell" :key="cell" v-slot:[cell]="scope">
              <!-- TODO: 因为插槽中只有图片这个功能，所以不需要做条件判断 -->
              <TableImage
                :column="getColumnByProp(cell)"
                :src="(scope.row[cell] as string)"
                :previewList="(tableSlot.cell.map(k => scope.row[k]) as Array<string>)"
              />
            </template>
          </base-table>
          <base-pagination :disabled="state.loading" :pageInfo="tableState.pageInfo" @change="getTableData" />
        </template>
        <el-empty v-else description="当前页面没有表格配置数据，请配置后再操作~">
          <el-button type="primary" @click="onEditor('table')">去配置</el-button>
        </el-empty>
      </template>
    </section>
    <Editor v-model:show="state.editor.show" :config="props.data" />
    <base-dialog
      v-model="tableState.formShow"
      :title="formSetting.title"
      :width="formSetting.config.width"
      @close="onCloseForm()"
    >
      <TableForm
        ref="formRef"
        :config="formSetting.config"
        :type="tableState.formType"
        :disabled="tableState.formLoading"
      />
      <template #footer>
        <FooterBtn :loading="tableState.formLoading" @close="onCloseForm()"  @submit="onSubmitForm()" />
      </template>
    </base-dialog>
    <TableSetting v-model:show="tableSetting.show" :columns="props.data.table.columns" @submit="onTableSetting" />
    <el-button
      v-if="!state.showEntrance && !state.editor.type"
      class="the-curd-entrance"
      type="primary"
      size="small"
      @click="state.showEntrance = true"
    >
      <i class="el-icon-arrow-left" />
    </el-button>
    <base-dialog v-model="state.showEntrance" title="请选择配置操作" width="400px">
      <div class="the-curd-entrance-item" @click="onEditor('search')">
        <p>配置筛选相关功能</p>
      </div>
      <div class="the-curd-entrance-item" @click="onEditor('table')">
        <p>配置表格相关功能</p>
      </div>
      <template #footer>
        <el-button @click="state.showEntrance = false">关 闭</el-button>
      </template>
    </base-dialog>
  </div>
</template>
<script lang="ts" setup>
import { computed, provide, reactive, ref, type PropType } from "vue";
import { exportPropToWindow, provideKey, setFieldValue, type CurdType } from "./index";
import Search from "./Search.vue";
import type { FilterBtnType } from "../FilterBox";
import Editor from "./Editor.vue";
import { copyText, formatDate, ranInt } from "@/utils";
import { message, messageBox } from "@/utils/message";
import { usePageInfo } from "@/hooks/common";
import TableModel from "./TableModel.vue";
import {
  TableOption,
  TableHeader,
  TableSetting,
  TableForm,
  TableImage,
  FooterBtn,
  EditBtn,
  actionEditKey,
  type OptionBtn,
  type EditBtnType,
} from "./TablePart";

const props = defineProps({
  /** 是配置，同时也是响应数据 */
  data: {
    type: Object as PropType<CurdType.Config>,
    required: true
  }
});

const state = reactive<CurdType.State>({
  loading: false,
  editor: {
    show: false,
    type: null,
    form: null,
    action: "add",
    index: -1
  },
  showEntrance: false,
});

const showSearch = computed(() => {
  const editorType = state.editor.type;
  if (editorType === "search") {
    return true;
  }
  if (!editorType && props.data.search.list.length > 0) {
    return true;
  }
  return false;
});

provide(provideKey, state);

/** 备份编辑之前的数据 */
let backupsConfig: CurdType.Config;

/**
 * 开始进入编辑模式
 * @param type 
 */
function onEditor(type: typeof state.editor.type) {
  state.editor.type = type;
  state.editor.show = false;
  state.editor.index = -1;
  state.showEntrance = false;
  backupsConfig = JSON.parse(JSON.stringify(props.data));
}

function onSearch(type: FilterBtnType) {
  if (type === "reset") {
    props.data.search.list.forEach(setFieldValue);
  }
}

function onExit() {
  state.editor.index = -1;
  state.editor.show = false;
  state.editor.type = null;
}

function onComplete() {
  onExit();
}

function onCopy() {
  copyText(JSON.stringify(props.data), () => message.success("复制成功！"));
}

const tableState = reactive({
  selectList: [] as Array<BaseObj>,
  data: [] as Array<BaseObj>,
  pageInfo: usePageInfo(),
  formShow: false,
  formType: "add" as "add" | "edit",
  formLoading: false

});

const tableColumns = computed(() => {
  const list = props.data.table.columns.filter(item => item.visible);
  return list.map(item => {
    const column = {
      ...item
    };
    // TODO: 判断是否有代码片段并设置对应的函数
    if (column.cellType === "js" && column.jsCode) {
      column.rawContent = function (cellValue, row): string {
        let content = "";
        try {
          const fn = new Function("cellValue", "row", column.jsCode);
          content = fn(cellValue, row);
        } catch (error) {
          console.warn("解析 rawContent 代码错误 >>", error);
          content = "-";
        }
        return content;
      };
    }
    return column;
  });
});

const actionList = computed(() => {
  const list = props.data.table.actions;
  return list.map(item => {
    const newAction = {
      ...item
    };
    if (newAction.key === actionEditKey) {
      newAction.click = openTableForm;
    }
    if (newAction.jsCode) {
      newAction.click = function (row, index) {
        try {
          const fn = new Function("row", "index", newAction.jsCode!);
          fn(row, index);
        } catch (error) {
          console.warn("解析按钮点击代码错误 >>", error);
        }
      };
    }
    return newAction;
  });
});

/**
 * 表格插槽列表
 * - TODO: 由于动态插槽的写法受限，所以要将所有插槽的值给罗列出来在模板上循环渲染
 */
 const tableSlot = computed(() => {
  const head: Array<string> = [];
  const cell: Array<string> = [];
  tableColumns.value.forEach(column => {
    column.slotHead && head.push(column.slotHead);
    column.slot && cell.push(column.slot);
  });
  return {
    head,
    cell
  };
});

const formSetting = computed(() => {
  const info = {
    title: "编辑表单",
    config: (props.data.table.formEdit || {}) as CurdType.Table.From
  };
  if (tableState.formType === "add") {
    info.title = "新增表单";
    info.config = (props.data.table.formAdd || {}) as CurdType.Table.From;
  }
  return info;
});

/**
 * 通过键值获取对应的`column`对象
 * @param prop 注意这里值和插槽名相同
 */
function getColumnByProp(prop: string) {
  const column = props.data.table.columns.find(col => col.prop === prop);
  // console.log("getColumnByProp >>", column, prop);
  return column || ({} as CurdType.Table.Column);
}

const formRef = ref<{
  validate: (callback?: () => void) => void;
  clear: () => void;
}>();

/**
 * 新增 or 编辑表单
 * @param row
 */
function openTableForm(row?: any) {
  if (row) {
    tableState.formType = "edit";
  } else {
    tableState.formType = "add";
  }
  tableState.formShow = true;
  setTimeout(() => formRef.value?.clear());
}

function onCloseForm() {
  tableState.formShow = false;
}

function onSubmitForm() {
  formRef.value?.validate(() => {
    console.log("提交表单");
  });
}

function onSort(key: string, action: CurdType.Table.Column["sort"]) {
  // console.log(key, action);
  const columns = props.data.table.columns;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.sort) {
      if (column.prop === key) {
        column.sort = action;
      } else {
        // 将其他的全部重置掉
        column.sort = true;
      }
    }
  }
  // TODO: 执行请求逻辑
}

async function getTableData() {
  // state.loading = true;
  const list = Array.from({ length: 10 }).map((_, index) => {
    const count = index + 1;
    return {
      id: count,
      gameName: `游戏-${count}`,
      gameType: ranInt(1, 4),
      price: 199.98,
      date: new Date().toLocaleString()
    }
  });
  // console.log(list);
  tableState.pageInfo.total = list.length;
  tableState.data = list;
}

getTableData();

function onTableOption(type: OptionBtn) {
  const selects = tableState.selectList;
  switch (type) {
    case "add":
      openTableForm();
      break;

    case "delete":
      if (!selects.length) return message.error("请选择要删除的列表再进行操作~");
      messageBox({
        title: "操作提示",
        content: `是否删除选中的 ${selects.length} 条数据？`,
        cancelText: "取消",
        confirm() {
          console.log("删除逻辑");
        }
      });
      break;

    case "setting":
      openTableSetting();
      break;

    case "export":
      message.info("开发中~");
      break;
  }
}

function onEditChange(type: EditBtnType) {
  const actionMap = {
    exit: onExit,
    copy: onCopy,
    complete: onComplete
  };
  actionMap[type]();
}

const tableSetting = reactive({
  show: false
});

function openTableSetting() {
  tableSetting.show = true;
}

function onTableSetting(list: Array<CurdType.Table.Column>) {
  props.data.table.columns = list;
}

exportPropToWindow({
  formatDate,
  copyText,
  messageBox,
  message,
});
</script>
<style lang="scss">
@import url("./index.scss");
</style>