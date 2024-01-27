import axios from "axios";
import store from "../store";
import VueCookies from "vue-cookies";

const baseURL = window.location.protocol + "//" + window.location.host;
//"http://www.lovane.store/";
const createAxios = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});
const apiURL = baseURL;
const authURL = "https://lovane.store:8082/";
//request 설정
createAxios.interceptors.request.use(
  async function (confi) {
    if (confi.url == "/auth/kakao") confi.baseURL = authURL;
    else confi.baseURL = apiURL;
    console.log(confi);
    if (!confi.sent && VueCookies.get("AccessToken")) {
      confi.headers["RefreshToken"] = "";
      confi.headers["AccessToken"] = VueCookies.get("AccessToken");
    }
    return confi;
  },
  function (error) {
    console.log("Axios Request Error : ", error);
    return Promise.reject(error);
  }
);
//response 설정
createAxios.interceptors.response.use(
  function (response) {
    try {
      response.config.sent = false;
      store.commit("user/tokenSetting", response.headers);
      return response;
    } catch (err) {
      console.error("[axios.interceptors.response] response : ", err.message);
    }
  },
  async function (error) {
    try {
      const {
        config,
        response: { status },
      } = error;
      if (status == 400) {
        //로그인 실패(BAD_REQUEST)
        return null;
      }
      if ((status !== 401 && status !== 403) || config.sent) {
        store.commit("user/removeToken");
        return Promise.reject(error);
      } else {
        config.sent = true;
        config.headers["AccessToken"] = "";
        config.headers["RefreshToken"] = VueCookies.get("RefreshToken");
        return createAxios(config);
      }
    } catch (err) {
      console.error("[axios.interceptors.response] error : ", err.message);
    }
    return Promise.reject(error);
  }
);
export default createAxios;
