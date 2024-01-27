import VueCookies from "vue-cookies";

export default {
  setUserInfo(state, payload) {
    state.userInfo = payload;
    if (payload) state.Role = payload.auth;
  },
  tokenSetting(state, payload) {
    if(payload.accesstoken)
      VueCookies.set("AccessToken", payload.accesstoken, "30m", "", "", true);
    if(payload.refreshtoken)
      VueCookies.set("RefreshToken", payload.refreshtoken, "7d", "", "", true);
    if(payload.accessToken)
        VueCookies.set("AccessToken", payload.accessToken, "30m", "", "", true);
    if(payload.refreshToken)
        VueCookies.set("RefreshToken", payload.refreshToken, "7d", "", "", true);
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
