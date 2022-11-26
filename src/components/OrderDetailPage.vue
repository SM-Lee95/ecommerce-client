<template>
  <v-container fluid>
    <v-row>
      <v-col class="text-h6 font-weight-bold">주문 상세 정보</v-col>
    </v-row>
    <v-row>
      <v-col class="text-left"
        >주문 번호 : <b>{{ this.OrderDetailInfo[0].ordsCd }}</b></v-col
      >
      <v-col class="text-right"
        >주문 일자 : <b>{{ this.OrderDetailInfo[0].regDati }}</b></v-col
      >
    </v-row>
    <v-data-table
      :headers="header"
      :items="this.OrderDetailInfo"
      class="elevation-0 mt-2"
      hide-default-footer
      disable-sort
      no-data-text="주문 건이 존재하지 않습니다."
    >
      <template v-slot:item.thumbnail="{ item }">
        <v-img
          :src="item.thumbnail"
          max-height="100%"
          min-height="100%"
          max-width="100"
        ></v-img>
      </template>
      <template v-slot:item.prdInfo="{ item }">
        <v-row no-gutters>
          <v-col class="text-left">
            {{ item.corpNm }}
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="text-left">
            <v-btn text @click="getDetailInfo(item.prdCd)">{{
              item.name
            }}</v-btn>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="text-left">
            옵션 : {{ item.color + " / " + item.size }}
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.originPri="{ item }">
        {{ item.applyPri.comma() + " 원" }}
      </template>
      <template v-slot:item.discountRate="{ item }">
        {{ item.discountRate + " %" }}
      </template>
      <template v-slot:item.salesPri="{ item }">
        {{ item.applyPri.comma() + " 원" }}
      </template>
      <template v-slot:item.cnt="{ item }">
        {{ item.cnt + " 개" }}
      </template>
      <template v-slot:item.subSumPri="{ item }">
        {{ String(Number(item.applyPri) * Number(item.cnt)).comma() + " 원" }}
      </template>
      <template v-slot:item.proc="{ item }">
        <v-btn text @click="getProcAlert(item.procTy)">
          {{ OrderProcList[item.procTy] }}
        </v-btn>
      </template>
    </v-data-table>
    <v-divider></v-divider>
    <v-row class="mt-5 font-weight-bold" no-gutters>
      <v-col cols="6">
        <v-row>
          <v-col class="text-h6"> 배송지 정보 </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-list outlined>
              <v-list-item>
                <v-list-item-subtitle> 이름 </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ this.OrderDetailInfo[0].recvNm }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-subtitle> 연락처 </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ this.OrderDetailInfo[0].recvPhone }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-subtitle> 배송지 주소 </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ this.OrderDetailInfo[0].postcode }}<br />
                  {{ this.OrderDetailInfo[0].mainAddress }}<br />
                  {{ this.OrderDetailInfo[0].etcAddress }}<br />
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-subtitle> 배송 메시지 </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ this.OrderDetailInfo[0].reqMemo }}<br />
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col class="text-h6"> 최종 결제 정보 </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-list outlined="true">
              <v-list-item>
                <v-list-item-subtitle> 총 상품 개수 </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ this.OrderDetailInfo[0].totCnt }} 개
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-subtitle> 상품 합계 </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ this.OrderDetailInfo[0].totPri.comma() }} 원
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-subtitle> 배송비 합계 </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ this.OrderDetailInfo[0].totDeliPri.comma() }} 원
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-subtitle> 총 합계 </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{
                    String(
                      Number(this.OrderDetailInfo[0].totDeliPri) +
                        Number(this.OrderDetailInfo[0].totPri)
                    ).comma()
                  }}
                  원
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "OrderDetailPage",
  data: () => ({
    header: [
      { value: "thumbnail", align: "center" },
      { text: "상품정보", value: "prdInfo", align: "start" },
      { text: "금액", value: "originPri", align: "start" },
      { text: "할인율", value: "discountRate", align: "center" },
      { text: "할인금액", value: "salesPri", align: "start" },
      { text: "수량", value: "cnt", align: "center" },
      { text: "합계금액", value: "subSumPri", align: "start" },
      { text: "주문상태", value: "proc", align: "center" },
    ],
  }),
  computed: {
    ...mapGetters(["OrderDetailInfo", "OrderProcList"]),
  },
  methods: {
    getDetailInfo(cd) {
      this.$store.dispatch("getDetailInfo", cd).then((resp) => {
        if (resp) {
          if (this.$route.path != "/Detail") this.$router.push("/Detail");
        } else
          this.$dialog.message.error(
            "상품 정보를 조회하는 중에 오류가 발생했습니다."
          );
      });
    },
    getProcAlert() {
      this.$dialog.error({
        title: "결제 필요",
        text:
          "<b>계좌로 입금이 완료되지 않았습니다.</b><br/>" +
          "입금 후 확인 부탁드립니다. <br/>" +
          "입금 계좌 : 225050-56-278305 (농협)",
      });
    },
  },
};
</script>

<style scoped>
</style>