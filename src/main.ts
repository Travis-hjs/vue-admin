import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { copyText } from "./utils";
import { version } from "../package.json";

window.version = version;

const app = createApp(App);

// 添加一个自定义指令`v-copy`点击复制内容
app.directive("copy", {
    mounted(el: HTMLElement, binding) {
        el.addEventListener("click", function () {
            copyText(binding.value, () => alert("复制成功"), tip => alert(tip));
        });
    }
})

app.use(router);

app.mount("#app");
