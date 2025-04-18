import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ArcoVue from "@arco-design/web-vue";
import { createPinia } from "pinia";

// 导入样式，顺序很重要
import "@arco-design/web-vue/dist/arco.css"; // 首先导入Arco基础样式
import "./styles/index.css"; // 然后导入我们的自定义样式

const pinia = createPinia();

createApp(App).use(ArcoVue).use(pinia).use(router).mount("#app");
