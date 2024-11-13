<template>
  <Curd :data="data" :action="action" />
</template>
<script lang="ts" setup>
import { getTableList, saveForm, setReport } from "@/api/common";
import { Curd, type CurdType } from "@/components/Curd";
import { reactive } from "vue";

const data = reactive<CurdType.Config>({
  search: {
    labelRight: false,
    labelWidth: 0,
    list: [],
  },
  table: {
    columns: [],
    actions: [],
    selectKey: null,
    formAdd: null,
    formEdit: null
  }
});

const action: CurdType.Action = {
  getTableData(searchInfo, pageInfo) {
    // console.log("searchInfo >>", searchInfo);
    return getTableList({...searchInfo, ...pageInfo});
  },
  created(getData) {
    // console.log("curd created");
    getData();
  },
  // onAdd(form, current) {
  //   // console.log("onAdd >>", form, current);
  //   return saveForm(current);
  // },
  // onEdit(form, current) {
  //   // console.log("onEdit >>", form, current);
  //   return saveForm(form);
  // },
}

</script>
<style lang="scss"></style>
