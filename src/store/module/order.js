import state from "../order/state.js";
import mutations from "../order/mutation.js";
import actions from "../order/action.js";
import getters from "../order/getter.js";

const order = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
};

export default order;
