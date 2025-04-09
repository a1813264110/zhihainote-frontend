import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ArcoVue from "@arco-design/web-vue";
import { createPinia } from "pinia";

const pinia = createPinia();

createApp(App).use(ArcoVue).use(pinia).use(router).mount("#app");
