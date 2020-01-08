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
*{ margin: 0; padding: 0; }
html, body, #app{ width: 100%; height: 100%; padding: 0; margin: 0 }

/* flex布局 */
.flex{ display: flex; flex-wrap: wrap; }
.f1{ flex: 1; }
.f2{ flex: 2; }
.f3{ flex: 3; }
/* 垂直居中 */
.fvertical{ align-items: center; }
/* 水平居中 */
.fcenter{ justify-content: center; }

</style>
