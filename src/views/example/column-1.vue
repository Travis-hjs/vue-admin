<template>
  <div class="column-1">
    <el-alert :closable="false" :title="content" type="success" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class Column1 extends Vue {
  content = "栏目-1";
}
</script>
