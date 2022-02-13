import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VeeValidate from 'vee-validate';
import { ValidationObserver, ValidationProvider, setInteractionMode , extend} from 'vee-validate'
import * as rules from "vee-validate/dist/rules"
import {
  required
} from 'vee-validate/dist/rules';
for (let rule in rules) {
  // add the rule
  if(rule == "is"){
    extend('required', {
      ...required,
      message: 'Password와 일치하지 않습니다.'
    });
  }else{
    extend(rule, rules[rule]);
  }
}
Vue.component("ValidationProvider", ValidationProvider)
Vue.component("ValidationObserver", ValidationObserver)
setInteractionMode('eager')
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  VeeValidate,
  render: (h) => h(App),
}).$mount("#app");
