import http from "../util/http-commons";

export default {
  login(context, data) {
    return http.post("/login", data).then((resp) => {
      JSON.stringify(resp);
      context.commit("setToken", resp.headers.authorization);// 토큰을 적용해준다
      return context.dispatch("getUserInfo", data.id).then(() => {
        return true;
      });
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  signUp(context, data) {
    return http.post("/user/signUp", data).then((resp) => {
      if (resp.data.statusCode == "200") return true;
      if (resp.data.statusCode == "400") return false;
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  existId(context, data) {
    return http.post("/user/existId/" + data).then((resp) => {
      return resp;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  getUserInfo(context, data) {
    return http.get("/user/info/" + data).then((resp) => {
      if (resp.data)
        context.commit("setUserInfo", resp.data);
      else
        return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  updateInfo(context, data) {
    return http.post("/user/info/" + context.state.userInfo.cd, data).then((resp) => {
      if (resp.data.statusCode == "200") return true;
      if (resp.data.statusCode == "400") return false;
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  updatePass(context, data) {
    return http.put("/user/pass", data).then((resp) => {
      if (resp.data.statusCode == "200") return true;
      if (resp.data.statusCode == "400") return false;
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  getMenuList(context) {
    return http.get("/cate/list").then((resp) => {
      if (resp.data){
        context.commit("setMenuList",resp.data);
        return true;
      } else
        return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  getItemList(context, data) {
    // page -> 요청 페이지 번호
    // param -> 메뉴 코드
    if (data.param) context.commit("setSelectMenuCd", data.param);
    var user_cd = context.state.userInfo ? "&user_cd=" + context.state.userInfo.cd : "";
    return http.get("/prd/list/" + context.state.selectMenuCd + "?page=" + data.page + "&size=24" + user_cd).then((resp) => {
      if (resp.data) {
        context.commit("setPagination", resp.data);
        return true;
      } else
        return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  getDetailInfo(context, data) {
    var user_cd = "";
    if (context.state.userInfo)
      user_cd = "?user_cd=" + context.state.userInfo.cd;
    return http.get("/prd/detail/" + data + user_cd).then((resp) => {
      if (resp.data) {
        context.commit("setDetailInfo", resp.data);
        return true;
      }
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  putLike(context, data) {
    return http.get("/prd/like/" + data + "/" + context.state.userInfo.cd).then((resp) => {
      if (resp.data.statusCode == "200") return true;
      if (resp.data.statusCode == "400") return false;
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  getJJimList(context) {
    return http.get("/prd/jjim/list/" + context.state.userInfo.cd).then((resp) => {
      if (resp.data) {
        context.commit("setJJimList", resp.data);
        return true;
      }
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  postBasket(context, data) {
    return http.post("/prd/basket/" + context.state.userInfo.cd, data).then((resp) => {
      if (resp.data.statusCode == "200") return true;
      if (resp.data.statusCode == "400") return false;
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  getBasketList(context) {
    return http.get("/prd/basket/list/" + context.state.userInfo.cd).then((resp) => {
      if (resp.data) {
        context.commit("setBasketList", resp.data);
        return true;
      }
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  delBasketInfo(context, data) {
    return http.delete("/prd/basket/" + context.state.userInfo.cd + "/" + data.prdCd + "/" + data.listCd).then((resp) => {
      if (resp.data.statusCode == "200") return true;
      if (resp.data.statusCode == "400") return false;
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  orderComplete(context, data) {
    return http.post("/ords/items/" + context.state.userInfo.cd, data).then((resp) => {
      if (resp.data.statusCode == "200") return true;
      if (resp.data.statusCode == "400") return false;
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  getMyPageInfo(context, data) {
    return http.get("/ords/list/" + context.state.userInfo.cd, {
      params: {
        procTy: data
      }
    }).then((resp) => {
      if (resp.data) {
        context.commit("setOrderHisList", resp.data);
        if (!data)
          context.commit("setOrderHisSummary", resp.data);
        return true;
      }
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  getOrderDetailInfo(context, data) {
    return http.get("/ords/detail/" + data).then((resp) => {
      if (resp.data) {
        context.commit("setOrderDetailInfo", resp.data);
        return true;
      }
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  insertPrdImg(context, data) {
    return http.post("/prd/img", data).then((resp) => {
      if (resp.data) {
        return resp.data.fullPath;
      } return null;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return null;
    });
  },
  selectAllCommonCode(context){
    return http.get("/common/all").then((resp) => {
      if (resp.data) {
        context.commit("setCommonList", resp.data);
        return true;
      } return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  insertPrdInfo(context, data){
    return http.post("/prd/info",data).then((resp)=>{
      if (resp.data.statusCode == "200") return true;
      if (resp.data.statusCode == "400") return false;
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  insertTraList(context, data){
    return http.post("/tra/list/admin",data).then((resp)=>{
      if (resp.data.statusCode == "200") return true;
      if (resp.data.statusCode == "400") return false;
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  selectPrdList(context, data){
    return http.get("/prd/list/admin",{
      params: data
    }).then((resp)=>{
      if (resp.data) {
        context.commit("setProductList", resp.data);
        return true;
      } return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  deletePrdInfo(context, data) {
    return http.delete("/prd/info/admin",{params: {
      prdCd: data,
      }}).then((resp) => {
      if (resp.data.statusCode == "200") return true;
      if (resp.data.statusCode == "400") return false;
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  updatePrdInfo(context, data) {
    return http.put("/prd/info/admin",data).then((resp) => {
      if (resp.data.statusCode == "200") return true;
      if (resp.data.statusCode == "400") return false;
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  updateOrdsDtlProc(context, data) {
    return http.put("/ords/list/"+data.procTy+"/admin", data.ordsDtlList).then((resp) => {
      if (resp.data.statusCode == "200") return true;
      if (resp.data.statusCode == "400") return false;
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  updateOrdsInfoProc(context, data) {
    return http.put("/ords/info/"+data.procTy+"/admin", data.ordsCd).then((resp) => {
      if (resp.data.statusCode == "200") return true;
      if (resp.data.statusCode == "400") return false;
      return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
  selectOrderMngList(context, data) {
    return http.get("/ords/list/admin",{params: data}).then((resp) => {
      if (resp.data) {
        context.commit("setOrderMngList", resp.data);
        return true;
      } return false;
    }).catch((resp) => {
      console.log("서버오류 \n " + resp);
      return false;
    });
  },
};