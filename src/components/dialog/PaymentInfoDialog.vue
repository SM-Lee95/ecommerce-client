<template>
  <v-container fluid class="white" v-if="paymentObj">
    <v-row class="pa-2">
      <v-col class="mt-1 ml-1 text-h6">결제 내역</v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="pa-2">
      <v-col>
        <v-list class="text-caption">
          <v-list-item>
            <v-list-item-subtitle> 총 상품 개수 </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ paymentObj.totCnt }} 개
            </v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-subtitle> 상품 합계 </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ paymentObj.totPri.comma() }} 원
            </v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-subtitle> 배송비 합계 </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ paymentObj.totDeliPri.comma() }} 원
            </v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-subtitle> 총 합계 </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{
                String(
                  Number(paymentObj.totDeliPri) + Number(paymentObj.totPri)
                ).comma()
              }}
              원
            </v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-subtitle> 결제 내역 </v-list-item-subtitle>
            <v-list-item-title v-if="paymentObj.payDate" class="pa-2">
              결제일 | {{ paymentObj.payDate }}<br />
              결제 방법 | {{ paymentObj.payMtd }}<br />
              결제 금액 | {{ paymentObj.payPri.comma() }}원
            </v-list-item-title>
            <v-list-item-subtitle v-if="!paymentObj.payDate">
              결제 내역이 존재하지 않습니다.
            </v-list-item-subtitle>
          </v-list-item>
        </v-list></v-col
      >
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    paymentObj: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>
