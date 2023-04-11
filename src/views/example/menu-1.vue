<template>
  <div class="menu-1">
    <span class="the-tag blue mgb_20">通用表格展示模板页</span>
    <FilterWrap>
      <FilterItem label="选项一">
        <el-select v-model="searchInfo.type" placeholder="请选择" @change="onSearch">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </FilterItem>
      <template #right>
        <el-button type="primary"><i class="el-icon-plus el-icon--left"></i>新增</el-button>
      </template>
    </FilterWrap>

    <base-table
      :columns="tableColumns"
      :data="tableData"
      :actions="btnList"
      :loading="loading"
    ></base-table>

    <base-pagination :disabled="loading" :page-info="pageInfo" @change="getTableData" />

  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { usePageInfo } from "@/hooks";
import { FilterWrap, FilterItem  } from "@/components/FilterBox/index";
import { ranInt, randomText } from "@/utils";

const loading = ref(false);

const pageInfo = reactive(usePageInfo());

const tableData = ref<Array<BaseObj>>([]);

const tableColumns: Array<BaseTableColumn> = [
  { label: "ID", prop: "id", width: 90 },
  { label: "名称", prop: "name", minWidth: 180 },
  { label: "创建时间", prop: "date", width: 180 },
  { label: "操作", prop: "action-right", width: 140 },
];

const btnList: Array<BaseTableOptionItem> = [
  { text: "编辑", icon: "el-icon-edit" },
  { text: "删除", icon: "el-icon-delete", type: "danger", },
];

const options = [
  { label: "选项一", value: 0 },
  { label: "选项二", value: 1 }
];

const searchInfo = reactive({
  type: ""
})

async function getTableData() {
  // loading.value = true;
  // const res = await getData({...pageInfo, ...searchInfo})
  // loading.value = false;
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
  pageInfo.total = testList.length;
}

getTableData();

function onSearch() {
  pageInfo.currentPage = 1;
  getTableData();
}

</script>
<style lang="scss">
.menu-1 {
  width: 100%;
}
</style>