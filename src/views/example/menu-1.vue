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
      :data="tableData"
      :actions="btnList"
      :loading="state.loading"
    >
      <template #fuck="{ row, $index }">
        {{ $index + 1 }}、{{ row.name }}
      </template>
    </base-table>

    <base-pagination :disabled="state.loading" :page-info="state.pageInfo" @change="getTableData" />

  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { usePageInfo } from "@/hooks";
import { FilterWrap, FilterItem  } from "@/components/FilterBox/index";
import { ranInt, randomText } from "@/utils";
import { message, messageBox } from "@/utils/message";

const state = reactive({
  loading: false,
  searchInfo: {
    type: "",
    date: []
  },
  pageInfo: usePageInfo()
});

interface TableRow {
  id: number
  name: string
  date: string
}

const tableData = ref<Array<TableRow>>([]);

const tableColumns: Array<BaseTableColumn> = [
  { label: "ID", prop: "id", width: 90 },
  { label: "名称", prop: "name", minWidth: 180, slotName: "fuck" },
  { label: "创建时间", prop: "date", width: 180 },
  { label: "操作", prop: "action-right", width: 200 },
];

const btnList: Array<BaseTableOptionItem<TableRow>> = [
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
  { text: "终止", icon: "el-icon-video-pause" },
  { text: "启用", icon: "el-icon-video-play" },
  { text: "下架", icon: "el-icon-folder-delete" },
];

const options = [
  { label: "选项一", value: 0 },
  { label: "选项二", value: 1 }
];

async function getTableData() {
  // state.loading = true;
  // const res = await getData({...state.pageInfo, ...state.searchInfo})
  // state.loading = false;
  // if (res.code === 1) {
  //   tableData.value = res.data.list || [];
  //   pageInfo.total = res.data.totalCount;
  // }
  const testList = new Array(10).fill(0).map((_, index) => ({
    id: ranInt(1, 100),
    name: randomText(2, 40),
    date: new Date().toLocaleString()
  }));
  tableData.value = testList;
  state.pageInfo.total = testList.length;
}

getTableData();

function onSearch() {
  state.pageInfo.currentPage = 1;
  getTableData();
}

</script>
<style lang="scss">
.menu-1 {
  width: 100%;
}
</style>