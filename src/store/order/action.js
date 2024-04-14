import http from "../../util/http-commons";

export default {
  getMyPageInfo(context, data) {
    return http
      .get("/api/v1/ords/list", {
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
      .post("/api/v1/ords/items", data)
      .then((resp) => {
        if (!resp.data.statusCode) return resp.data;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  getOrderDetailInfo(context, data) {
    return http
      .get("/api/v1/ords/info/" + data)
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
      .post("/api/v1/tra/list/admin", data)
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
      .put("/api/v1/admin/ords/list/" + data.procTy, data.ordsDtlList)
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
      .get("/api/v1/admin/ords/list", { params: data })
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
      .put("/api/v1/ords/info", data)
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
      .get("/api/v1/ords/option/info", data)
      .then((resp) => {
        if (!resp.data.statusCode) {
          resp.data = resp.data.filter(
            (vo) => vo.productKey.listCd != data.params.prdListCd
          );
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
      .put("/api/v1/ords/option/info", data)
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
      .delete("/api/v1/ords/info", data)
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
      .put("/api/v1/ords/confirm", data)
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
      .put("/api/v1/ords/exchange", data)
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
      .put("/api/v1/ords/return/request", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        else return resp.data.message;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  selectTransactionInfo(context, data) {
    return http
      .get("/api/v1/admin/tra/info", data)
      .then((resp) => {
        if (!resp.data.statusCode) {
          context.commit("setTransactionInfo", resp.data);
          return true;
        }
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  insertReviewInfo(context, data) {
    return http
      .post("/api/v1/review/info", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  insertPaymentInfo(context, data) {
    return http
      .post("/api/v1/admin/pay/info", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  insertPaymentInfoByPg(context, data) {
    return http
      .post("/api/v1/pay/info", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  insertFailPaymentLog(context, data) {
    return http
      .post("/api/v1/pay/log", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  updateTransProc(context, data) {
    return http
      .put("/api/v1/admin/tra/list", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  selectTransactionList(context, data) {
    return http
      .get("/api/v1/admin/tra/list", data)
      .then((resp) => {
        if (!resp.data.statusCode) {
          context.commit("setTransactionList", resp.data);
          return true;
        }
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  updateExchangeConfirm(context, data) {
    return http
      .put("/api/v1/ords/exchange/confirm", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  selectCancelRequestInfo(context, data) {
    return http
      .get("/api/v1/ords/return/info", data)
      .then((resp) => {
        if (!resp.data.statusCode) {
          context.commit("setCancelRequestInfo", resp.data);
          return true;
        }
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  insertReturnPaymentInfo(context, data) {
    return http
      .put("/api/v1/ords/return/confirm", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
};
