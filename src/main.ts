import { createApp } from "vue";
import App from "./App.vue";
import { registerPlugins } from "./utils/plugins";

import "./styles/index.scss";
import "./styles/tailwind.css";

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
