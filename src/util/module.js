const methods = {
  daumPostCode: function () {
    this.isModi = true;
    var width = 500; //팝업의 너비
    var height = 600; //팝업의 높이
    new window.daum.Postcode({
      width: width, //생성자에 크기 값을 명시적으로 지정해야 합니다.
      height: height,
      oncomplete: (data) => {
        if (this.etcAddress !== "") {
          this.etcAddress = "";
        }
        if (data.userSelectedType === "R") {
          // 사용자가 도로명 주소를 선택했을 경우
          this.mainAddress = data.roadAddress;
        } else {
          // 사용자가 지번 주소를 선택했을 경우(J)
          this.mainAddress = data.jibunAddress;
        }

        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
        if (data.userSelectedType === "R") {
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            this.etcAddress += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if (data.buildingName !== "" && data.apartment === "Y") {
            this.etcAddress +=
              this.etcAddress !== ""
                ? `, ${data.buildingName}`
                : data.buildingName;
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if (this.etcAddress !== "") {
            this.etcAddress = `(${this.etcAddress})`;
          }
        } else {
          this.etcAddress = "";
        }
        // 우편번호를 입력한다.
        this.postcode = data.zonecode;
      },
    }).open({
      left: window.screen.width / 2 - width / 2,
      top: window.screen.height / 2 - height / 2,
    });
  },
  deliInfoPopup: function(traCd) {
    window.open(
      "http://nplus.doortodoor.co.kr/web/detail.jsp?slipno=" + traCd,
      ""
    );
  },
};
export default {
  install(Vue) {
    Vue.prototype.$daumPostCode = methods.daumPostCode;
    Vue.prototype.$deliInfoPopup =  methods.deliInfoPopup;
  },
};
