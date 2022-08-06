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
          midSum += node.salesPri * ((100-node.discountRate)/100) * detail.basketCnt;
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
    var totCnt = 0;
    var totDeliPri = 200000;
    var OrderInfo = new Object();
    payload.forEach(function(item){
      midCnt = 0;
      deliPri = 200000;
      if(item.isSelected){
        deliPri = Math.min(deliPri,item.deliPri);
        item.detail.forEach(function(detail){
          midCnt += detail.basketCnt;
        })
        item.midCnt = midCnt;
        item.deliPri = deliPri;
        totCnt += item.midCnt;
        totPri += item.midSum;
        totDeliPri = Math.min(totDeliPri,deliPri);
      }
    });
    OrderInfo.totPrdPri = totPri;
    OrderInfo.totCnt = totCnt;
    OrderInfo.totDeliPri = totDeliPri;
    OrderInfo.totPri = totPri+totDeliPri;
    state.OrderList = payload;
    state.OrderInfo = OrderInfo;
  },
  setOrderHisList(state, payload){
    state.OrderHisList = payload;
  },
  setOrderHisSummary(state, payload){
    state.OrderHisSummary = new Object();
    state.OrderHisSummary["주문접수 / 결제완료"] = payload.filter((obj)=>obj.procTy=="000"||obj.procTy=="001").length;
    state.OrderHisSummary["배송준비"] = payload.filter((obj)=>obj.procTy=="002").length;//배송준비
    state.OrderHisSummary["배송중"] = payload.filter((obj)=>obj.procTy=="003").length;//배송중
    state.OrderHisSummary["배송완료"] = payload.filter((obj)=>obj.procTy=="004").length;//배송완료
    state.OrderHisSummary["구매확정"] = payload.filter((obj)=>obj.procTy=="005").length;//구매확정
    state.OrderHisSummary["반품신청"] = payload.filter((obj)=>obj.procTy=="006").length;//반품신청
    state.OrderHisSummary["교환신청"] = payload.filter((obj)=>obj.procTy=="007").length;//교환신청
    state.OrderHisSummary["물품회수"] = payload.filter((obj)=>obj.procTy=="008").length;//물품회수
    state.OrderHisSummary["환불완료"] = payload.filter((obj)=>obj.procTy=="009").length;//환불완료
  }
}