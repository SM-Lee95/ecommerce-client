import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import user from "./module/user.js";
import product from "./module/product.js";
import order from "./module/order.js";
import common from "./module/common.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { user: user, product: product, order: order, common: common },
  plugins: [
    createPersistedState({
      paths: ["user"],
    }),
  ],
});
