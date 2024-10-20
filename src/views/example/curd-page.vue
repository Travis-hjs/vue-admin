<template>
  <Curd :config="config" />
</template>
<script lang="ts" setup>
import { Curd, useTestData } from "@/components/Curd";
import { ref, reactive } from "vue";

const config = reactive(useTestData());

</script>
<style lang="scss"></style>
