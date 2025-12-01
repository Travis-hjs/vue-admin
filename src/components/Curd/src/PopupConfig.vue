<script lang="ts">
/** `curd`配置弹出层组件 */
export default {
  name: "CurdPopupConfig"
};
</script>
<script lang="ts" setup>
import { PresetCodeType, type CurdType } from "./types";
import { curdConfigState } from "./hooks";
import { computed, reactive } from "vue";
import { copyText } from "@/utils";
import { message } from "@/utils/message";
import { getCurdConfigEditor } from "./data";
import Search from "./Search.vue";
import TableModel from "./TableModel.vue";
import Editor from "./Editor.vue";
import FullPopup from "./FullPopup.vue";
import { Fields, type FieldType } from "@/components/Fields";
import { PresetCode } from "./part";
import { searchSubmitTips } from "./data/html";

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
    validator(r: any, v: string, callback: (err?: Error) => void) {
      if (v && !v.includes("return")) {
        callback(new Error("函数必须带有 return 字段"));
      } else {
        callback();
      }
    }
  }
};

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
  <FullPopup
    v-model:show="curdConfigState.show"
    :title="`${curdConfigState.title} (${curdConfigState.pageId})`"
    @close="onClose"
  >
    <template #top>
      <el-radio-group v-model="curdConfigState.type" @change="onTab">
        <el-radio-button
          v-for="item in tabList"
          :label="item.label"
          :value="item.value"
          :key="item.value"
        />
      </el-radio-group>
    </template>
    <div class="w-full h-full overflow-auto">
      <template v-if="curdConfigState.type === 'search'">
        <el-divider content-position="left" border-style="dashed">
          <el-text type="info">基础配置</el-text>
        </el-divider>
        <el-form 
          :model="curdConfigState.config.search"
          :rules="configRules"
          label-position="right"
          label-width="180px"
        >
          <Fields :data="curdConfigState.config.search" :list="searchConfigs">
            <template #validateCode>
              <div class="w-full max-w-[680px]">
                <PresetCode
                  v-model:value="curdConfigState.config.search.validateCode"
                  :type="PresetCodeType.Map.SearchValidate"
                />
              </div>
            </template>
          </Fields>
        </el-form>
        <el-divider content-position="left" border-style="dashed">
          <el-text type="info">筛选条件配置</el-text>
        </el-divider>
        <Search
          :search="curdConfigState.config.search"
          edit-mode
        />
      </template>
      <TableModel
        v-if="curdConfigState.type === 'table'"
        :config="curdConfigState.config.table"
        :page-id="curdConfigState.pageId"
      />
    </div>
    <Editor v-model:show="curdConfigState.editor.show" :config="curdConfigState.config" />
    <template #footer>
      <el-button :disabled="disabledSave" @click="onClose()">关闭</el-button>
      <el-button type="success" plain @click="onCopyJson()">
        <i class="el-icon--left el-icon-document-copy"></i>
        复制JSON
      </el-button>
      <el-button
        type="primary"
        :loading="state.loading"
        :disabled="disabledSave"
        @click="onSubmit()"
      >
        保存配置
      </el-button>
    </template>
  </FullPopup>
</template>
<style lang="scss">
@import url("./styles/config.scss");
</style>
