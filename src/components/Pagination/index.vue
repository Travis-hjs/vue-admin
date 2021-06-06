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
import { defineComponent, PropType } from "vue";
import { PageInfoType } from "@/utils/interfaces";

export default defineComponent({
    props: {
        pageInfo: {
            type: Object as PropType<PageInfoType>,
            default() {
                return {
                    pageSize: 10,
                    total: 0,
                    currentPage: 1,
                }
            }
        },
        pageSizes: {
            type: Array,
            default: () => [10, 30, 100, 200, 300]
        },
        layout: {
            type: String,
            default: "total, sizes, prev, pager, next, jumper"
        },
        position: {
            type: String as PropType<"left" | "right" | "center">,
            default: "center"
        }
    },
    setup(props, context) {
        function onSizeChange(n: number) {
            props.pageInfo.currentPage = 1;
            props.pageInfo.pageSize = n;
            context.emit("change", { type: "pageSize", value: n });
        }
        
        function onCurrentChange(n: number) {
            props.pageInfo.currentPage = n;
            context.emit("change", { type: "currentPage", value: n });
        }

        return {
            onSizeChange,
            onCurrentChange
        }
    }
})
</script>