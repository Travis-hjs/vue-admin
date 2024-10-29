<template>
  <Curd :data="data" :action="action" />
</template>
<script lang="ts" setup>
import { getTableList } from "@/api/common";
import { Curd, getTestData, type CurdType } from "@/components/Curd";
import { ref, reactive } from "vue";

const data = reactive(getTestData());

const action: CurdType.Action = {
  getTableData(searchInfo, pageInfo) {
    return getTableList({...searchInfo, pageInfo});
  },
  created(getData) {
    // console.log("curd created");
    getData();
  },
}

</script>
<style lang="scss"></style>
