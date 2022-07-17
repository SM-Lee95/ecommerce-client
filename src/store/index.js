import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import state from "./state.js";
import mutations from "./mutation.js";
import actions from "./action.js";
import getters from "./getter.js";
import modules from "./module.js";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()]
  ,
  //상태값
  state,
  //
  getters,
  mutations,
  actions,
  modules,
});
