import Vue from "vue2";
import App from "./index.vue";
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);

new Vue({
  render: h => h(App),
}).$mount("#app");