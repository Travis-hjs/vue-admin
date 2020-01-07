<template>
    <div class="page-3">
        <h2>{{ content }}</h2>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class Page3 extends Vue {
    content = 'page-3'
}
</script>

<style>

</style>