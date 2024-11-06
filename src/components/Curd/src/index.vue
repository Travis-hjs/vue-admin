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
            <TableOption :config="props.data.table" :disabled="state.loading" @action="onTableOption" />
          </div>
          <base-table
            v-model:select-list="tableState.selectList"
            :data="tableState.data"
            :columns="tableColumns"
            :actions="actionList"
            :loading="state.loading"
            :select-key="props.data.table.selectKey!"
          >
            <template v-for="head in tableSlot.head" :key="head" v-slot:[head]="{ $index }">
              <TableHeader
                :column="tableColumns[props.data.table.selectKey ? $index - 1 : $index]"
                @sort="onSort"
              />
            </template>
            <template v-for="cell in tableSlot.cell" :key="cell" v-slot:[cell]="{ row }">
              <!-- TODO: 因为插槽中只有图片这个功能，所以不需要做条件判断 -->
              <TableImage
                :column="getColumnByProp(cell)"
                :src="(row[cell] as string)"
                :previewList="(tableSlot.cell.map(k => row[k]) as Array<string>)"
              />
            </template>
          </base-table>
          <base-pagination :disabled="state.loading" :pageInfo="tableState.pageInfo" @change="getData" />
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
      :width="convertPx(formSetting.config.width)"
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
    <base-dialog v-model="state.showEntrance" title="请选择配置操作" width="600px">
      <div class="the-curd-entrance-item" @click="onEditor('search')">
        <p class="mgb-10">配置筛选相关功能</p>
        <ThumbnailSearch />
      </div>
      <div class="the-curd-entrance-item" @click="onEditor('table')">
        <p>配置表格相关功能</p>
        <ThumbnailTable />
      </div>
      <template #footer>
        <el-button @click="state.showEntrance = false">关 闭</el-button>
      </template>
    </base-dialog>
  </div>
</template>
<script lang="ts">
/** 增删改查低代码组件 */
export default {
  name: "Curd"
}
</script>
<script lang="ts" setup>
import { computed, onMounted, provide, reactive, ref, type PropType } from "vue";
import Search from "./Search.vue";
import TableModel from "./TableModel.vue";
import Editor from "./Editor.vue";
import TableHeader from "./TableHeader.vue";
import TableSetting from "./TableSetting.vue";
import TableForm from "./TableForm.vue";
import { EditBtn, FooterBtn, TableImage, TableOption, ThumbnailSearch, ThumbnailTable } from "./part";
import type { CurdType, EditBtnType, TableOptionType } from "./types";
import type { FilterBtnType } from "@/components/FilterBox";
import { actionEditKey, convertPx, exportPropToWindow, getFieldValue, provideKey, setFieldValue } from "./data";
import { message, messageBox } from "@/utils/message";
import { usePageInfo } from "@/hooks/common";
import { copyText, formatDate, isType } from "@/utils";
import { setElementShake } from "@/utils/dom";

const props = defineProps({
  /** 是配置，同时也是响应数据 */
  data: {
    type: Object as PropType<CurdType.Config>,
    required: true
  },
  /** 操作对象 */
  action: {
    type: Object as PropType<CurdType.Action>,
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
  tableState.pageInfo.currentPage = 1;
  tableState.selectList = []; // TODO: 搜索的时候情况选中
  getData();
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

const formRef = ref<InstanceType<typeof TableForm>>();

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
  getData();
}

async function getData() {
  const searchList = props.data.search.list;
  const searchInfo: BaseObj<any> = {};
  // 处理搜索字段并进行赋值 
  for (let i = 0; i < searchList.length; i++) {
    const field = searchList[i];
    const res = getFieldValue(field);
    if (field.required && isType(res.result, "string")) {
      setElementShake(document.querySelector(`.${field.id}`));
      message.error(res.result);
      return;
    }
    // TODO: 只设置有值的情况
    if (res.result === true) {
      searchInfo[field.key] = res.value;
    }
    // TODO: 看情况可以使用这种方式，将所有的值都往外传，不管是否通过检验的值
    // searchInfo[field.key] = res.value;
  }
  // 处理排序字段
  const columns = props.data.table.columns;
  const ascList: Array<string> = [];
  const descList: Array<string> = [];
  columns.forEach(item => {
    if (item.sort === "asc") {
      ascList.push(item.prop);
    }
    if (item.sort === "desc") {
      descList.push(item.prop);
    }
  });
  if (ascList.length) {
    searchInfo.asc = ascList.toString();
  }
  if (descList.length) {
    searchInfo.desc = descList.toString();
  }
  const page = JSON.parse(JSON.stringify(tableState.pageInfo));
  // 最后请求列表并把参数传入到外部声明方法中
  state.loading = true;
  const res = await props.action.getTableData(searchInfo, page);
  state.loading = false;
  if (res.code === 1) {
    // console.log("getData >>", res);
    tableState.pageInfo.total = res.data.total;
    tableState.data = res.data.list || [];
  }
}

function onTableOption(type: TableOptionType) {
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
        async confirm() {
          if (props.action.onDelete) {
            state.loading = true;
            const res = await props.action.onDelete(JSON.parse(JSON.stringify(tableState.selectList)));
            if (res.code === 1) {
              message.success("删除成功！");
              tableState.selectList = [];
              getData();
            } else {
              state.loading = false;
            }
          } else {
            console.log("请设置 action.onDelete 删除逻辑");
          }
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

onMounted(function() {
  props.action.created && props.action.created(getData);
});
</script>
<style lang="scss">
@import url("./index.scss");
</style>