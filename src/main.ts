import { createApp } from "vue";
import App from "./App.vue";
import { registerPlugins } from "./utils/plugins";

import "./styles/tailwind.css";
import "./styles/index.scss";
import "./styles/element-plus.scss";

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
