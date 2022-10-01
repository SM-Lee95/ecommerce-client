export default {
  Title: "PlumGreenTea",
  token: "",
  userInfo: null,
  Role:null,
  Pagination: null, //Item List
  selectMenuCd: 1, //처음 All
  JJimList: null, //JJim List
  DetailInfo: null, //상세 내역
  BasketList: null, //장바구니
  OrderList: null, //주문 시도 목록
  OrderInfo: null, //주문 시도 정보
  OrderHisList: null, //주문내역정보
  OrderHisSummary: null, //주문내역요약정보
  OrderDetailInfo: null, //주문내역상세정보
  OrderProcList: { //주문상태정보리스트
    "0": "주문접수",
    "1": "결제완료",
    "3": "배송중",
    "2": "배송준비",
    "4": "배송완료",
    "5": "구매확정",
    "6": "반품신청",
    "7": "교환신청",
    "8": "물품회수",
    "9": "환불완료"
  },
  EditorHTML: null, //Editor 내용
  SizeList: null, //사이즈코드리스트
  ColorList: null, //컬러코드리스트
  MenuList: null, //메뉴리스트
  CateList: null, //카테고리리스트
  ProcList: null, //주문상태정보리스트
  DeliList: null, //택배회사리스트
  ProductList: null, //관리자 상품 조회 리스트
  OrderMngList: null, //관리자 주문 조회 리스트
};