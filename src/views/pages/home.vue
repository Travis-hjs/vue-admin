<template>
    <div class="home">
        <HelloWorld :msg="content" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "../../components/HelloWorld.vue";

@Component({
    components: {
        HelloWorld
    }
})
export default class Home extends Vue {
    content = "首页";
}
</script>

<style>

</style>