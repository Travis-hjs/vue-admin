<template>
    <div class="column-1">
        <el-alert :closable="false" :title="columnInfo.title" type="success" />
        <el-divider content-position="left">响应数据</el-divider>
        <el-card shadow="always">{{ columnInfo }}</el-card>
        <div class="flex fvertical option_box">
            <el-input class="f1" v-model="inputValue" style="margin-right: 16px;" placeholder="请输入内容" clearable></el-input>
            <el-button @click="changeCount()" size="medium" type="primary" icon="el-icon-edit">设置共享数据的 input 值</el-button>
        </div>
        <el-divider content-position="left">hooks 代码</el-divider>
        <el-input type="textarea" v-model="columnInfo.content" :autosize="{ minRows: 26, maxRows: 40}"></el-input>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { columnInfo, updateColumnInfo } from "./hooks";

export default defineComponent({
    setup() {
        const inputValue = ref("");

        function changeCount() {
            updateColumnInfo({
                input: inputValue.value
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
.column-1 {
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