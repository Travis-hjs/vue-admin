<script lang="ts">
/** 表单配置 */
export default {
  name: "TableFormConfig"
};
</script>
<script lang="ts" setup>
import { computed, reactive, ref, watch, type PropType } from "vue";
import type { CurdConfig, CurdType } from "./types";
import { convertPx, getFormConfig } from "./data";
import FullPopup from "./FullPopup.vue";
import { Fields, type FieldType } from "@/components/Fields";
import Field from "./Field.vue";
import { curdConfigState } from "./hooks";
import { useListDrag } from "@/hooks/common";
import { messageBox } from "@/utils/message";
import type { FormInstance } from "element-plus";
import { validateEX } from "@/utils/dom";
import { deepClone } from "@/utils";

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  /** 表单配置 */
  config: {
    type: Object as PropType<CurdType.Table.From>,
    default: () => getFormConfig()
  },
  /** 表单类型 */
  type: {
    type: String as PropType<"add" | "edit" | "other">,
    required: true
  }
});

const emit = defineEmits<{
  (event: "update:show", val: boolean): void;
  (event: "change", config?: CurdType.Table.From, sync?: boolean): void;
}>();

const formRules = {
  title: {
    required: true,
    message: "请输入表单标题",
    trigger: "blur"
  },
  submitCode: {
    required: true,
    message: "请输入代码片段",
    trigger: "blur"
  },
};

const labelWidth = "140px";

const formConfigs: Array<FieldType.Member<CurdType.Table.From>> = [
  {
    label: "表单标题",
    labelWidth,
    prop: "title",
    type: "input",
    placeholder: "请输入标题"
  },
  {
    label: "表单宽度",
    labelWidth,
    prop: "width",
    type: "number",
    placeholder: "例如：500(px)"
  },
  {
    label: "文字宽度",
    labelWidth,
    prop: "labelWidth",
    type: "number",
    placeholder: "例如：140(px)"
  },
  {
    label: "文字靠右排版",
    labelWidth,
    prop: "labelPosition",
    type: "switch",
    inactiveValue: "left",
    activeValue: "right"
  },
  // {
  //   label: "按钮显示逻辑",
  //   labelWidth,
  //   prop: "showCode",
  //   type: "textarea",
  //   tooltip: showCodeTips,
  //   placeholder: "请输入代码片段",
  //   show: () => !isOther.value,
  // },
  // {
  //   label: "表单打开前逻辑",
  //   labelWidth,
  //   prop: "openCode",
  //   type: "textarea",
  //   tooltip: openCodeTips,
  //   placeholder: "请输入代码片段",
  // },
  // {
  //   label: "表单提交逻辑",
  //   labelWidth,
  //   prop: "submitCode",
  //   type: "slot",
  //   slotName: "submitCode",
  //   tooltip: submitCodeTips,
  //   placeholder: "请输入代码片段",
  // },
];

const state = reactive({
  config: getFormConfig(),
  showInfo: true,
});

const fieldActions = [
  {
    key: "copy",
    type: "primary",
    icon: "el-icon-document-copy",
    tips: "复制表单项",
    click(index: number) {
      openEditor("copy", index);
    }
  },
  {
    key: "edit",
    type: "success",
    icon: "el-icon-edit",
    tips: "编辑表单项",
    click(index: number) {
      openEditor("edit", index);
    }
  },
  {
    key: "delete",
    type: "danger",
    icon: "el-icon-delete",
    tips: "删除表单项",
    click(index: number) {
      onDelete(index);
    }
  }
] as const;

const formStyle = computed(() => {
  let width = state.config.width;
  if (width) {
    width += 160; // 加上编辑按钮的宽度
  }
  return { width: convertPx(width) };
});

const title = computed(() => {
  let text = "表单配置";
  if (state.config.title) {
    text = `表单配置-${state.config.title}`;
  }
  return text;
});

/** 当前表单操作名 */
const currentName = computed(() => props.type === "add" ? "新增" : "编辑");

const isOther = computed(() => props.type === "other");

const isEdit = computed(() => curdConfigState.editor.show);

const { onDragStart, onDragMove, onDropEnd } = useListDrag({
  list: () => state.config.fields,
  key: "id",
  findLevel: 10,
});

function onClose(val = false) {
  emit("update:show", val);
}

function onExit() {
  onClose();
  emit("change");
}

function onDelete(index: number) {
  const list = state.config.fields;
  messageBox({
    title: "操作提示",
    content: `是否删除【${list[index].label}】？`,
    cancelText: "取消",
    confirm() {
      list.splice(index, 1);
    }
  });
}

function onDeleteAll() {
  messageBox({
    title: "操作提示",
    content: `是否移除【${currentName.value}】表单？移除后将不会出现对应功能按钮。`,
    cancelText: "取消",
    confirm() {
      state.config.fields = [];
    }
  });
}

const formRef = ref<FormInstance>();

function onComplete() {
  formRef.value?.validate(val => {
    validateEX(".the-table-config-form", val);
    if (!val) return;
    if (isOther.value) {
      onClose();
      emit("change", state.config);
      return;
    }
    const name = props.type === "add" ? "编辑" : "新增";
    messageBox({
      title: "表单操作提示",
      content: `是否将《表单项》数据同步到【${name}】表单？`,
      cancelText: "同步",
      confirmText: "不同步",
      cancel() {
        onClose();
        emit("change", state.config, true);
      },
      confirm() {
        onClose();
        emit("change", state.config);
      }
    });
  });
}

