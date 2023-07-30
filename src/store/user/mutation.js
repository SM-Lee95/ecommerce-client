import VueCookies from "vue-cookies";

export default {
  setUserInfo(state, payload) {
    state.userInfo = payload;
    if (payload) state.Role = payload.auth;
  },
  tokenSetting(state, payload) {
    VueCookies.set("AccessToken", payload.accesstoken, "2m", "", "", true);
    VueCookies.set("RefreshToken", payload.refreshtoken, "1h", "", "", true);
    state.accessToken = payload.accesstoken;
    state.refreshToken = payload.refreshtoken;
  },
  removeToken(state) {
    VueCookies.remove("AccessToken");
    VueCookies.remove("RefreshToken");
    state.userInfo = null;
    location.replace("/");
  },
  setUserList(state, payload) {
    state.UserList = payload;
  },
};
