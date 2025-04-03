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
import { actionEditKey, convertPx, exportPropToWindow, getFieldValue, initFieldValue } from "./data";
import { message, messageBox } from "@/utils/message";
import { getPageInfo } from "@/hooks/common";
import { copyText, formatDate, isType, jsonToPath } from "@/utils";
import { setElementShake } from "@/utils/dom";
import request from "@/utils/request";
import { openCurdConfig } from "./hooks";

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
  formShow: false,
  formType: "add" as "add" | "edit",
  formLoading: false
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
      newAction.click = openTableForm;
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

const formInfo = computed(() => {
  const config = tableConfig.value;
  const info = {
    title: "编辑表单",
    config: (config.formEdit || {}) as CurdType.Table.From
  }
  if (tableState.formType === "add") {
    info.title = "新增表单";
    info.config = (config.formAdd || {}) as CurdType.Table.From;
  }
  return info;
});

/** 点击操作的表格数据，不需要为响应式 */
let tableRow = null as null | BaseObj<any>;

/**
 * 新增 or 编辑表单
 * @param row
 */
function openTableForm(row?: any) {
  if (row) {
    tableState.formType = "edit";
    tableRow = row;
  } else {
    tableState.formType = "add";
  }
  tableState.formShow = true;
  // <el-form> 验证 bug ，nextTick 有时候会不生效
  setTimeout(() => formRef.value?.clear());
  // TODO: 为什么需要在 nextTick 设置表单数据？因为`<Field />`组件中会在初始化时设置默认值，
  // 如果在这之前就设置值的话，会导致被覆盖不生效的情况。
  nextTick(() => tableRow && formRef.value?.setFormData(tableRow));
}

function onCloseForm() {
  tableState.formShow = false;
  formRef.value?.reset();
  tableRow = null;
}

function onSubmitForm() {
  formRef.value?.validate(async (formData, current) => {
    // console.log("提交表单 >>", formData, current);
    if (tableState.formType === "add" && props.action.onAdd) {
      tableState.formLoading = true;
      const res = await props.action.onAdd(formData, current);
      tableState.formLoading = false;
      if (res.code !== 1) return;
      onCloseForm();
      getData();
    }
    if (tableState.formType === "edit" && props.action.onEdit) {
      tableState.formLoading = true;
      const res = await props.action.onEdit(formData, current);
      tableState.formLoading = false;
      if (res.code !== 1) return;
      onCloseForm();
      getData();
    }
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
      openTableForm();
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
      >
        <template #left>
          <span v-if="tableConfig.selectKey" class="the-tag blue">
            已选择 {{ tableState.selectList.length }} 条数据
          </span>
        </template>
      </TableOperation>
      <base-table
        class="f1"
        v-model:select-list="tableState.selectList"
        :data="tableState.data"
        :columns="tableColumns"
        :actions="actionList"
        :actionMax="tableConfig.actionMax"
        :loading="state.loading"
        :select-key="tableConfig.selectKey!"
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
      </base-table>
      <base-pagination
        :disabled="state.loading"
        :pageInfo="tableState.pageInfo"
        @change="info => getData({ key: 'page', ...info })"
      />
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
      v-model:show="tableState.formShow"
      :title="formInfo.title"
      :width="convertPx(formInfo.config.width)"
      @close="onCloseForm()"
    >
      <TableForm
        ref="formRef"
        :config="formInfo.config"
        :type="tableState.formType"
        :disabled="tableState.formLoading"
      />
      <template #footer>
        <FooterBtn :loading="tableState.formLoading" @close="onCloseForm()" @submit="onSubmitForm()" />
      </template>
    </base-dialog>
  </div>
</template>
<style lang="scss">
@import url("./styles/index.scss");
</style>