import http from "../util/http-commons";

export default {
  getMenuList(context) {
    return http
      .get("/cate/list")
      .then((resp) => {
        if (resp.data) {
          context.commit("setMenuList", resp.data);
          return true;
        } else return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  selectAllCommonCode(context) {
    return http
      .get("/common/code/list")
      .then((resp) => {
        if (resp.data) {
          context.commit("setCommonList", resp.data);
          return true;
        }
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
};
