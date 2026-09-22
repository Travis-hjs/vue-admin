<script lang="ts">
/**
 * 代码编辑器
 */
export default {
  name: "CodeEditor",
};
</script>

<script lang="ts" setup>
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { sql } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { computed, ref } from "vue";
import { Codemirror } from "vue-codemirror";
import { message } from "@/utils/message";

const props = withDefaults(defineProps<{
  value?: string;
  language: "js" | "json" | "sql";
  placeholder?: string;
  disabled?: boolean;
  height?: string;
}>(), {
  height: "150px",
  value: "",
  language: "js",
  placeholder: "请输入",
});

const emit = defineEmits<{
  (event: "update:value", value: string): void;
  (event: "change", value: string): void;
  (event: "update", value: unknown): void;
  (event: "ready", value: unknown): void;
  (event: "focus", value: unknown): void;
  (event: "blur", value: unknown): void;
}>();

const expanded = ref(false);

// CodeMirror 6 的能力通过 extensions 组合：先配置语法模式，再按需添加编辑行为。
const extensions = computed(() => {
  // 根据 language 切换语法高亮和解析器；未传或传入 js/javascript 时使用 JavaScript。
  const language = props.language === "json"
    ? json()
    : props.language === "sql"
      ? sql()
      // JSX 和 TypeScript 选项让 JavaScript 编辑器也能识别这两类语法。
      : javascript({ jsx: true, typescript: true });

  // lineWrapping 会让超出编辑区域的长行自动换行，否则使用横向滚动查看。
  return [language, oneDark];
});

function onUpdate(value: string) {
  emit("update:value", value);
}

function onChange(value: string) {
  emit("change", value);
}

function onUpdateState(value: unknown) {
  emit("update", value);
}

function onReady(value: unknown) {
  emit("ready", value);
}

function onFocus(value: unknown) {
  emit("focus", value);
}

function onBlur(value: unknown) {
  emit("blur", value);
}

function toggleExpanded() {
  expanded.value = !expanded.value;
}

function formatJson() {
  if (!props.value || props.disabled)
    return;
  try {
    const value = JSON.stringify(JSON.parse(props.value), null, 4);
    emit("update:value", value);
    emit("change", value);
  }
  catch (error) {
    message.error(`JSON格式有误：${error}`);
  }
}
</script>

<template>
  <div
    class="the-code-editor"
    :class="{ 'is-expanded': expanded }"
    :style="{ '--height': props.height }"
  >
    <Codemirror
      :model-value="props.value"
      :placeholder="props.placeholder"
      :extensions="extensions"
      :autofocus="false"
      :disabled="props.disabled"
      :indent-with-tab="true"
      :tab-size="2"
      @update:model-value="onUpdate"
      @change="onChange"
      @update="onUpdateState"
      @ready="onReady"
      @focus="onFocus"
      @blur="onBlur"
    />
    <div class="code-editor-actions">
      <button
        v-if="props.language === 'json'"
        class="code-editor-action-button"
        type="button"
        :disabled="props.disabled || !props.value"
        title="使用4个空格格式化JSON"
        @mousedown.prevent
        @click="formatJson"
      >
        格式化
      </button>
      <button
        class="code-editor-action-button"
        type="button"
        :aria-expanded="expanded"
        :title="expanded ? '收起编辑器' : '展开编辑器'"
        @mousedown.prevent
        @click="toggleExpanded"
      >
        {{ expanded ? "收起" : "展开" }}
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.the-code-editor {
  position: relative;
  width: 100%;
  height: var(--height);
  border-radius: 10px;
  overflow: hidden;

  &.is-expanded {
    height: auto;

    .cm-editor {
      height: auto;
    }

    .cm-scroller {
      overflow-y: visible;
    }
  }

  .cm-editor {
    height: 100%;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
  }

  .cm-scroller {
    overflow: auto;
    font-family: var(--el-font-family);
    font-size: 14px;
  }

  .cm-content,
  .cm-gutter {
    min-height: 100%;
  }

  .cm-content {
    padding-bottom: 38px;
  }

  .code-editor-actions {
    position: absolute;
    right: 10px;
    bottom: 8px;
    z-index: 10;
    display: flex;
    gap: 6px;
  }

  .code-editor-action-button {
    height: 26px;
    padding: 0 10px;
    color: #cdd6f4;
    font-size: 12px;
    line-height: 24px;
    letter-spacing: 0;
    cursor: pointer;
    background: #282c34;
    border: 1px solid #5c6370;
    border-radius: 4px;
  }

  .code-editor-action-button:hover:not(:disabled) {
    color: #fff;
    border-color: #61afef;
  }

  .code-editor-action-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
