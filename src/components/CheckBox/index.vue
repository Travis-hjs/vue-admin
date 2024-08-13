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
<style lang="scss"></style>