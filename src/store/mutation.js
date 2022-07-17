import http from "../util/http-commons";

export default{
  setToken(state, payload){
    state.token = payload;
    localStorage.setItem("user", JSON.stringify(payload));
    if(payload != ""){
      http.defaults.headers.common[
        "authorization"
        ] = 'Bearer '+payload;
    }else{
      http.defaults.headers.common[
        "authorization"
        ] = "";
    }
  },
  setUserInfo(state, payload){
    state.userInfo = payload;
  },
  setPagination(state, payload){
    state.Pagination = payload;
    state.Pagination.number += 1;
  },
  setSelectMenuCd(state, payload){
    state.selectMenuCd = payload;
  },
  setJJimList(state, payload){
    state.JJimList = payload;
  },
  setBasketList(state, payload){
    var midSum = 0;
    var endSum = 0;
    payload.forEach(function(node){
        midSum = 0;
        node.isSelected = true;
        node.detail.forEach(function(detail){
          midSum += detail.salesPri * detail.basketCnt;
        });
        node.midSum = midSum;
        endSum += midSum;
      }
    );
    payload.endSum = endSum;
    state.BasketList = payload;
  },
  setDetailInfo(state, payload){
    state.DetailInfo = payload;
  },
  setOrderList(state, payload){
    var midCnt = 0;
    var deliPri = 200000;
    var totPri = 0;
    var totDeliPri = 200000;
    var OrderInfo = new Object();
    payload.forEach(function(item){
      midCnt = 0;
      deliPri = 200000;
      if(item.isSelected){
        item.detail.forEach(function(detail){
          midCnt += detail.basketCnt;
          deliPri = Math.min(deliPri,detail.deliPri);
        })
        item.midCnt = midCnt;
        item.deliPri = deliPri;
        totPri += item.midSum+deliPri;
        totDeliPri = Math.min(totDeliPri,deliPri);
      }
    });
    OrderInfo.totPrdPri = totPri;
    OrderInfo.totDeliPri = totDeliPri;
    OrderInfo.totPri = totPri+totDeliPri;
    state.OrderList = payload;
    state.OrderInfo = OrderInfo;
  },
}