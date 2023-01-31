import axios from "axios";
import store from "../store";
import VueCookies from "vue-cookies";

const createAxios = axios.create({
  // baseURL: "https://port-0-lovane-1jx7m2gldfst07l.gksl2.cloudtype.app/",
  baseURL: "http://localhost:8081/",
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});
//request 설정
createAxios.interceptors.request.use(
  async function (config) {
    config.timeout = 10000;
    config.headers["AccessToken"] = VueCookies.get("AccessToken");
    config.headers["RefreshToken"] = VueCookies.get("RefreshToken");
    return config;
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
      store.commit("user/tokenSetting", response.headers);
      return response;
    } catch (err) {
      console.error("[axios.interceptors.response] response : ", err.message);
    }
  },
  async function (error) {
    try {
      if (error.response.status == 401||error.response.status == 403) { //UNAUTHORIZED , FORBIDDEN
        store.commit("user/removeToken");
        return null;
      }else if(error.response.status == 400){ //로그인 실패(BAD_REQUEST)
        return null;
      }
    } catch (err) {
      console.error("[axios.interceptors.response] error : ", err.message);
    }
    return Promise.reject(error);
  }
);
export default createAxios;
