<script lang="ts">
/** 增删改查低代码组件 */
export default {
  name: "Curd"
}
</script>
<script lang="ts" setup>
import type { CurdConfig, CurdType, TableOperationAction } from "./types";
import { computed, onMounted, reactive, ref, type PropType } from "vue";
import Search from "./Search.vue";
import TableOperation from "./TableOperation.vue";
import TableForm from "./TableForm.vue";
import { FooterBtn, TableImage, type TableImageProps } from "./part";
import { actionEditKey, convertPx, exportPropToWindow, getFieldValue, getFormConfig, initFieldValue } from "./data";
import { message, messageBox } from "@/utils/message";
import { getCountId, getPageInfo } from "@/hooks/common";
import { copyText, downloadFile, formatDate, isType, jsonToHtml, jsonToPath } from "@/utils";
import { setElementShake } from "@/utils/dom";
import request from "@/utils/request";
import { openCurdConfig } from "./hooks";
import { Table } from "@/components/Table";
import { onUploadFile } from "@/components/Upload";

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
  },
  /** 页面标识 */
  pageId: {
    type: String,
    required: true
  }
});

const emit = defineEmits<{
  (event: "update:data", value: typeof props.data): void;
}>();

const state = reactive({
  loading: false,
});

function openConfig(type?: CurdConfig.Type) {
  openCurdConfig({
    title: "低代码配置",
    config: props.data,
    pageId: props.pageId,
    type: type,
    callback(newConfig) {
      // console.log("保存的新配置 >>", newConfig);
      emit("update:data", newConfig);
    },
  });
}

function onSearch(reset: boolean) {
  if (reset) {
    props.data.search.list.forEach(initFieldValue);
  }
  tableState.pageInfo.currentPage = 1;
  tableState.selectList = []; // TODO: 搜索的时候情况选中
  getData();
}

const tableState = reactive({
  selectList: [] as Array<BaseObj>,
  data: [] as Array<BaseObj>,
  pageInfo: getPageInfo(),
});

/**
 * 通过键值获取对应的`column`对象
 * @param prop 注意这里值和插槽名相同
 */
function getColumnByProp(prop: string) {
  const column = props.data.table.columns.find(col => col.prop === prop);
  return column || ({} as CurdType.Table.Column);
}

/**
 * 渲染表格`js`代码
 * @param cellValue 
 * @param row 
 */
function renderTableCell(row: BaseObj<any>, key: string) {
  let content = "-";
  const column = getColumnByProp(key);
  if (!column.jsCode) {
    return content;
  }
  try {
    const fn = new Function("cellValue", "row", column.jsCode);
    content = fn(row[key], row);
  } catch (error) {
    console.warn("解析 rawContent 代码错误 >>", error);
  }
  return content;
}

function getTableImageProps(row: any, key: string): TableImageProps {
  const prefix = `preview-image-`;
  const prop = key.replace(prefix, "");
  const list: Array<string> = [];
  tableSlot.value.forEach(slot => {
    if (slot.includes(prefix)) {
      list.push(row[slot.replace(prefix, "")]);
    }
  });
  return {
    column: getColumnByProp(prop),
    src: row[prop],
    previewList: list,
  }
}

