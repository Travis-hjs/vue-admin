<template>
    <el-pagination
        v-if="pageInfo.total"
        :background="true"
        :layout="layout"
        :total="pageInfo.total"
        :current-page="pageInfo.currentPage"
        :page-sizes="pageSizes"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :style="{ 'text-align': position }"
    ></el-pagination>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

/** 分页器组件`change`回调类型 */
export interface PaginationChange {
    type: "pageSize" | "currentPage",
    value: number
}

export function usePageInfo(size = 10): PageInfo {
    return {
        currentPage: 1,
        pageSize: size,
        total: 0,
    }
}

/** 分页组件 */
@Component({})
export default class Pagination extends Vue {
    @Prop({
        type: Object,
        default: () => usePageInfo()
    })
    pageInfo!: PageInfo;

    @Prop({
        type: Array,
        default: () => [10, 30, 100, 200, 300]
    })
    pageSizes!: Array<number>;

    @Prop({
        type: String,
        default: "total, sizes, prev, pager, next, jumper"
    })
    layout!: string;

    @Prop({
        type: String,
        default: "center"
    })
    position!: "left" | "right" | "center";

    onSizeChange(n: number) {
        this.pageInfo.currentPage = 1;
        this.pageInfo.pageSize = n;
        this.$emit("change", { type: "pageSize", value: n });
    }
    
    onCurrentChange(n: number) {
        this.pageInfo.currentPage = n;
        this.$emit("change", { type: "currentPage", value: n });
    }
}
</script>