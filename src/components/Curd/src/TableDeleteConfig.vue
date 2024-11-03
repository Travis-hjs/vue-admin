<template>
  <base-dialog
    v-model="state.show"
    title="配置表格删除功能"
    width="400px"
    @close="onClose"
  >
    <el-form labelPosition="right" labelWidth="120px">
      <el-form-item label="数据键值">
        <el-input
          class="mgb-10"
          v-model="state.keyword"
          placeholder="请输入数据键值"
          clearable
        />
        <div class="the-tag blue">
          <p class="mgb-10">表格数据中的字段，例如表格数：</p>
          <p class="mgb-10">{{ tips }}</p>
          <p class="mgb-10">则键值可以为 id</p>
          <p>
            <i class="el-icon-info el-icon--left"></i>
            不填则没有删除功能
          </p>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <FooterBtn @close="onClose" @submit="onSubmit" />
    </template>
  </base-dialog>
</template>
<script lang="ts">
/** 表格配置删除功能弹框 */
export default {
  name: "TableDeleteConfig"
}
</script>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { FooterBtn } from './part';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  selectKey: {
    type: String,
    default: ""
  }
});

const emit = defineEmits<{
  (event: "update:show", show: boolean): void;
  (event: "submit", key: string): void;
}>();

const tips = `[{ id: 1, name: "名称", status: 2 }]`;

const state = reactive({
  show: false,
  keyword: ""
});

function onClose() {
  emit("update:show", false);
}

function onSubmit() {
  onClose();
  emit("submit", state.keyword);
}

watch(
  () => props.show,
  function (show) {
    state.show = show;
    if (!show) return;
    state.keyword = props.selectKey || "";
  },
  { immediate: true }
);
</script>
