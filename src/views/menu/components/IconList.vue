<template>
  <base-dialog
    v-model="state.show"
    title="图标库"
    width="922px"
    @close="onClose()"
  >
    <template #header>
      <el-input
        v-model="state.keyword"
        clearable
        placeholder="请输入关键字查找"
        style="max-width: 280px;"
      >
        <template #prefix>
          <i class="el-icon-search"></i>
        </template>
      </el-input>
    </template>
    <section style="min-height: 60vh;">
      <div class="icon-list">
        <div
          class="icon-item fvc"
          v-for="(item) in iconList"
          :key="item"
          @click="onSelect(item)"
        >
          <el-icon :size="28">
            <svg-icon class="mgb-10" :name="item" />
          </el-icon>
          <el-text size="small">{{ item }}</el-text>
        </div>
      </div>
      <el-empty v-show="!iconList.length" description="没有你想要的图标" />
    </section>
    <template #footer>
      <el-button style="width: 120px;" @click="onClose()">关 闭</el-button>
    </template>
  </base-dialog>
</template>
<script lang="ts">

/** 图标选择 */
export default {
  name: "IconList"
};
</script>
<script lang="ts" setup>
import { computed, reactive, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  (event: "update:show", val: boolean): void
  (event: "select", val: string): void
}>();

const svgFileReg = /(?<=(svg\/)).*?(?=(.svg))/;

function getSvgNames() {
  const svgInfo = import.meta.glob("/src/icons/svg/*.svg");
  const svgs = Object.keys(svgInfo);
  const names = svgs.map(value => value.match(svgFileReg)![0]);
  return names;
}

const list = getSvgNames();

const state = reactive({
  show: false,
  keyword: ""
})

const iconList = computed(function() {
  if (state.keyword) {
    return list.filter(item => item.includes(state.keyword));
  }
  return list;
})

watch(() => props.show, function(val) {
  state.show = val;
})

function onClose() {
  emit("update:show", false);
}

function onSelect(iconName: string) {
  onClose();
  emit("select", iconName);
}

</script>
<style lang="scss" scoped>
.icon-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  .icon-item {
    width: 140px;
    height: 100px;
    border: solid 1px var(--el-border-color);
    cursor: pointer;
    flex-direction: column;
    transition: var(--transition);
    &:hover {
      color: var(--blue);
      border-color: var(--blue);
      .el-text {
        color: var(--blue);
      }
    }
  }
}
</style>