<template>
  <div class="menu-1">
    <span class="the-tag blue mgb-20">通用表格展示模板页</span>
    <FilterWrap>
      <FilterItem>
        <el-input placeholder="请输入关键字">
          <template #suffix>
            <i class="el-icon-search"></i>
          </template>
        </el-input>
      </FilterItem>
      <FilterItem label="选项一">
        <el-select class="short-value" v-model="state.searchInfo.type" placeholder="请选择" @change="onSearch">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </FilterItem>
      <FilterItem label="日期">
        <el-date-picker v-model="state.searchInfo.date" type="datetime" placeholder="请选择日期" @change="onSearch" />
      </FilterItem>
      <template #right>
        <el-button type="primary"><i class="el-icon-plus el-icon--left"></i>新增</el-button>
      </template>
    </FilterWrap>

    <base-table
      :columns="tableColumns"
      :data="state.data"
      :actions="tableActions"
      :loading="state.loading"
      select-key="id"
      v-model:select-list="state.selectList"
      :select-disabled="(row) => (row.id % 4) === 0"
    >
      <template #fuck="{ row, $index }">
        {{ $index + 1 }}、{{ row.name }}
      </template>
    </base-table>

    <div class="f-vertical">
      <div style="width: 200px;" v-if="state.selectList.length > 0">
        <span class="the-tag blue">已选择：{{ state.selectList.length }} 条数据</span>
      </div>
      <base-pagination :disabled="state.loading" :page-info="state.pageInfo" @change="getTableData" />
    </div>

  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { getPageInfo } from "@/hooks/common";
import { FilterWrap, FilterItem  } from "@/components/FilterBox";
import { formatDate, randomText } from "@/utils";
import { message, messageBox } from "@/utils/message";

interface TableRow {
  id: number
  name: string
  date: string
}

const state = reactive({
  loading: false,
  searchInfo: {
    type: "",
    date: ''
  },
  pageInfo: getPageInfo(),
  data: [] as Array<TableRow>,
  selectList: [] as Array<TableRow>,
});

const tableColumns: Array<BaseTableColumn<TableRow>> = [
  { title: "ID", prop: "id", width: 90 },
  { title: "名称", prop: "name", minWidth: 180, slot: "fuck" },
  { title: "创建时间", prop: "date", width: 180 },
  { title: "操作", prop: "action-right", width: 200 },
];

const tableActions: Array<BaseTableAction<TableRow>> = [
  { text: "编辑", icon: "el-icon-edit" },
  {
    text: "删除",
    icon: "el-icon-delete",
    type: "danger",
    click(row) {
      messageBox({
        content: `是否删除【${row.name}】？`,
        cancelText: "取消",
        confirm() {
          message.info("选择了删除操作~");
        },
      })
    },
  },
  { text: "终止", icon: "el-icon-video-pause", click: (row) => message.error(`【${row.name}】已终止`) },
  { text: "启用", icon: "el-icon-video-play", click: (row) => message.success(`【${row.name}】已启用`) },
  { text: "下架", icon: "el-icon-folder-delete", click: (row) => message.warning(`【${row.name}】已下架`) },
];

const options = [
  { label: "选项一", value: 0 },
  { label: "选项二", value: 1 }
];

const testList = Array.from({ length: 62 }).map((_, index) => ({
  id: index + 1,
  name: randomText(2, 40),
  date: formatDate()
}));

function getTableData() {
  // state.loading = true;
  // const res = await getData({...state.pageInfo, ...state.searchInfo})
  // state.loading = false;
  // if (res.code === 1) {
  //   tableData.value = res.data.list || [];
  //   pageInfo.total = res.data.totalCount;
  // }
  const size = state.pageInfo.pageSize;
  const page = state.pageInfo.currentPage;
  state.data = testList.slice((page - 1) * size, page * size);
  state.pageInfo.total = testList.length;
}

getTableData();

function onSearch() {
  state.pageInfo.currentPage = 1;
  state.selectList = []
  getTableData();
}

</script>
<style lang="scss">
.menu-1 {
  width: 100%;
}
</style>