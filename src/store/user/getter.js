import VueCookies from "vue-cookies";

export default {
  Role(state) {
    return state.Role;
  },
  UserInfo(state) {
    return state.userInfo;
  },
  getToken() {
    return {
      access: VueCookies.get("AccessToken"),
      refresh: VueCookies.get("RefreshToken"),
    };
  },
};
