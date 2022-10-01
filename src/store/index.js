import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import state from "./state.js";
import mutations from "./mutation.js";
import actions from "./action.js";
import getters from "./getter.js";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state,
  getters,
  mutations,
  actions
});
