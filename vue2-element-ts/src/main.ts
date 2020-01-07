import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './icons';
import './router/permission';
import './styles/element-variables.scss';
import './styles/index.scss';

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
