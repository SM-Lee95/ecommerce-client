export default {
  EditorHTML: null, //Editor 내용
  SizeList: null, //사이즈코드리스트
  ColorList: null, //컬러코드리스트
  MenuList: null, //메뉴리스트
  CateList: null, //카테고리리스트
  OrderProcList: {
    //주문상태정보리스트
    0: "주문접수",
    1: "결제완료",
    2: "배송준비",
    3: "배송중",
    4: "배송완료",
    5: "구매확정",
    6: "반품신청",
    7: "교환신청",
    8: "물품회수",
    9: "환불완료",
    10: "주문취소",
    11: "검수완료",
  },
  ProcList: null, //주문상태정보리스트
  DeliList: null, //택배회사리스트
  BankList: null, //은행리스트
  MailAuthTy: 0, //메일 dialog 타입 0 -> 회원가입 1 -> 비밀번호찾기
  AnswerWriteInfo: null,
  QnaList: [],
  SelectedMenu: null,
};
