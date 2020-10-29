<template>
    <div class="export_merge_excel">
        <ExportExcel :isMergeHeader="true" />
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ExportExcel from "./exportExcel.vue";

@Component({
    components: {
        ExportExcel
    }
})
export default class exportMergeExcel extends Vue {

}
</script>