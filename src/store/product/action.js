import http from "../../util/http-commons";

export default {
  getItemList(context, data) {
    // page -> 요청 페이지 번호
    // param -> 메뉴 코드
    if (data.param == 0 || data.param)
      context.commit("setSelectMenuCd", data.param);
    data.size = 24;
    return http
      .get("/prd/list/" + context.getters["selectMenuCd"], { params: data })
      .then((resp) => {
        if (!resp.data.statusCode) {
          context.commit("setPagination", resp.data);
          return true;
        } else return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  getDetailInfo(context, data) {
    return http
      .get("/prd/detail/" + data)
      .then((resp) => {
        if (!resp.data.statusCode) {
          context.commit("setDetailInfo", resp.data);
          return true;
        }
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  putLike(context, data) {
    return http
      .get("/prd/like/" + data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  getJJimList(context) {
    return http
      .get("/prd/like/list")
      .then((resp) => {
        if (!resp.data.statusCode) {
          context.commit("setJJimList", resp.data);
          return true;
        }
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  postBasket(context, data) {
    return http
      .post("/prd/basket", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  getBasketList(context) {
    return http
      .get("/prd/basket/list")
      .then((resp) => {
        if (!resp.data.statusCode) {
          context.commit("setBasketList", resp.data);
          return true;
        }
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  delBasketInfo(context, data) {
    return http
      .delete("/prd/basket/" + data.prdCd + "/" + data.listCd)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
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
  insertPrdImg(context, data) {
    return http
      .post("/prd/img", data)
      .then((resp) => {
        if (resp.data) {
          return resp.data.fullPath;
        }
        return null;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return null;
      });
  },
  insertPrdInfo(context, data) {
    return http
      .post("/prd/info/admin", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  selectPrdList(context, data) {
    return http
      .get("/prd/list/admin", {
        params: data,
      })
      .then((resp) => {
        if (!resp.data.statusCode) {
          context.commit("setProductList", resp.data);
          return true;
        }
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  deletePrdInfo(context, data) {
    return http
      .delete("/prd/info/admin", {
        params: {
          prdCd: data,
        },
      })
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  updatePrdInfo(context, data) {
    return http
      .put("/prd/info/admin", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  insertExcelProduct(context, data) {
    return http
      .post("/prd/info/admin/excel", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  toggleStatFlag(context, data) {
    return http
      .put("/prd/info/admin/statFlag", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  selectProductDetailInfoForUpdate(context, data) {
    return http
      .get("/prd/detail/admin/" + data)
      .then((resp) => {
        if (!resp.data.statusCode) {
          context.commit("setEditProductDetail", resp.data);
          return true;
        }
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  insertProductOption(context, data) {
    return http
      .post("/prd/detail/admin/option", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  updateProductDetailStatFlag(context, data) {
    return http
      .put("/prd/detail/admin/statFlag", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  updateProductDetailStockCnt(context, data) {
    return http
      .put("/prd/detail/admin/stockCnt", data)
      .then((resp) => {
        if (resp.data.statusCode == "200") return true;
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  selectMyQnaInfoList(context) {
    return http
      .get("/question/myInfo")
      .then((resp) => {
        if (!resp.data.statusCode) {
          context.commit("setQnaDetailInfo", resp.data);
          return true;
        }
        return false;
      })
      .catch((resp) => {
        console.log("서버오류 \n " + resp);
        return false;
      });
  },
  insertQuestionInfo(context, data) {
    return http
      .post("/question/info", data)
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
