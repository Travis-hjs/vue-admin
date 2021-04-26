<template>
    <div class="column-2">
        <el-alert :closable="false" :title="columnInfo.title" />
        <el-divider content-position="left">响应数据</el-divider>
        <el-card shadow="always">{{ columnInfo }}</el-card>
        <div class="flex fvertical option_box">
            <el-input class="f1" v-model="inputValue" style="margin-right: 16px;" placeholder="请输入内容" clearable></el-input>
            <el-button @click="changeCount()" size="medium" type="primary" icon="el-icon-edit">设置共享数据的 title 值</el-button>
        </div>
        <el-link :href="columnInfo.link" type="primary">同样的，vue 2.x 也可以使用这种模式，具体参考这篇文章</el-link>
        <el-divider content-position="left">hooks 代码</el-divider>
        <el-input type="textarea" v-model="columnInfo.content" :autosize="{ minRows: 26, maxRows: 40}"></el-input>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { columnInfo, updateColumnInfo } from "./hooks";
import utils from "@/utils";

export default defineComponent({
    setup() {
        const inputValue = ref("");

        function changeCount() {
            if (!inputValue.value.trim()) return utils.showWarning("输入不能为空！");
            updateColumnInfo({
                title: inputValue.value
            })
        }

        return {
            columnInfo,
            changeCount,
            inputValue
        }
    }
})
</script>
<style lang="scss">
.column-2 {
    .el-alert {
        margin-bottom: 20px;
    }
    .option_box {
        width: 100%;
        max-width: 480px;
        margin-bottom: 20px;
    }
    .el-card {
        margin-bottom: 20px;
    }
}
</style>