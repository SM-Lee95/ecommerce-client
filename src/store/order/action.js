import http from "../../util/http-commons";

export default {
  getMyPageInfo(context, data) {
    return http
      .get("/ords/list", {
        params: {
          procTy: data,
        },
      })
      .then((resp) => {
        if (!resp.data.statusCode) {
          context.commit("setOrderHisList", resp.data);
          if (!data) context.commit("setOrderHisSummary", resp.data);
          return true;
        }
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  orderComplete(context, data) {
    return http
      .post("/ords/items", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
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
        if (!resp.data.statusCode) {
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
        if (!resp.data.statusCode) {
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
  updateOrderInfo(context, data) {
    return http
      .put("/ords/info", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  selectItemOptionInfo(context, data) {
    return http
      .get("/ords/option/info", data)
      .then((resp) => {
        if (!resp.data.statusCode) {
          resp.data = resp.data.filter((vo) => {
            //동일옵션 삭제
            if (vo.productKey.listCd == data.params.prdListCd) return false;
            return true;
          });
          context.commit("setOrderUpdateOptionInfo", resp.data);
          return true;
        }
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  updateOrdsProductOption(context, data) {
    return http
      .put("/ords/option/info", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  deleteOrdsInfo(context, data) {
    return http
      .delete("/ords/info", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        else return resp.data.message;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  updateConfirmPurchase(context, data) {
    return http
      .put("/ords/confirm", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        else return resp.data.message;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  updateExchangeRequest(context, data) {
    return http
      .put("/ords/exchange", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        else return resp.data.message;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  updateReturnRequest(context, data) {
    return http
      .delete("/ords/returnRequest", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        else return resp.data.message;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
};
