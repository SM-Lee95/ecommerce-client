export default {
  setOrderList(state, payload) {
    var midCnt = 0;
    var deliPri = 200000;
    var totPri = 0;
    var totCnt = 0;
    var totDeliPri = 200000;
    var OrderInfo = new Object();
    payload.forEach(function (item) {
      midCnt = 0;
      deliPri = 200000;
      if (item.isSelected) {
        deliPri = Math.min(deliPri, item.deliPri);
        item.detail.forEach(function (detail) {
          midCnt += detail.basketCnt;
        });
        item.midCnt = midCnt;
        item.deliPri = deliPri;
        totCnt += item.midCnt;
        totPri += item.midSum;
        totDeliPri = Math.min(totDeliPri, deliPri);
      }
    });
    OrderInfo.totPrdPri = totPri;
    OrderInfo.totCnt = totCnt;
    OrderInfo.totDeliPri = totDeliPri;
    OrderInfo.totPri = totPri + totDeliPri;
    state.OrderList = payload;
    state.OrderInfo = OrderInfo;
  },
  setOrderHisList(state, payload) {
    state.OrderHisList = payload;
  },
  setOrderHisSummary(state, payload) {
    state.OrderHisSummary = new Object();
    state.OrderHisSummary["주문접수 / 결제완료"] = payload.filter(
      (obj) => obj.procTy == "0" || obj.procTy == "1"
    ).length;
    state.OrderHisSummary["배송준비"] = payload.filter((obj) => obj.procTy == "2").length; //배송준비
    state.OrderHisSummary["배송중"] = payload.filter((obj) => obj.procTy == "3").length; //배송중
    state.OrderHisSummary["배송완료"] = payload.filter((obj) => obj.procTy == "4").length; //배송완료
    state.OrderHisSummary["구매확정"] = payload.filter((obj) => obj.procTy == "5").length; //구매확정
    state.OrderHisSummary["반품신청"] = payload.filter((obj) => obj.procTy == "6").length; //반품신청
    state.OrderHisSummary["교환신청"] = payload.filter((obj) => obj.procTy == "7").length; //교환신청
    state.OrderHisSummary["물품회수"] = payload.filter((obj) => obj.procTy == "8").length; //물품회수
    state.OrderHisSummary["환불완료"] = payload.filter((obj) => obj.procTy == "9").length; //환불완료
    state.OrderHisSummary["주문취소"] = payload.filter((obj) => obj.procTy == "10").length; //주문취소
  },
  setOrderDetailInfo(state, payload) {
    state.OrderDetailInfo = payload;
  },
  setOrderMngList(state, payload) {
    state.OrderMngList = payload;
  },
  setOrderEditObjList(state, payload) {
    state.OrderEditObjList = payload;
  },
  setOrderCancelInfo(state, payload) {
    state.OrderCancelInfo = payload;
  },
  setOrderUpdateOptionInfo(state, payload) {
    state.OrderUpdateOptionInfo = payload;
  },
  setReturnRequestInfo(state, payload) {
    state.ReturnRequestInfo = payload;
  },
  setExchangeRequestInfo(state, payload) {
    state.ExchangeRequestInfo = payload;
  },
  setTransactionInfo(state, payload){
    state.TransactionInfo = payload;
  },
  setTransactionList(state, payload){
    state.TransactionList = payload;
  },
  setReviewWriteItemInfo(state, payload){
    state.ReviewWriteItemInfo = payload;
  },
};
