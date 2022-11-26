import state from "../user/state.js";
import mutations from "../user/mutation.js";
import actions from "../user/action.js";
import getters from "../user/getter.js";

const user = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
};

export default user;
