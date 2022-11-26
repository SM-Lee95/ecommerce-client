import state from "../product/state.js";
import mutations from "../product/mutation.js";
import actions from "../product/action.js";
import getters from "../product/getter.js";

const product = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
};

export default product;
