<script lang="ts" generic="T extends BaseObj<any>" setup>
import type { FormInstance } from "element-plus";
import type { PopupFormProp } from "./types";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { computed, reactive, ref } from "vue";
import { Fields } from "@/components/Fields";
import { deepClone } from "@/utils";

const props = defineProps<PopupFormProp<T>>();

const emit = defineEmits<{
  (event: "close", val: boolean): void;
  (event: "closed"): void;
}>();

const showPopup = computed({
  get() {
    return props.show;
  },
  set(val) {
    emit("close", val);
  },
});

function getFormData(): T {
  return {} as any;
}

const state = reactive({
  loading: false,
  form: getFormData() as any,
});

const formRef = ref<FormInstance>();

function onClose() {
  showPopup.value = false;
  props.onCancel && props.onCancel();
}

function setForm(form?: T) {
  state.form = form || getFormData();
  setTimeout(() => formRef.value?.clearValidate());
}

function onOpened() {
  // 可以做一些表单回显操作
  if (props.form) {
    setForm(deepClone(props.form, true));
  }
}

function onSubmit() {
  formRef.value?.validate((val) => {
    if (val) {
      state.loading = true;
      props.onConfirm(deepClone(state.form), (close) => {
        state.loading = false;
        close && onClose();
      });
    }
  });
}

function onClosed() {
  emit("closed");
  setForm();
}

defineExpose({
  getFormData() {
    return state.form;
  },
});
</script>

<template>
  <base-dialog
    v-model:show="showPopup"
    :title="props.title"
    :width="props.width || '500px'"
    :full="props.full"
    @closed="onClosed()"
    @opened="onOpened()"
  >
    <el-config-provider :locale="zhCn">
      <el-form
        ref="formRef"
        :label-width="props.labelWidth || '120px'"
        :label-position="props.labelPosition || 'left'"
        :model="state.form"
        :rules="props.rules"
        :disabled="state.loading"
        @submit.prevent
      >
        <Fields :data="state.form" :list="props.fields" />
      </el-form>
    </el-config-provider>
    <template #footer>
      <el-button v-if="props.cancelText" @click="onClose()">
        {{ props.cancelText }}
      </el-button>
      <el-button type="primary" :loading="state.loading" @click="onSubmit()">
        {{ props.confirmText || "确定" }}
      </el-button>
    </template>
  </base-dialog>
</template>

<style lang="scss"></style>
