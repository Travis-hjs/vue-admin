<template>
  <Curd :config="config" />
</template>
<script lang="ts" setup>
import { Curd, getTestData } from "@/components/Curd";
import { ref, reactive } from "vue";

const config = reactive(getTestData());

</script>
<style lang="scss"></style>
