<template>
  <div class="base-input-search type-1">
    <el-input
      v-model="keyword"
      :placeholder="placeholder.toString()"
      :disabled="disabled || loading"
      clearable
      @clear="onSearch()"
      @focus="onFocus()"
      @blur="onBlur()"
      @keyup.native.enter="onSearch()"
    >
      <template #prepend v-if="prepends">
        <button class="base-input-prepend" :style="{ width: prependWidth }" type="button" ref="prependBtn" :disabled="disabled || loading">
          <span>{{ selectItem ? selectItem[useSetting.label] : '请选择' }}</span>
          <i :class="['icon el-icon-arrow-down', { 'opened': showPrepend }]"></i>
        </button>
      </template>
      <template #append>
        <el-button class="fcc" @click="onSearch()" :disabled="disabled || loading">
          <i class="el-icon-search" v-show="!loading"></i>
          <i class="el-icon-loading" v-show="loading"></i>
        </el-button>
      </template>
    </el-input>
    <transition name="fade-slide-y">
      <div class="base-input-search-select-list" :style="{ '--slide-y':  '20px', width: prependWidth }" v-show="showPrepend">
        <button
          type="button"
          v-for="(pre, index) in prepends"
          :class="['input-search-select-item f-vertical', {'actived': prependValue === pre[useSetting.value]}]"
          :key="pre[useSetting.key] || ('pre-' + index)"
          :disabled="!!pre[useSetting.disabled]"
          @click="onSelect(pre)"
        >
          {{ pre[useSetting.label] }}
        </button>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

/** 搜索输入框 */
export default defineComponent({
  name: "InputSearch"
});
</script>
<script lang="ts" setup>
import { computed, ref, type PropType, onMounted, onUnmounted } from "vue";
import { useProps, useSettingComputed } from "./index";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ""
  },
  /** 前缀选项列表 */
  prepends: {
    type: Array as PropType<Array<{ label: string, value: string | number, disabled?: boolean } & BaseObj<string>>>,
    default: undefined
  },
  /** 前缀选项选中值 */
  prependValue: {
    type: [String, Number],
    default: undefined
  },
  /** 前缀宽度 */
  prependWidth: {
    type: String,
    default: "110px"
  },
  ...useProps("请输入搜索内容")
});

const emit = defineEmits<{
  (event: "update:modelValue"|"search", val: string|number): void
  (event: "focus"|"blur", val: boolean): void
  (event: "update:prependValue", val: string|number): void
  (event: "prependChange"): void
}>();

const keyword = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit("update:modelValue", val);
  }
});

const useSetting = useSettingComputed(props);

const selectItem = computed(function() {
  if (props.prepends) {
    for (let i = 0; i < props.prepends.length; i++) {
      const item = props.prepends[i];
      if (item[useSetting.value.value as "value"] === props.prependValue) {
        return item;
      }
    }
  }
  return undefined;
});

function onSearch() {
  emit("search", keyword.value);
}

function onFocus() {
  emit("focus", true);
}

function onBlur() {
  emit("blur", true);
}

const prependBtn = ref<HTMLButtonElement>();

const showPrepend = ref(false);

function checkPrepend(e: MouseEvent) {
  const el = e.target as HTMLElement;
  if (props.disabled || props.loading) {
    showPrepend.value = false;
    return;
  }
  if (prependBtn.value && prependBtn.value.contains(el)) {
    showPrepend.value = !showPrepend.value;
  } else {
    showPrepend.value = false;
  }
}

function onSelect(pre: BaseObj) {
  const needChange = props.prependValue !== pre[useSetting.value.value];
  emit("update:prependValue", pre[useSetting.value.value]);
  needChange && emit("prependChange");
}

onMounted(function() {
  document.addEventListener("click", checkPrepend);
});

onUnmounted(function() {
  document.removeEventListener("click", checkPrepend);
});

</script>
<style lang="scss">
@import "./search.scss";
</style>