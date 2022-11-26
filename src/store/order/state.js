export default {
  OrderList: null, //주문 시도 목록
  OrderInfo: null, //주문 시도 정보
  OrderHisList: null, //주문내역정보
  OrderHisSummary: null, //주문내역요약정보
  OrderDetailInfo: null, //주문내역상세정보
  OrderProcList: {
    //주문상태정보리스트
    0: "주문접수",
    1: "결제완료",
    3: "배송중",
    2: "배송준비",
    4: "배송완료",
    5: "구매확정",
    6: "반품신청",
    7: "교환신청",
    8: "물품회수",
    9: "환불완료",
  },
  ProcList: null, //주문상태정보리스트
  DeliList: null, //택배회사리스트
  OrderMngList: null, //관리자 주문 조회 리스트
  OrderEditObjList: null, //주문 수정 리스트
};
