<template>
  <el-select
    v-model="useValue"
    :placeholder="placeholder.toString()"
    :disabled="disabled || requesting"
    :multiple="multiple"
    clearable
    @change="onSelect"
    popper-class="base-input-select-popper"
  >
    <el-option
      v-for="item in options"
      :key="item[useSetting.key]"
      :label="item[useSetting.label]"
      :value="item[useSetting.value]"
    >
      <slot v-bind="item"></slot>
    </el-option>
    <div :class="['btn-bottom-box flex', { 'pdr-10': isNoMore }]">
      <el-button text type="primary" class="f1" :loading="loading || requesting" :disabled="isNoMore" @click="getData()">{{ isNoMore ? '数据已加载完' : '加载更多' }}</el-button>
      <el-button text type="success" @click="getData(true)" v-if="isNoMore">重新加载数据</el-button>
    </div>
  </el-select>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { jsonParse, modifyData } from "@/utils";

/** 分页加载选择框 */
export default defineComponent({
  name: "InputSelect"
});
</script>
<script lang="ts" setup>
import { usePageInfo } from "@/hooks/common";
import { ref, reactive, computed, type PropType } from "vue";
import { useProps, useSettingComputed } from "./index";

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: ""
  },
  /** 请求数据函数 */
  request: {
    type: Function as PropType<(res: any) => Promise<Api.Result<Api.List>>>,
    required: true
  },
  /** 请求参数 */
  requestParams: {
    type: Object,
    default: () => ({})
  },
  /** 缓存名 */
  cacheName: {
    type: String,
    default: ""
  },
  /** 是否多选 */
  multiple: {
    type: Boolean,
    default: false
  },
  ...useProps("请选择"),
});

const emit = defineEmits(["update:modelValue", "change"]);

const useValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit("update:modelValue", val);
  }
});

const useSetting = useSettingComputed(props);

function onSelect() {
  emit("change", props.modelValue);
}

const pageInfo = reactive(usePageInfo());

const requesting = ref(false);

const options = ref<Array<BaseObj>>([]);

/**
 * 请求数据
 * @param refresh 是否刷新数据
 */
async function getData(refresh?: boolean) {
  requesting.value = true;
  if (refresh) {
    pageInfo.currentPage = 1;
    options.value = [];
  }
  const res = await props.request({
    ...pageInfo,
    ...props.requestParams
  })
  requesting.value = false;
  if (res.code === 1) {
    const result = res.data;
    options.value = options.value.concat(result.list);
    pageInfo.total = result.total;
    if (!isNoMore.value) {
      pageInfo.currentPage++;
    }
    if (props.cacheName) {
      sessionStorage.setItem(props.cacheName, JSON.stringify({
        options: options.value,
        pageInfo: pageInfo
      }))
    }
  }
}

const isNoMore = computed(function() {
  return options.value.length >= pageInfo.total!;
});

if (props.cacheName) {
  const value = jsonParse(sessionStorage.getItem(props.cacheName));
  if (value.options) {
    options.value = value.options;
    modifyData(pageInfo, value.pageInfo);
  } else {
    getData();
  }
} else {
  getData();
}

</script>
<style lang="scss">
.base-input-select-popper {
  // width: 100%;
  .el-select-dropdown__list {
    padding-bottom: 0;
    // margin-bottom: 0;
  }
  .btn-bottom-box {
    width: 100%;
  }
}
</style>