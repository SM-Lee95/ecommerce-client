import VueCookies from "vue-cookies";

export default {
  getUserInfo(state) {
    return state.userInfo;
  },
  //쿠키에 저장된 토큰 가져오기
  getToken() {
    return {
      access: VueCookies.get("AccessToken"),
      refresh: VueCookies.get("RefreshToken"),
    };
  },
};
