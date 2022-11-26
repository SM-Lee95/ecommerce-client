import state from "../state.js";
import mutations from "../mutation.js";
import actions from "../action.js";
import getters from "../getter.js";

const common = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
};

export default common;
