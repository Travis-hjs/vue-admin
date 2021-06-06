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
import { PageInfoType } from "@/utils/interfaces";

/** 分页组件 */
@Component({})
export default class Pagination extends Vue {
    @Prop({
        type: Object,
        default() {
            return {
                pageSize: 10,
                total: 0,
                currentPage: 1,
            }
        }
    })
    pageInfo!: PageInfoType;

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