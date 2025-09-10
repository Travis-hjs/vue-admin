<template>
  <Curd v-model:data="data" :action="action" :pageId="pageId" />
</template>
<script lang="ts" setup>
import { getTableList, saveForm, setReport } from "@/api/common";
import { Curd, getCurdConfigDefault, type CurdType } from "@/components/Curd";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const pageId = route.name as string;

const data = ref(getCurdConfigDefault());

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
