<template>
    <div class="column-1">
        <el-alert :closable="false" :title="columnInfo.title" type="success" />
        <el-divider content-position="left">响应数据</el-divider>
        <el-card shadow="always">{{ columnInfo }}</el-card>
        <div class="flex fvertical option_box">
            <el-input-number class="f1" size="medium" style="margin-right: 16px;" v-model="inputValue" @change="changeCount" :min="1" :max="100" label="请输入数字"></el-input-number>
            <el-tag type="success">更改 columnInfo.count 的值</el-tag>
        </div>
        <el-link :href="columnInfo.link" type="primary">同样的，vue 2.x 也可以使用这种模式，具体参考这篇文章</el-link>
        <el-divider content-position="left">hooks 代码</el-divider>
        <el-input type="textarea" v-model="columnInfo.content" :autosize="{ minRows: 26, maxRows: 40}"></el-input>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { columnInfo, updateColumnInfo } from "./hooks";

export default defineComponent({
    setup() {
        const inputValue = ref(0);

        function changeCount() {
            updateColumnInfo({
                count: inputValue.value
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