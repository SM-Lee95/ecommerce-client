import http from "../../util/http-commons";

export default {
  login(context, data) {
    return http
      .post("/login", data)
      .then((resp) => {
        if (!resp) return false;
        context.commit("tokenSetting", resp.headers);
        return context.dispatch("getMyUserInfo").then(() => {
          return true;
        });
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  signUp(context, data) {
    return http
      .post("/user/myInfo", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        if (resp.data.statusCode == "400") return false;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  existId(context, data) {
    return http
      .get("/user/existId/" + data)
      .then((resp) => {
        return resp;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  getMyUserInfo(context) {
    return http
      .get("/user/myInfo")
      .then((resp) => {
        if (resp.data) {
          context.commit("setUserInfo", resp.data);
          return true;
        } else return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  updateInfo(context, data) {
    return http
      .put("/user/myInfo", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        if (resp.data.statusCode == "400") return false;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  updatePass(context, data) {
    return http
      .put("/user/myInfo/pass", data)
      .then((resp) => {
        console.log(resp);
        if (resp.data.statusCode == "200") return true;
        if (resp.data.statusCode == "400") return false;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  selectUserList(context, data) {
    return http
      .get("/user/list/admin", data)
      .then((resp) => {
        if (resp.data) {
          context.commit("setUserList", resp.data);
          return true;
        } else return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
};
