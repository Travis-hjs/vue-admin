<script lang="ts" setup>
import { reactive } from "vue";
import { getPageInfo } from "@/hooks/common";
import { SearchHeader } from "@/components/SearchHeader";
import { type FieldType } from "@/components/Fields";
import { formatDate, randomText } from "@/utils";
import { Table, TableOperationBar, type TableType } from "@/components/Table";
import { message } from "@/utils/message";

type TableRow = {
  id: number;
  name: string;
  date: string;
}

type SearchInfo = {
  keyword: string;
  status: string;
  date: string[];
  start: string;
  end: string;
};

function getSearchInfo(): Partial<SearchInfo> {
  return {}
}

const searchFields: Array<FieldType.Member<SearchInfo>> = [
  {
    label: "查询名称",
    prop: "keyword",
    type: "input",
    placeholder: "请输入查询关键字",
  },
  {
    label: "日期范围",
    prop: "date",
    type: "date",
    dateType: "datetimerange",
    bind: ["start", "end"],
    placeholder: "请选择日期",
    class: "w-[380px]"
  }
];

const tableColumns: Array<TableType.Column<TableRow>> = [
  { title: "名称", prop: "name", minWidth: 180 },
  { title: "日期", prop: "date", width: 180 },
  { title: "操作", prop: "action-right", width: 140 },
];

const tableOperations: Array<TableType.Operation> = [
  {
    text: "新增",
    icon: "el-icon-plus",
    click() {
      message.info(`新增`);
    } 
  }
];

const tableActions: Array<TableType.Action<TableRow>> = [
  {
    text: "编辑",
    icon: "el-icon-edit",
    type: "success",
    click(row) {
      message.success(`编辑: ${row.name}`);
    },
  },
  {
    text: "删除",
    icon: "el-icon-delete",
    type: "danger",
    click(row) {
      message.error(`删除: ${row.name}`);
    },
  },
];

const state = reactive({
  loading: false,
  data: [] as Array<TableRow>,
  selectList: [] as Array<TableRow>,
  pageInfo: getPageInfo(),
  searchFields,
  searchInfo: getSearchInfo(),
  tableColumns,
});

const testList = Array.from({ length: 62 }).map((_, index) => ({
  id: index + 1,
  name: randomText(2, 40),
  date: formatDate()
}));

async function getTableData() {
  // state.loading = true;
  // const res = await getApiTableList({ ...state.pageInfo, ...state.searchInfo })
  // state.loading = false;
  // if (res.code !== 1) return;
  // state.data = res.data.list || [];
  // state.pageInfo.total = res.data.totalCount;
  const size = state.pageInfo.pageSize;
  const page = state.pageInfo.currentPage;
  state.data = testList.slice((page - 1) * size, page * size);
  state.pageInfo.total = testList.length;
}

function onSearch(reset?: boolean) {
  if (reset) {
    state.searchInfo = getSearchInfo();
  }
  state.pageInfo.currentPage = 1;
  getTableData();
}

onSearch();
</script>
<template>
  <div class="the-common-table-page">
    <SearchHeader
      :search-info="state.searchInfo"
      :list="state.searchFields"
      :loading="state.loading"
      @search="onSearch"
    />

    <TableOperationBar
      v-model:columns="state.tableColumns"
      :operations="tableOperations"
      :loading="state.loading"
    />

    <Table
      class="f1"
      select-key="id"
      v-model:select-list="state.selectList"
      :columns="state.tableColumns"
      :data="state.data"
      :actions="tableActions"
      :page-info="state.pageInfo"
      :loading="state.loading"
      @page="getTableData"
    />
  </div>
</template>
