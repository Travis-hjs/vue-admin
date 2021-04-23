import { createApp } from "vue";
import App from "./App.vue";
import SvgIcon from "./icons/index.vue"; 
import router from "./router";
import utils from "./utils";
import ElementUI from "element-plus";
// element-variables.scss里面已经引入了，所以这里可以不用
// import "element-ui/lib/theme-chalk/index.css";
import "./styles/element-variables.scss";
import "./styles/index.scss";

const { version } = require("../package.json");

window.version = version;

const app = createApp(App);

// 注册全局组件: `svg-icon`
app.component("svg-icon", SvgIcon);

// 添加一个自定义指令`v-copy`点击复制内容
app.directive("copy", {
    mounted(el: HTMLElement, binding) {
        el.addEventListener("click", function () {
            utils.copyText(binding.value, () => utils.showMessage.success("复制成功"), tip => utils.showMessage.warning(tip));
        });
    }
})

app.use(ElementUI);

app.use(router);

app.mount("#app");
