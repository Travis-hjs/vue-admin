# Element-UI 分页组件

使用示例

```html
<template>
  <div>
    <!-- 默认使用方式 -->
    <Pagination :pageInfo="pageInfo" @change="paginationChange" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Pagination, { usePageInfo, PaginationChange } from "@/components/Pagination/index.vue";

@Component({
  components: {
    Pagination
  }
})
export default class Demo extends Vue {
  pageInfo = usePageInfo();

  /**
   * 分页变动
   * @param res
   */
  paginationChange(res: PaginationChange) {
    this.getTableData();
  }
}
</script>
```