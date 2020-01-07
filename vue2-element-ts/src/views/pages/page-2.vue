<template>
    <div class="page-2">
        <h2>{{ content }}</h2>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class Page2 extends Vue {
    content = 'page-2'
}
</script>

<style>

</style>