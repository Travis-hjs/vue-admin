<template>
  <div class="the-curd-main-page">
    <section class="f1">
      <Search :data="props.config.search" @search="onSearch" />
      <template v-if="state.editor.type">
        <el-button @click="onExit()">退出编辑</el-button>
        <el-button type="success" @click="onCopy()">复制JSON</el-button>
        <el-button type="primary" @click="onComplete()">完成编辑</el-button>
      </template>
    </section>
    <Editor v-model:show="state.editor.show" :config="props.config" />
  </div>
</template>
<script lang="ts" setup>
import { provide, reactive, type PropType } from "vue";
import { provideKey, setFieldValue, type CurdType } from "./index";
import Search from "./Search.vue";
import type { FilterBtnType } from "../FilterBox";
import Editor from "./Editor.vue";
import { copyText } from "@/utils";
import { message } from "@/utils/message";

const props = defineProps({
  config: {
    type: Object as PropType<CurdType.Config>,
    required: true
  }
});

const state = reactive<CurdType.State>({
  loading: false,
  editor: {
    show: false,
    type: "search",
    action: "add",
    index: -1
  },
  showOperate: false,
});

provide(provideKey, state);

function onSearch(type: FilterBtnType) {
  if (type === "reset") {
    props.config.search.list.forEach(setFieldValue);
  }
}

function onExit() {
  state.editor.index = -1;
  state.editor.show = false;
  state.editor.type = "";
}

function onComplete() {
  onExit();
}

function onCopy() {
  copyText(JSON.stringify(props.config), () => message.success("复制成功！"));
}

</script>
<style lang="scss">
@import url("./index.scss");
</style>