<template>
  <Curd :data="data" />
</template>
<script lang="ts" setup>
import { Curd, getTestData } from "@/components/Curd";
import { ref, reactive } from "vue";

const data = reactive(getTestData());

</script>
<style lang="scss"></style>
