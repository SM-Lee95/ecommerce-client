import http from "../util/http-commons";

export default {
  orderComplete(context, data) {
    return http
      .post("/ords/items", data)
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
  getOrderDetailInfo(context, data) {
    return http
      .get("/ords/info/" + data)
      .then((resp) => {
        if (resp.data) {
          context.commit("setOrderDetailInfo", resp.data);
          return true;
        }
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  insertTraList(context, data) {
    return http
      .post("/tra/list/admin", data)
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
  updateOrdsDtlProc(context, data) {
    return http
      .put("/ords/list/" + data.procTy + "/admin", data.ordsDtlList)
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
  updateOrdsInfoProc(context, data) {
    return http
      .put("/ords/info/" + data.procTy + "/admin", data.ordsCd)
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
  selectOrderMngList(context, data) {
    return http
      .get("/ords/list/admin", { params: data })
      .then((resp) => {
        if (resp.data) {
          context.commit("setOrderMngList", resp.data);
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
