<script lang="ts">
let id = 0;

export default {
  name: "CheckBox"
}
</script>
<script lang="ts" setup>

id++;

const forId = `the-checkbox-${id}`;

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ""
  },
})

const emit = defineEmits<{
  (event: "update:modelValue", val: boolean): void
  (event: "change", val: boolean): void
}>();

function onValue() {
  const value = !props.modelValue;
  emit("update:modelValue", value);
  emit("change", value);
}

</script>
<template>
  <label
    :class="['the-label f-vertical', { 'checked': props.modelValue }]"
    :for="forId"
    @change="onValue()"
    v-if="props.label"
  >
    <input class="the-checkbox" type="checkbox" :id="forId" :checked="props.modelValue" />
    <span>{{ props.label }}</span>
  </label>
  <input
    class="the-checkbox"
    type="checkbox"
    :id="forId"
    :checked="props.modelValue"
    @change="onValue()"
    v-else
  />
</template>
<style lang="scss">
.the-checkbox {
  appearance: none;
  outline: none;
  width: 16px;
  height: 16px;
  transition: var(--transition);
  border: solid 1px #dcdfe6;
  border-radius: var(--border-radius);
  cursor: pointer;
  position: relative;
  &:hover {
    border-color: var(--blue);
  }
  &::after {
    position: absolute;
    content: "";
    border: 1px solid transparent;
    border-left: 0;
    border-top: 0;
    left: 33%;
    top: 20%;
    height: 8px;
    width: 4px;
    transform: rotate(45deg) scaleY(0);
    transform-origin: center;
    transition: var(--transition);
  }
  &:checked {
    background-color: var(--blue);
    border-color: var(--blue);
    &::after {
      transform: rotate(45deg) scaleY(1);
      border-color: #fff;
    }
  }
}

.the-label {
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  user-select: none;
  .the-checkbox {
    margin-right: 6px;
  }
  &.checked {
    color: var(--blue);
  }
}
</style>
