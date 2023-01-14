import axios from "axios";
import store from "../store";
import VueCookies from "vue-cookies";

const createAxios = axios.create({
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
      if (error.response.status == 401||error.response.status == 403) {
        store.commit("user/removeToken");
        return null; //다시 axios 요청
      }
    } catch (err) {
      console.error("[axios.interceptors.response] error : ", err.message);
    }
    return Promise.reject(error);
  }
);
export default createAxios;
