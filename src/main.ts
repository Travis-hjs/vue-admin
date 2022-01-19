import { createApp } from "vue";
import App from "./App.vue";
import SvgIcon from "./icons/index.vue";
import BaseDialog from "./components/base-dialog/index.vue";
// import BaseDialog from "./components/base-dialog/dialog"; // jsx 方式，有问题，具体看组件代码注释
import router from "./router";
import { copyText, isMobile } from "./utils";
import { version } from "../package.json";
import ripple from "./utils/ripple";

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

app.directive("ripple", {
    mounted(el: HTMLElement) {
        /** 添加事件类型 */
        const eventType = isMobile() ? "touchstart" : "mousedown";
        el.setAttribute("ripple", "");
        el.addEventListener(eventType, function (e) {
            ripple(e, el);
        });
    }
})


// 注册全局组件: `svg-icon`
app.component("svg-icon", SvgIcon);
// 基础弹框
app.component("base-dialog", BaseDialog);

app.use(router);

app.mount("#app");
