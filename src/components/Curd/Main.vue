<template>
  <div class="the-curd-main-page">
    <section class="f1">
      <Search :data="props.config.search" @search="onSearch" />
      <template v-if="state.editor.type">
        <el-button @click="onExit()">退出编辑</el-button>
        <el-button type="success" plain @click="onCopy()">复制JSON</el-button>
        <el-button type="primary" @click="onComplete()">完成编辑</el-button>
      </template>
    </section>
    <Editor v-model:show="state.editor.show" :config="props.config" />
    <el-button
      v-if="!state.showEntrance && !state.editor.type"
      class="the-curd-entrance"
      type="primary"
      size="small"
      @click="state.showEntrance = true"
    >
      <i class="el-icon-arrow-left" />
    </el-button>
    <base-dialog v-model="state.showEntrance" title="请选择配置操作" width="400px">
      <div class="the-curd-entrance-item" @click="onEditor('search')">
        <p>配置筛选相关功能</p>
      </div>
      <div class="the-curd-entrance-item" @click="onEditor('table')">
        <p>配置表格相关功能</p>
      </div>
      <template #footer>
        <el-button @click="state.showEntrance = false">关 闭</el-button>
      </template>
    </base-dialog>
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
    type: null,
    action: "add",
    index: -1
  },
  showEntrance: false,
});

provide(provideKey, state);

/** 备份编辑之前的数据 */
let backupsConfig: CurdType.Config;

/**
 * 开始进入编辑模式
 * @param type 
 */
function onEditor(type: typeof state.editor.type) {
  state.editor.type = type;
  state.editor.show = false;
  state.editor.index = -1;
  state.showEntrance = false;
  backupsConfig = JSON.parse(JSON.stringify(props.config));
}

function onSearch(type: FilterBtnType) {
  if (type === "reset") {
    props.config.search.list.forEach(setFieldValue);
  }
}

function onExit() {
  state.editor.index = -1;
  state.editor.show = false;
  state.editor.type = null;
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