<script lang="ts">
/** 表格配置批量操作功能弹框 */
export default {
  name: "TableBatchConfig"
};
</script>
<script lang="ts" setup>
import type { CurdType } from "./types";
import type { FormInstance } from "element-plus";
import { type PropType, reactive, ref, watch } from "vue";
import { FooterBtn, IconInput, PresetCode } from "./part";
import { Fields, type FieldType } from "@/components/Fields";
import { getBoldLabel } from "./data";
import { getCountId, useListDrag } from "@/hooks/common";

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  selectKey: {
    type: String,
    default: ""
  },
  /** 按钮列表 */
  list: {
    type: Array as PropType<Array<CurdType.Table.Batch>>,
    default: () => []
  }
});

const emit = defineEmits<{
  (event: "update:show", show: boolean): void;
  (event: "submit", key: string, list: Array<CurdType.Table.Batch>): void;
  (event: "openFormConfig", target: CurdType.Table.Batch): void;
}>();

const tips = `[{ id: 1, name: "名称", status: 2 }]`;

const fnTips = `
<p>函数代码片段，点击的时候运行</p>
<p>函数第一个参数${getBoldLabel("list")}是当前选中键值列表；</p>
<p>第二个参数${getBoldLabel("selectList")}是当前选中的完整列表；</p>
<p>例如：${getBoldLabel("console.log(list, selectList);")}</p>
<p>
  <a class="el-link el-link--primary" target="_blank" href="https://github.com/Travis-hjs/vue-admin/blob/el-plus/src/components/Curd/src/index.vue">查看已暴露的函数</a>
</p>
<p>下划线开头的均是全局函数，可在控制台直接运行。</p>
`;

function getFormData(): CurdType.Table.Batch {
  return {
    key: getCountId("batch"),
    type: "primary",
    icon: "",
    text: "",
    batchCode: ""
  };
}

const formRules = {
  text: {
    required: true,
    message: "请输入按钮文字",
    trigger: "blur"
  },
  batchCode: {
    required: true,
    message: "请输入按钮操作代码",
    trigger: "blur"
  }
};

const formItems: Array<FieldType.Member<CurdType.Table.Batch>> = [
  {
    label: "按钮文字",
    prop: "text",
    type: "textarea",
    placeholder: formRules.text.message,
  },
  {
    label: "按钮功能代码",
    prop: "batchCode",
    type: "slot",
    slotName: "batchCode",
    tooltip: fnTips,
    show: () => !state.formData.formConfig,
  },
  {
    label: "表单功能",
    prop: "formConfig",
    type: "slot",
    slotName: "formConfig",
  },
  {
    label: "按钮类型",
    prop: "type",
    type: "select",
    options: [
      { label: "默认（蓝色）", value: "primary" },
      { label: "成功（绿色）", value: "success" },
      { label: "警告（橙色）", value: "warning" },
      { label: "危险（红色）", value: "danger" },
      { label: "文本（灰色）", value: "info" },
    ]
  },
  {
    label: "按钮图标",
    prop: "icon",
    type: "slot",
    slotName: "icon",
  },
  {
    label: "是否实心按钮",
    prop: "solid",
    type: "switch",
  }
];

const formBtn = ref<FormInstance>();

const state = reactive({
  show: false,
  keyword: "",
  batchList: [] as Array<CurdType.Table.Batch>,
  formData: getFormData(),
  index: -1,
  /** 是否有编辑按钮在当前列表中 */
  hasEdit: false,
  /** 当前表单是否处于编辑状态 */
  formEdit: false
});

function onClose() {
  emit("update:show", false);
}

function onSubmit() {
  onClose();
  emit("submit", state.keyword, JSON.parse(JSON.stringify(state.batchList)));
}

function onRestBtn() {
  state.index = -1;
  state.formData = getFormData();
  state.formEdit = false;
  setTimeout(() => formBtn.value?.clearValidate());
}

function onEdit(index: number) {
  const data = state.batchList[index];
  state.formData = JSON.parse(JSON.stringify(data));
  state.index = index;
  state.formEdit = true;
}

function onDelete(index: number) {
  state.batchList.splice(index, 1);
}

function onSubmitBtn(type: "add" | "edit") {
  formBtn.value!.validate(val => {
    if (!val) return;
    const data = JSON.parse(JSON.stringify(state.formData));
    if (type === "add") {
      state.batchList.push(data);
    } else {
      state.batchList[state.index] = data;
    }
    onRestBtn();
  });
}

const { onDragStart, onDragMove, onDropEnd } = useListDrag({
  list: () => state.batchList,
  key: "key"
});

/** 是否能拖拽 */
function canDraggable() {
  if (state.batchList.length > 1 && state.index === -1) {
    return true;
  }
  return undefined;
}

function onFormConfig() {
  emit("openFormConfig", state.formData);
}