// function onAddId() {
//   state.config.fields.unshift({
//     defaultValue: "",
//     valueType: "string",
//     show: "return !!formData.id;",
//     id: `field-text-${Date.now()}`,
//     label: "ID",
//     placeholder: "新增时不展示-自动生成",
//     type: "text",
//     value: "",
//     key: "id",
//     required: false
//   });
// }

function openEditor(action: CurdConfig.Editor["action"], index: number) {
  curdConfigState.editor.action = action;
  curdConfigState.editor.form = state.config;
  curdConfigState.editor.index = index;
  curdConfigState.editor.show = true;
}

watch(
  () => props.show,
  function (val) {
    state.config = val ? deepClone(props.config) : getFormConfig();
    if (!isOther.value && !state.config.title) {
      state.config.title = props.type === "edit" ? "编辑" : "新增";
    }
    state.showInfo = true;
  },
  { immediate: true },
);
</script>
<template>
  <FullPopup :show="props.show" :title="title" @close="onClose">
    <div class="f-center h-full w-full overflow-auto">
      <el-form
        ref="formRef"
        :model="state.config"
        :rules="formRules"
        :label-width="convertPx(state.config.labelWidth)"
        :label-position="state.config.labelPosition"
        :style="formStyle"
        class="the-curd-edit-form the-table-config-form"
      >
        <template v-if="state.config.fields.length">
          <el-divider content-position="left" border-style="dashed">
            <el-text type="info">配置表单信息</el-text>
            <el-button
              link
              type="primary"
              class="ml-[10px]"
              @click="state.showInfo = !state.showInfo"
            >
              {{ state.showInfo ? "收起" : "展开" }}
              <i
                :class="[
                  'el-icon--right',
                  `el-icon-arrow-${state.showInfo ? 'up' : 'down'}`
                ]"
              />
            </el-button>
          </el-divider>
          <div v-show="state.showInfo">
            <Fields :data="state.config" :list="formConfigs">
              <!-- <template #submitCode>
                <PresetCode
                  v-model:value="state.config.jsCode"
                  type="form-submit"
                />
              </template> -->
            </Fields>
          </div>
          <el-divider content-position="left" border-style="dashed">
            <el-text type="info">配置表单项</el-text>
          </el-divider>
        </template>
        <transition-group name="the-group" tag="div">
          <el-form-item
            v-for="(field, fieldIndex) in state.config.fields"
            :class="[
              'is-drag-item',
              { 'is-required': !!field.required },
              {'the-curd-selected': curdConfigState.editor.index === fieldIndex && isEdit}
            ]"
            :prop="field.key"
            :key="field.id"
            :data-key="field.id"
            :draggable="state.config.fields.length > 1"
            @dragstart="onDragStart(fieldIndex)"
            @dragover="(e: any) => onDragMove(e, fieldIndex)"
            @drop="onDropEnd"
          >
            <template #label>
              <i
                v-if="state.config.fields.length > 1"
                class="el-icon-rank el-icon--left"
                style="line-height: 32px"
              ></i>
              <span>{{ field.label }}</span>
            </template>
            <div class="f-vertical w-full">
              <Field class="mr-[10px]" :fieldData="field" editMode />
              <el-tooltip
                v-for="btn in fieldActions"
                :key="btn.key"
                effect="dark"
                :content="btn.tips"
                placement="top"
              >
                <el-button
                  link
                  :type="btn.type"
                  :disabled="isEdit"
                  @click="btn.click(fieldIndex)"
                >
                  <i :class="btn.icon" />
                </el-button>
              </el-tooltip>
            </div>
          </el-form-item>
        </transition-group>
        <el-empty
          v-if="!state.config.fields.length"
          :description="
            isOther
              ? `请配置表单项`
              : `当前没有表单项，当没有表单项时【${currentName}】功能按钮不会出现~`
          "
        >
          <!-- <el-button v-if="!isEdit" type="primary" plain @click="onAddId()">
            <i class="el-icon--left el-icon-plus" />
            新增默认ID项
          </el-button> -->
          <el-button
            v-if="!isEdit"
            type="primary"
            @click="openEditor('add', -1)"
          >
            <i class="el-icon--left el-icon-plus" />
            添加表单项
          </el-button>
        </el-empty>
        <div v-if="!isEdit">
          <el-form-item v-if="state.config.fields.length" key="bottom-add">
            <el-button type="primary" @click="openEditor('add', -1)">
              <i class="el-icon--left el-icon-plus" />
              继续添加
            </el-button>
            <!-- <el-button
              v-if="!state.config.fields.some(item => item.key === 'id')"
              type="primary"
              plain
              @click="onAddId()"
            >
              <i class="el-icon--left el-icon-plus" />
              新增默认ID项
            </el-button> -->
            <!-- <el-button @click="validate()">调试验证</el-button> -->
          </el-form-item>
        </div>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="onExit">
        退出编辑
      </el-button>
      <el-button
        v-if="!isOther"
        type="danger"
        :disabled="!state.config.fields.length"
        @click="onDeleteAll"
      >
        <i class="el-icon--left el-icon-delete"></i>
        删除表单
      </el-button>
      <el-button type="primary" @click="onComplete">
        <i class="el-icon--left el-icon-check"></i>
        保存表单
      </el-button>
    </template>
  </FullPopup>
</template>
