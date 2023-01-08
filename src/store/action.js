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
      .get("/common/code/all")
      .then((resp) => {
        if (resp.data) {
          context.commit("setSizeList", resp.data.sizeList);
          context.commit("setColorList", resp.data.colorList);
          context.commit("setCateList", resp.data.cateList);
          context.commit("setProcList", resp.data.procList);
          context.commit("setDeliList", resp.data.deliList);
          context.commit("setBankList", resp.data.bankList);
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
