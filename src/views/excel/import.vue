<template>
  <div class="excel-import">
    <UploadExcel :onSuccess="onSuccess" :beforeUpload="onBeforeUpload" />
    <div style="height: 20px"></div>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UploadExcel from "@/components/Upload/Excel.vue";

interface UploadResult {
  results: Array<any>;
  header: Array<string>;
}

@Component({
  components: {
    UploadExcel,
  },
})
export default class ImportExcel extends Vue {
  tableData: Array<any> = [];

  tableHeader: Array<string> = [];

  onBeforeUpload(file: File) {
    const maxSize = file.size / 1024 / 1024 < 2;
    if (maxSize) {
      return true;
    }
    this.$message.warning("请不要上传大于 2M 的文件。");
    return false;
  }

  onSuccess(res: UploadResult) {
    this.tableData = res.results;
    this.tableHeader = res.header;
  }
}
</script>
<style lang="scss" scoped>
.excel-import {
  width: 100%;
  .top {
    margin-bottom: 16px;
    .title {
      font-size: 18px;
      color: #555;
      font-weight: bold;
    }
  }
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }

  .drop {
    border: 2px dashed #bbb;
    width: 600px;
    height: 160px;
    line-height: 160px;
    margin: 0 auto;
    font-size: 24px;
    border-radius: 5px;
    text-align: center;
    color: #bbb;
    position: relative;
  }
}
</style>