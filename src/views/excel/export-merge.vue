<template>
  <ExportExcel :isMergeHeader="true" />
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ExportExcel from "./export.vue";

@Component({
  components: {
    ExportExcel,
  },
})
export default class ExportMergeExcel extends Vue {}
</script>