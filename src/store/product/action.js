import http from "../../util/http-commons";

export default {
  getItemList(context, data) {
    // page -> 요청 페이지 번호
    // param -> 메뉴 코드
    if (data.param == 0 || data.param)
      context.commit("setSelectMenuCd", data.param);
    data.size = 24;
    return http
      .get("/api/v1/prd/list/" + context.getters["selectMenuCd"], { params: data })
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
      .get("/api/v1/prd/detail/" + data)
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
      .get("/api/v1/prd/like/" + data)
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
      .get("/api/v1/prd/like/list")
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
      .post("/api/v1/prd/basket", data)
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
      .get("/api/v1/prd/basket/list")
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
      .delete("/api/v1/prd/basket/" + data.prdCd + "/" + data.listCd)
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
      .post("/api/v1/prd/img", data)
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
      .post("/api/v1/admin/prd/info", data)
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
      .get("/api/v1/admin/prd/list", {
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
      .delete("/api/v1/admin/prd/info", {
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
      .put("/api/v1/admin/prd/info", data)
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
      .post("/api/v1/admin/prd/info/excel", data)
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
      .put("/api/v1/admin/prd/info/statFlag", data)
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
      .get("/api/v1/admin/prd/detail/" + data)
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
      .post("/api/v1/admin/prd/detail/option", data)
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
      .put("/api/v1/admin/prd/detail/statFlag", data)
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
      .put("/api/v1/admin/prd/detail/stockCnt", data)
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
      .get("/api/v1/question/myInfo")
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
      .post("/api/v1/question/info", data)
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
