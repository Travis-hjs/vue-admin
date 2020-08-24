<template>
    <div class="home">
        <hello-world :msg="content" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "../../components/HelloWorld.vue";

@Component({
    components: {
        "hello-world": HelloWorld
    }
})
export default class Home extends Vue {
    content = "首页";
}
</script>

<style>

</style>