<template>
    <div class="column-2">
        <el-alert :closable="false" :title="content" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class Column2 extends Vue {
    content = "栏目-2"
}
</script>

<style>

</style>