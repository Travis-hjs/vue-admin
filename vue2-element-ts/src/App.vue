<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class App extends Vue {
    
}
</script>

<style lang="scss">
html, body, #app{ width: 100%; height: 100%; padding: 0; margin: 0 }
</style>
