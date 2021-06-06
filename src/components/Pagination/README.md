# 分页组件

使用示例

```html
<template>
    <div>
        <!-- 默认使用方式 -->
        <Pagination :pageInfo="pageInfo" @change="paginationChange" />
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { PaginationChange } from "@/utils/interfaces";
export default defineComponent({
    components: {
        Pagination
    },
    setup() {
        const pageInfo = reactive({
            pageSize: 10,
            currentPage: 1,
            total: 0,
        })

        function paginationChange(res: PaginationChange) {
            getTableData();
        }

        return {
            pageInfo,
            paginationChange
        }
    }
})
</script>
```