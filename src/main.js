import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { ValidationObserver, ValidationProvider, setInteractionMode, extend } from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import VeeValidate from "vee-validate";
import module from "./util/module";
import VuetifyDialog from "vuetify-dialog";
import CKEditor from "ckeditor4-vue";
import VueCookies from "vue-cookies";

/** Validation Rule */
for (let rule in rules) {
  extend(rule, rules[rule]);
}
extend("existId", {
  validate(value) {
    return store.dispatch("user/existId", value).then((resp) => {
      if (resp.data.statusCode == "200") return true;
      return false;
    });
  },
  message: "존재하는 아이디입니다. 다른 아이디를 입력해주세요.",
});
extend("fileSize", {
  validate(value) {
    return !value || value.size < 5000000 ? true : false;
  },
  message: "파일 크기는 5MB 이하로 등록해주세요.",
});

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
setInteractionMode("eager");

/** Registration */
Vue.config.productionTip = false;
Vue.use(module);
Vue.use(VuetifyDialog, {
  context: {
    vuetify,
  },
});
Vue.use(CKEditor);
Vue.use(VueCookies);
Vue.$cookies.config("7d");
/** Object prototype */
String.prototype.comma = function () {
  return String(this).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
};
String.prototype.uncomma = function () {
  return String(this).replace(/[^\d]+/g, "");
};
Date.prototype.YYYYMMDDHHMMSS = function () {
  var yyyy = this.getFullYear().toString();
  var MM = this.getMonth() + 1;
  var dd = this.getDate();
  var hh = this.getHours();
  var mm = this.getMinutes();
  var ss = this.getSeconds();
  return yyyy + MM + dd + hh + mm + ss;
};

new Vue({
  router,
  store,
  vuetify,
  VeeValidate,
  render: (h) => h(App),
}).$mount("#app");