const actionList = computed(() => {
  const list = props.data.table.actions;
  return list.map(item => {
    const newAction = {
      ...item
    };
    // 处理内部编辑功能
    if (newAction.key === actionEditKey) {
      newAction.click = function (row) {
        openForm(row);
      }
    }
    // 其他按钮配置的表单处理
    if (isType(newAction.formConfig, "object")) {
      newAction.click = function (row) {
        openForm(row, newAction.formConfig);
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
  const cell: Array<string> = [];
  props.data.table.columns.forEach(column => {
    column.slot && cell.push(column.slot);
  });
  return cell;
});

const formRef = ref<InstanceType<typeof TableForm>>();

const formSate = reactive({
  type: "add" as "add" | "edit" | "other",
  /** 表单加载状态 */
  loading: false,
  /** 是否打开表单 */
  show: false,
  /** 表单配置 */
  config: getFormConfig(),
});

/**
 * 设置表单数据
 * - 为什么需要单独抽离这个方法？因为`<el-select>`多选回显有问题，所以这里用过渡结束来控制
 */
let onSetForm = function () {};

/** 点击操作的表格数据，不需要为响应式 */
let tableRow = null as null | BaseObj<any>;

/**
 * 新增 or 编辑表单
 * @param row
 * @param other 其他传入的表单
 */
function openForm(row?: any, other?: CurdType.Table.From) {
  tableRow = row ? JSON.parse(JSON.stringify(row)) : {};
  const config = props.data.table;
  const add = config.formAdd || getFormConfig();
  const edit = config.formEdit || getFormConfig();
  if (isType(other, "object")) {
    formSate.config = other;
    formSate.type = "other";
  } else {
    formSate.type = !!row ? "edit" : "add";
    // 正常新增编辑逻辑
    formSate.config = JSON.parse(JSON.stringify(row ? edit : add));
  }
  // const openCode = formSate.config.openCode;
  // if (typeof openCode === "string") {
  //   try {
  //     const fn = new Function("row", openCode);
  //     fn(tableRow);
  //   } catch (error) {
  //     console.warn("解析打开表单前执行代码错误 >>", error);
  //   }
  // }
  formSate.show = true;
  formRef.value?.update(formSate.config);

  if (JSON.stringify(tableRow) !== "{}" && formRef.value) {
    onSetForm = function () {
      formRef.value?.setFormData(tableRow!);
    };
  } else {
    onSetForm = function () {
      // console.log("新增表单 >>");
    };
  }
}

function closeForm() {
  formRef.value?.reset();
  formSate.show = false;
  tableRow = null;
  batchData.selects = batchData.list = [];
}

function submitForm() {
  formRef.value?.validate(async (formData, current) => {
    let fn: typeof props.action.onAdd;
    if (formSate.type === "add" && props.action.onAdd) {
      fn = props.action.onAdd;
    }
    if (formSate.type === "edit" && props.action.onEdit) {
      fn = props.action.onEdit;
    }
    if (fn) {
      formSate.loading = true;
      const res = await fn(formData, current);
      formSate.loading = false;
      if (res.code !== 1) return;
      closeForm();
      getData();
    } else {
      const code = formSate.config.submitCode;
      const name = formSate.config.title ? `【${formSate.config.title}】` : "表单";
      if (!code) return message.error(`未找到对应的${name}提交代码！`);
      try {
        const fn = new Function("formData", "current", "other", code);
        fn(formData, current, batchData);
      } catch (error) {
        console.warn("表单提交代码出错 >>", error);
      }
    }
  });
}

/** 检测并校验搜索数据 */
function getSearchInfo() {
  const searchList = props.data.search.list;
  const searchInfo: BaseObj<any> = {};
  // 处理搜索字段并进行赋值 
  for (let i = 0; i < searchList.length; i++) {
    const field = searchList[i];
    const res = getFieldValue(field);
    if (field.required && isType(res.result, "string")) {
      setElementShake(document.querySelector(`.${field.id}`));
      message.error(res.result);
      return null;
    }
    // TODO: 只设置有值的情况
    if (res.result === true) {
      searchInfo[field.key] = res.value;
    }
    // TODO: 看情况可以使用这种方式，将所有的值都往外传，不管是否通过检验的值
    // searchInfo[field.key] = res.value;
  }
  return searchInfo;
}

/** 获取表格数据 */
async function getData() {
  const searchInfo = getSearchInfo();
  if (!searchInfo) return;
  // console.log("searchInfo >>", searchInfo);
  // 处理自定义查询校验代码
  const code = props.data.search.validateCode;
  if (code) {
    const fn = new Function("params", code);
    const result = fn(searchInfo);
    if (result === false) {
      return;
    }
  }
  // 最后请求列表并把参数传入到外部声明方法中
  const page = JSON.parse(JSON.stringify(tableState.pageInfo));
  state.loading = true;
  const res = await props.action.getTableData(searchInfo, page);
  state.loading = false;
  if (res.code === 1) {
    // console.log("getData >>", res);
    tableState.pageInfo.total = res.data.total;
    tableState.data = res.data.list || [];
  }
}

const batchData = {
  /** 当前选中完整数据 */
  selects: [] as Array<BaseObj>,
  /** 当前选中键值列表 */
  list: [] as Array<number | string>
};

/**
 * 表格操作栏
 * @param type 操作类型
 * @param val 自定义代码或者表单配置
 */
function onTableOperation(type: TableOperationAction, val?: CurdType.Table.Batch["click"] | CurdType.Table.From) {
  switch (type) {
    case "add":
      openForm();
      break;
    
    case "batch":
      batchData.selects = JSON.parse(JSON.stringify(tableState.selectList));
      if (!batchData.selects.length) return message.warning("请选择要操作的列！");
      if (!val) return message.error("当前按钮未配置动态代码或表单配置！");
      batchData.list = batchData.selects.map(item => item[props.data.table.selectKey!]);
      // TODO: 走表单逻辑
      if (isType<CurdType.Table.From>(val, "object")) {
        openForm(undefined, val);
        return;
      }
      if (isType(val, "function")) {
        val(batchData.list, batchData.selects);
        return;
      }
      try {
        const fn = new Function("list", "selectList", val);
        fn(batchData.list, batchData.selects);
      } catch (error) {
        console.warn("批量操作代码出错 >>", error);
      }
      break;

    case "open-form":
      openForm(undefined, val as CurdType.Table.From);
      break;
  }
}

/**
 * 表格自定义方法对象
 * - TODO: 非常重要！！！，在表格列用原生实现自定义方法点击时使用
 * @example
 * ```js
 * const pageId = "demo-page";
 * const page = window[`_${pageId}`];
 * 
 * function onCell() {
 *   console.log("表格点击 >>", row);
 *   page.openForm();
 * }
 * page.cellFn[row.id] = onCell;
 * return `<button class="the-tag" onclick="window['_${pageId}'].cellFn['${row.id}']()">打开表格</button>`;
 * ```
 */
const cellFn = {};

/**
 * 设置页面加载状态
 * @param val 
 */
function setLoading(val: boolean) {
  state.loading = val;
}

/**
 * 设置表单加载状态
 * @param val 
 */
function setFormLoading(val: boolean) {
  formSate.loading = val;
}

/** 获取当前查询参数 */
function getSearchParams() {
  const info: BaseObj<any> = {};
  const emptyList: Array<any> = [undefined, null, ""];
  props.data.search.list.forEach(item => {
    const value = item.value;
    if (!emptyList.includes(value)) {
      info[item.key] = value;
    }
  });
  return info;
}

exportPropToWindow({
  formatDate,
  copyText,
  messageBox,
  message,
  jsonToPath,
  request,
  onUploadFile,
  downloadFile,
  getCountId,
  jsonToHtml,
  // TODO: 类似沙盒一样的全局方法隔离操作
  [props.pageId]: {
    onSearch,
    getData,
    setLoading,
    setFormLoading,
    openForm,
    closeForm,
    cellFn,
    getSearchParams,
  },
});

onMounted(function() {
  if (props.action.created && props.data.table.columns.length) {
    props.action.created(getData);
  }
});
</script>
<template>
  <div class="the-curd-main-page">
    <Search
      v-if="props.data.search.list.length"
      :search="props.data.search"
      :loading="state.loading"
      @search="onSearch"
    />
    <template v-if="props.data.table.columns.length > 0">
      <TableOperation
        :config="props.data.table"
        :disabled="state.loading"
        @action="onTableOperation"
      />
      <Table
        class="f1"
        v-model:select-list="tableState.selectList"
        :data="tableState.data"
        :columns="props.data.table.columns"
        :actions="actionList"
        :action-max="props.data.table.actionMax"
        :loading="state.loading"
        :select-key="props.data.table.selectKey!"
        :page-info="tableState.pageInfo"
        @page="getData()"
        @sort="getData()"
      >
        <template v-for="cell in tableSlot" :key="cell" v-slot:[cell]="{ row }">
          <TableImage
            v-if="cell.includes('preview-image-')"
            v-bind="getTableImageProps(row, cell)"
          />
          <div
            v-if="cell.includes('render-cell-')"
            v-html="renderTableCell(row, cell.replace('render-cell-', ''))"
          ></div>
        </template>
      </Table>
    </template>

    <el-empty v-else description="当前页面没有表格配置数据，请配置后再操作~">
      <el-button type="primary" @click="openConfig('table')">去配置</el-button>
    </el-empty>

    <el-button
      class="the-curd-entrance"
      type="primary"
      size="small"
      @click="openConfig()"
    >
      <i class="el-icon-arrow-left" />
    </el-button>

    <base-dialog
      v-model:show="formSate.show"
      :title="formSate.config.title"
      :width="convertPx(formSate.config.width)"
      @close="closeForm"
      @opened="onSetForm"
    >
      <TableForm ref="formRef" :disabled="formSate.loading" />
      <template #footer>
        <FooterBtn
          :loading="formSate.loading"
          @close="closeForm"
          @submit="submitForm"
        />
      </template>
    </base-dialog>
  </div>
</template>
<style lang="scss">
@import url("./styles/index.scss");
</style>