<script lang="ts">
/** 增删改查低代码组件 */
export default {
  name: "Curd"
}
</script>
<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref, type PropType } from "vue";
import Search from "./Search.vue";
import TableHeader from "./TableHeader.vue";
import TableOperation from "./TableOperation.vue";
import TableForm from "./TableForm.vue";
import { FooterBtn, TableImage } from "./part";
import type { CurdConfig, CurdType, GetDataParams, TableOperationType } from "./types";
import { actionEditKey, convertPx, exportPropToWindow, getFieldValue, getFormConfig, initFieldValue } from "./data";
import { message, messageBox } from "@/utils/message";
import { getPageInfo } from "@/hooks/common";
import { copyText, formatDate, isType, jsonToPath } from "@/utils";
import { setElementShake } from "@/utils/dom";
import request from "@/utils/request";
import { openCurdConfig } from "./hooks";
import { Table } from "@/components/Table";

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

const tableConfig = computed(() => props.data.table);

const tableColumns = computed(() => {
  const list = tableConfig.value.columns.filter(item => item.visible);
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
  const list = tableConfig.value.actions;
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
    // if (isType(newAction.formConfig, "object")) {
    //   newAction.click = function (row) {
    //     openForm(row, newAction.formConfig);
    //   };
    // }
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

/**
 * 通过键值获取对应的`column`对象
 * @param prop 注意这里值和插槽名相同
 */
function getColumnByProp(prop: string) {
  const column = tableConfig.value.columns.find(col => col.prop === prop);
  // console.log("getColumnByProp >>", column, prop);
  return column || ({} as CurdType.Table.Column);
}

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
  const config = tableConfig.value;
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

function onCloseForm() {
  formSate.show = false;
  formRef.value?.reset();
  tableRow = null;
}

function onSubmitForm() {
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
      onCloseForm();
      getData();
    }
    // const code = formSate.config.submitCode;
    // const name = formSate.config.title ? `【${formSate.config.title}】` : "";
    // if (!code) return message.error(`未找到对应的${name}提交代码！`);
    // try {
    //   const fn = new Function("formData", "current", code);
    //   fn(formData, current);
    // } catch (error) {
    //   console.warn("表单提交代码出错 >>", error);
    // }
  });
}

/**
 * 检测并校验搜索数据
 * @param params 
 */
function getSearchInfo(params?: GetDataParams) {
  const searchList = props.data.search.list;
  const searchInfo: BaseObj<any> = {};
  // 处理搜索字段并进行赋值 
  for (let i = 0; i < searchList.length; i++) {
    const field = searchList[i];
    const res = getFieldValue(field);
    if (field.required && isType(res.result, "string")) {
      setElementShake(document.querySelector(`.${field.id}`));
      message.error(res.result);
      // 还原分页器操作之前的数据
      if (params && params.key === "page") {
        tableState.pageInfo = params.before;
      }
      return null;
    }
    // TODO: 只设置有值的情况
    if (res.result === true) {
      searchInfo[field.key] = res.value;
    }
    // TODO: 看情况可以使用这种方式，将所有的值都往外传，不管是否通过检验的值
    // searchInfo[field.key] = res.value;
  }
  // 处理排序字段
  const columns = tableConfig.value.columns;
  const ascList: Array<string> = [];
  const descList: Array<string> = [];
  if (params && params.key === "sort") {
    columns.forEach(column => {
      if (column.sort) {
        if (column.prop === params.prop) {
          column.sort = params.action;
        } else {
          // 将其他的全部重置掉
          column.sort = true;
        }
      }
      column.sort === "asc" && ascList.push(column.prop);
      column.sort === "desc" && descList.push(column.prop);
    });
  } else {
    columns.forEach(column => {
      column.sort === "asc" && ascList.push(column.prop);
      column.sort === "desc" && descList.push(column.prop);
    });
  }
  if (ascList.length) {
    searchInfo.asc = ascList.toString();
  }
  if (descList.length) {
    searchInfo.desc = descList.toString();
  }
  return searchInfo;
}

/**
 * 获取表格数据
 * @param params 
 */
async function getData(params?: GetDataParams) {
  const searchInfo = getSearchInfo(params);
  if (!searchInfo) return;
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

function onTableOperation(type: TableOperationType) {
  const selects = tableState.selectList;
  switch (type) {
    case "add":
      openForm();
      break;

    case "delete":
      if (!selects.length) return message.warning("请选择要删除的列表再进行操作~");
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
            message.info("请设置 action.onDelete 删除逻辑");
          }
        }
      });
      break;

    case "export":
      if (props.action.onExport) {
        props.action.onExport();
      } else {
        message.info("请设置 action.onExport 导出逻辑");
      }
      break;
  }
}

function setLoading(val: boolean) {
  state.loading = val;
}

exportPropToWindow({
  formatDate,
  copyText,
  messageBox,
  message,
  jsonToPath,
  request,
  getData,
  setLoading,
});

onMounted(function() {
  if (props.action.created && tableConfig.value.columns.length) {
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
    <template v-if="tableConfig.columns.length > 0">
      <TableOperation
        :config="tableConfig"
        :disabled="state.loading"
        @action="onTableOperation"
      />
      <Table
        class="f1"
        v-model:select-list="tableState.selectList"
        :data="tableState.data"
        :columns="tableColumns"
        :actions="actionList"
        :action-max="tableConfig.actionMax"
        :loading="state.loading"
        :select-key="tableConfig.selectKey!"
        :page-info="tableState.pageInfo"
        @page="info => getData({ key: 'page', ...info })"
      >
        <template v-for="head in tableSlot.head" :key="head" v-slot:[head]="{ $index }">
          <TableHeader
            :column="tableColumns[tableConfig.selectKey ? $index - 1 : $index]"
            @sort="(prop, action) => getData({ key: 'sort', prop, action })"
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
      @close="onCloseForm"
      @after-end="onSetForm"
    >
      <TableForm ref="formRef" :disabled="formSate.loading" />
      <template #footer>
        <FooterBtn
          :loading="formSate.loading"
          @close="onCloseForm()"
          @submit="onSubmitForm()"
        />
      </template>
    </base-dialog>
  </div>
</template>
<style lang="scss">
@import url("./styles/index.scss");
</style>