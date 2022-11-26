import http from "../util/http-commons";
import VueCookies from "vue-cookies";

export default {
  setToken(state, payload) {
    state.token = payload;
    localStorage.setItem("user", JSON.stringify(payload));
    if (payload != "") {
      http.defaults.headers.common["authorization"] = "Bearer " + payload;
    } else {
      http.defaults.headers.common["authorization"] = "";
    }
  },
  setUserInfo(state, payload) {
    state.userInfo = payload;
    if (payload) state.Role = payload.auth;
  },
  tokenSetting(state, payload) {
    VueCookies.set("AccessToken", payload.accessToken, "60s");
    VueCookies.set("RefreshToken", payload.refreshToken, "1h");
    state.accessToken = payload.accessToken;
    state.refreshToken = payload.refreshToken;
  },
  removeToken() {
    VueCookies.remove("AccessToken");
    VueCookies.remove("RefreshToken");
    location.reload();
  },
};
