<template>
    <div class="menu-2">
        <el-alert :closable="false" :title="content" type="info" effect="dark" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class Menu2 extends Vue {
    content = "菜单 2-2"
}
</script>

<style>

</style>