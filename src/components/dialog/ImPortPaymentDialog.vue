<template>
  <v-container>
    <button @click="requestPay">결제하기</button>
  </v-container>
</template>
<script>
export default {
  props: {
    payment: {
      type: Object,
      required: true,
    },
  },
  methods: {
    requestPay: function () {
      const IMP = window.IMP; // 생략 가능
      IMP.init("imp82167506");
      IMP.request_pay(
        {
          pg: "html5_inicis.INIpayTest",
          pay_method: "card",
          merchant_uid: this.payment.uid, // 프론트에서 채번후 인증 완료시 서버로 송부해서 별도 저장
          name: this.payment.prdNm,
          amount: this.payment.totPri,
          buyer_email: this.payment.email,
          buyer_name: this.payment.name,
          buyer_tel: this.payment.phone,
          buyer_addr: this.payment.address,
          buyer_postcode: this.payment.postcode,
        },
        this.callback
      );
    },
    callback(response) {
      const { success, error_msg } = response;
      if (success) {
        this.insertPayment(response);
      } else {
        this.$dialog.message.error(
          `PG 결제 진행에 실패하였습니다. 
           ${error_msg}
           같은 현상이 지속적으로 발생시에 관리자에 연락바랍니다.`
        );
        this.insertFailPaymentLog(response);
      }
    },
    insertPayment(respObj) {
      let reqData = {
        ordsCd: this.payment.uid,
        payDate: new Date(Date.now()).toISOString().substr(0, 10),
        payPri: respObj.paid_amount,
        paidAmount: respObj.paid_amount,
        payMtd: "CARD",
        pgType: respObj.pg_type,
        status: respObj.status,
        merchantUid: respObj.merchant_uid,
        paidAt: respObj.paid_at,
        pgTid: respObj.pg_tid,
        receiptUrl: respObj.receipt_url,
        applyNum: respObj.apply_num,
        impUid: respObj.imp_uid,
        name: respObj.name,
      };
      this.$store
        .dispatch("order/insertPaymentInfoByPg", reqData)
        .then((resp) => {
          if (resp) {
            this.$dialog.message.info("결제 등록이 완료되었습니다.");
          } else {
            this.$dialog.message.error(
              "결제는 성공했으나 시스템 등록에 문제가 발생했습니다. 관리자에 연락바랍니다."
            );
          }
          this.$emit("close");
        });
    },
    insertFailPaymentLog(respObj) {
      let reqData = {
        pgType: respObj.pg_type,
        status: respObj.status,
        errorCode: respObj.error_code,
        errorMsg: respObj.error_msg,
        merchantUid: respObj.merchant_uid,
        impUid: respObj.imp_uid,
      };
      this.$store.dispatch("order/insertFailPaymentLog", reqData);
    },
  },
};
</script>
