import { createApp } from "vue";
import App from "./App.vue";
import { registerPlugins } from "./utils/plugins";

import "./styles/index.scss";
import "element-plus/dist/index.css";
import "./styles/element-plus.scss";
import "./styles/tailwind.css";

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
