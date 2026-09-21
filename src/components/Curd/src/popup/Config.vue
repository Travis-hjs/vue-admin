<script lang="ts">
/** `curd`配置弹出层组件 */
export default {
  name: "CurdConfigPopup"
};
</script>
<script lang="ts" setup>
import type { CurdConfig } from "./types";
import { PresetCodeType, type CurdType } from "../types";
import { openJsonPopup } from "../hooks";
import { reactive } from "vue";
import { copyText, deepClone } from "@/utils";
import { message } from "@/utils/message";
import Search from "../Search.vue";
import TableModel from "../TableModel.vue";
import FullPopup from "../popup/FullPopup.vue";
import { Fields, type FieldType } from "@/components/Fields";
import { PresetCode } from "../part";
import { searchSubmitTips } from "../data/html";

const props = defineProps<CurdConfig.Props>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "closed"): void;
  (event: "submit", config: CurdType.Config): void;
}>();

const tabList = [
  { label: "筛选部分", value: "search" },
  { label: "表格部分", value: "table" },
  // { label: "图表部分", value: "chart" },
];

const searchConfigs: Array<FieldType.Member<CurdType.Search>> = [
  {
    label: "整体文字宽度",
    prop: "labelWidth",
    type: "number",
    placeholder: "例如：120(px)",
    class: "min-w-[200px]"
  },
  {
    label: "文字靠右对齐",
    prop: "labelRight",
    type: "switch"
  },
  {
    label: "查询数据校验逻辑代码",
    prop: "validateCode",
    type: "slot",
    slotName: "validateCode",
    tooltip: searchSubmitTips
  }
];

const configRules = {
  validateCode: {
    required: false,
    trigger: "blur",
    validator(_r: any, v: string, callback: (err?: Error) => void) {
      if (v && !v.includes("return")) {
        callback(new Error("函数必须带有 return 字段"));
      } else {
        callback();
      }
    }
  }
};

const state = reactive({
  type: props.type,
  config: deepClone(props.config, true),
  loading: false,
});

function onClose() {
  emit("close");
}

function onCopyJson() {
  copyText(JSON.stringify(state.config), () => message.success("复制配置JSON成功~"));
}

function onSetCopy() {
  openJsonPopup<CurdType.Config>(data => {
    state.config = data;
  });
}

function onSubmit() {
  emit("submit", state.config);
  onClose();
}
</script>
<template>
  <FullPopup
    :show="props.show"
    :title="`${props.title} (${props.pageId})`"
    @close="onClose"
    @closed="emit('closed')"
  >
    <template #top>
      <el-radio-group v-model="state.type">
        <el-radio-button
          v-for="item in tabList"
          :label="item.label"
          :value="item.value"
          :key="item.value"
        />
      </el-radio-group>
    </template>
    <div class="w-full h-full overflow-auto">
      <template v-if="state.type === 'search'">
        <div class="pl-[10px] mb-[10px]">
          <h2 class="the-title is-line">基础配置</h2>
        </div>
        <el-form 
          :model="state.config.search"
          :rules="configRules"
          label-position="right"
          label-width="180px"
        >
          <Fields :data="state.config.search" :list="searchConfigs">
            <template #validateCode>
              <div class="w-full max-w-[680px]">
                <PresetCode
                  v-model:value="state.config.search.validateCode"
                  :type="PresetCodeType.Map.SearchValidate"
                  :page-id="props.pageId"
                />
              </div>
            </template>
          </Fields>
        </el-form>
        <div class="pl-[10px] mb-[20px]">
          <h2 class="the-title is-line">筛选条件配置</h2>
        </div>
        <Search
          :search="state.config.search"
          edit-mode
        />
      </template>
      <TableModel
        v-if="state.type === 'table'"
        :config="state.config.table"
        :page-id="props.pageId"
      />
    </div>
    <template #footer>
      <el-button @click="onClose()">退出编辑</el-button>
      <el-button type="success" plain @click="onCopyJson()">
        <i class="el-icon--left el-icon-document-copy" />
        复制配置
      </el-button>
      <el-button type="primary" plain @click="onSetCopy()">
        <i class="el-icon--left el-icon-edit-outline" />
        回填配置
      </el-button>
      <el-button
        type="primary"
        :loading="state.loading"
        @click="onSubmit()"
      >
        保存配置
      </el-button>
    </template>
  </FullPopup>
</template>
<style lang="scss">
@use "../styles/config";
</style>
