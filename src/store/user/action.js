import http from "../../util/http-commons";

export default {
  login(context, data) {
    return http
      .post("/api/v1/login", data)
      .then((resp) => {
        if (!resp) return false;
        return context.dispatch("getMyUserInfo").then((resp) => {
          return resp;
        });
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  signUp(context, data) {
    return http
      .post("/api/v1/user/myInfo", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  existId(context, data) {
    return http
      .get("/api/v1/user/existId/" + data)
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
      .get("/api/v1/user/myInfo")
      .then((resp) => {
        if (!resp.data.statusCode) {
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
      .put("/api/v1/user/myInfo", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  updatePass(context, data) {
    return http
      .put("/api/v1/user/myInfo/pass", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  updateEmailPass(context, data) {
    return http
      .put("/api/v1/user/email/pass", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  selectUserList(context, data) {
    return http
      .get("/api/v1/admin/user/list", data)
      .then((resp) => {
        if (!resp.data.statusCode) {
          context.commit("setUserList", resp.data);
          return true;
        } else return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  emailAuth(context, data) {
    return http
      .post("/api/v1/mailing/emailAuth", data)
      .then((resp) => {
        return resp;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  emailPass(context, data) {
    return http
      .post("/api/v1/mailing/emailPass", data)
      .then((resp) => {
        return resp;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  emailId(context, data) {
    return http
      .post("/api/v1/mailing/emailId", data)
      .then((resp) => {
        return resp;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  compAuth(context, data) {
    return http
      .get("/api/v1/mailing/comp/" + data.authId, {
        params: { authNumber: data.authNum },
      })
      .then((resp) => {
        return resp;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  selectUserIdFromEmail(context, data) {
    return http
      .get("/api/v1/user/email/id", data)
      .then((resp) => {
        return resp;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  updatePassToInit(context, data) {
    return http
      .put("/api/v1/admin/user/pass", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  kakaoLogin(context, data) {
    return http
      .post("/auth/kakao", data)
      .then((resp) => {
        if (!resp.body) {
          context.commit("tokenSetting", resp.data);
          return context.dispatch("getMyUserInfo").then((resp) => {
            return resp;
          });
        }
        else return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n" + resp);
        return false;
      });
  },
};
