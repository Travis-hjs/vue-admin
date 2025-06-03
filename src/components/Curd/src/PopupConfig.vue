<script lang="ts">
/** `curd`配置弹出层组件 */
export default {
  name: "CurdPopupConfig"
};
</script>
<script lang="ts" setup>
import { useZIndex } from "@/hooks/common";
import { curdConfigState } from "./hooks";
import { computed, reactive } from "vue";
import type { CurdType } from "./types";
import { copyText } from "@/utils";
import { message } from "@/utils/message";
import { getCurdConfigEditor } from "./data";
import Search from "./Search.vue";
import TableModel from "./TableModel.vue";
import Editor from "./Editor.vue";

const currentZIndex = useZIndex();

const tabList = [
  { label: "筛选部分", value: "search" },
  { label: "表格部分", value: "table" },
  // { label: "图表部分", value: "chart" },
];

const state = reactive({
  loading: false,
});

const disabledSave = computed(() => curdConfigState.editor.show || curdConfigState.editor.showForm);

function onClose() {
  curdConfigState.show = false;
  // 一定要清空状态
  curdConfigState.config = {} as CurdType.Config;
  curdConfigState.editor = getCurdConfigEditor();
}

function onCopyJson() {
  copyText(JSON.stringify(curdConfigState.config), () => message.success("复制成功！"));
}

function onSubmit() {
  curdConfigState.callback(curdConfigState.config as CurdType.Config);
  onClose();
}

function onTab() {
  curdConfigState.editor = getCurdConfigEditor(); 
}
</script>
<template>
  <section>
    <transition name="page-y" mode="out-in">
      <div v-if="curdConfigState.show" class="the-curd-popup-config" :style="{ 'z-index': currentZIndex }">
        <nav class="the-curd-popup-top f-vertical">
          <h2 class="the-title">{{ curdConfigState.title }}</h2>
          <el-radio-group v-model="curdConfigState.type" class="ml-[20px]" @change="onTab">
            <el-radio-button
              v-for="item in tabList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            />
          </el-radio-group>
          <div class="f1"></div>
          <i class="the-curd-popup-close" @click="onClose()"></i>
        </nav>
        <section class="the-curd-popup-content">
          <div class="w-full h-full flex overflow-auto">
            <div class="f1">
              <Search
                v-if="curdConfigState.type === 'search'"
                :search="curdConfigState.config.search"
                edit-mode
              />
              <TableModel
                v-if="curdConfigState.type === 'table'"
                :config="curdConfigState.config.table"
              />
            </div>
            <Editor v-model:show="curdConfigState.editor.show" :config="curdConfigState.config" />
          </div>
        </section>
        <footer class="the-curd-popup-footer">
          <el-button type="success" plain @click="onCopyJson()">
            <i class="el-icon--left el-icon-document-copy"></i>
            复制JSON
          </el-button>
          <el-button :disabled="disabledSave" @click="onClose()">关闭</el-button>
          <el-button
            type="primary"
            :loading="state.loading"
            :disabled="disabledSave"
            @click="onSubmit()"
          >
            保存配置
          </el-button>
        </footer>
      </div>
    </transition>
  </section>
</template>
<style lang="scss">
@import url("./styles/config.scss");
</style>
