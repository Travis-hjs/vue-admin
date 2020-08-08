<template>
    <div class="menu-1">
        <el-alert :closable="false" :title="content" type="success" effect="dark" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class Menu1 extends Vue {
    content = "菜单 2-1"
}
</script>

<style>

</style>