watch(
  () => props.show,
  function (show) {
    state.show = show;
    if (!show) return;
    state.keyword = props.selectKey || "";
    state.batchList = props.list ? JSON.parse(JSON.stringify(props.list)) : [];
  },
  { immediate: true }
);
</script>
<template>
  <base-dialog
    v-model:show="state.show"
    title="配置批量操作功能"
    width="1000px"
    @close="onClose"
  >
    <div class="flex">
      <section class="f3">
        <el-form labelPosition="right" labelWidth="120px">
          <el-form-item label="数据键值">
            <el-input
              v-model="state.keyword"
              class="mb-[8px]"
              placeholder="请输入数据键值"
              clearable
            />
            <div class="the-tag blue">
              <p class="mb-[8px]">表格数据中的字段，例如表格数：</p>
              <p class="mb-[8px]">{{ tips }}</p>
              <p class="mb-[8px]">则键值可以为 id</p>
              <p>
                <i class="el-icon-info el-icon--left" />
                不填则没有批量功能，即使配置了批量按钮
              </p>
            </div>
          </el-form-item>
        </el-form>
        <el-divider content-position="left" border-style="dashed">
          <el-text type="info">操作按钮配置</el-text>
        </el-divider>
        <el-form
          ref="formBtn"
          :model="state.formData"
          :rules="formRules"
          labelPosition="right"
          labelWidth="128px"
          :class="{ 'the-filter-mask': !state.formEdit }"
          data-tips="待新增或编辑操作"
        >
          <Fields :data="state.formData" :list="formItems">
            <template #batchCode>
              <PresetCode
                v-model:value="state.formData.batchCode"
                type="batch-submit"
              />
            </template>
            <template #icon>
              <IconInput v-model:value="state.formData.icon" />
            </template>
            <template #formConfig>
              <el-button
                :type="state.formData.formConfig ? 'success' : 'primary'"
                size="small"
                plain
                @click="onFormConfig"
              >
                <i :class="['el-icon--left', state.formData.formConfig ? 'el-icon-edit' : 'el-icon-setting']" />
                {{ state.formData.formConfig ? "修改表单" : "配置表单" }}
              </el-button>
              <el-button
                v-if="state.formData.formConfig"
                type="danger"
                size="small"
                plain
                @click="state.formData.formConfig = undefined"
              >
                <i class="el-icon--left el-icon-delete" />
                删除表单
              </el-button>
            </template>
          </Fields>
          <el-form-item>
            <div class="f-right w-full">
              <el-button @click="onRestBtn()">取 消</el-button>
              <el-button
                v-if="state.index > -1"
                type="primary"
                plain
                @click="onSubmitBtn('edit')"
              >
                <i class="el-icon--left el-icon-finished" />
                确认修改
              </el-button>
              <el-button
                v-else
                type="primary"
                plain
                @click="onSubmitBtn('add')"
              >
                <i class="el-icon--left el-icon-plus" />
                确认新增
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </section>
      <transition-group
        class="f2 the-curd-option-list"
        name="the-group"
        tag="div"
      >
        <div
          v-for="(item, itemIndex) in state.batchList"
          :key="item.key"
          :class="[
            'the-curd-option-item f-vertical',
            { 'the-curd-selected': itemIndex === state.index }
          ]"
          :data-key="item.key"
          :draggable="canDraggable()"
          @dragstart="onDragStart(itemIndex)"
          @dragover="e => onDragMove(e, itemIndex)"
          @drop="onDropEnd"
        >
          <i v-if="state.index === -1" class="el-icon--left el-icon-rank" />
          <el-button :type="item.type" link>
            <i v-if="item.icon" :class="['el-icon--left', item.icon]" />
            {{ item.text }}
          </el-button>
          <div class="f1" />
          <el-popconfirm
            width="186px"
            title="是否删除该按钮功能？"
            @confirm="onDelete(itemIndex)"
          >
            <template #reference>
              <el-button link type="danger" :disabled="state.index > -1">
                <i class="el-icon-delete" />
              </el-button>
            </template>
          </el-popconfirm>
          <el-button link type="success" @click="onEdit(itemIndex)">
            <i class="el-icon-edit" />
          </el-button>
        </div>
        <div v-if="!state.formEdit" class="f-right mt-[14px] w-full">
          <el-button
            v-if="!state.formEdit"
            type="primary"
            plain
            @click="state.formEdit = true"
          >
            <i class="el-icon--left el-icon-plus" />
            新增功能按钮
          </el-button>
        </div>
        <el-empty
          v-if="!state.batchList.length"
          key="empty"
          :image-size="120"
          description="请添加操作列功能按钮"
        />
      </transition-group>
    </div>
    <template #footer>
      <FooterBtn
        :disabledSubmit="state.formEdit"
        @close="onClose"
        @submit="onSubmit"
      />
    </template>
  </base-dialog>
</template>
