<template>
  <v-container fluid class="white">
    <v-row no-gutters>
      <v-col>
        <v-row class="mt-1">
          <v-col class="mt-1 ml-1 text-h6">주문 옵션 교환 요청</v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="ml-2 mr-2">
            <v-card-text>
              Option
              <v-chip-group
                v-model="optionVal"
                active-class="deep-purple accent-4 white--text"
              >
                <v-chip
                  v-for="vo in OrderUpdateOptionInfo"
                  :key="vo.productKey.listCd"
                >
                  {{ vo.size.name }}-{{ vo.color.name }}
                </v-chip>
              </v-chip-group>
              <v-divider class="mx-4"></v-divider>
            </v-card-text>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="text-right">
            <v-btn @click="updateInfo" text>
              신청
              <v-icon color="gray darken-2">mdi-content-save-move</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "ExchangeRequestDialog.vue",
  data: () => ({
    optionVal: null,
  }),
  computed: {
    ...mapGetters("order", ["OrderUpdateOptionInfo"]),
  },
  methods: {
    updateInfo() {
      if (!this.optionVal && this.optionVal != "0") {
        this.$dialog.message.error("옵션을 선택한 후에 진행해주세요.");
        return;
      }
      let text = "<b>"+this.OrderUpdateOptionInfo[this.optionVal].size.name + "-" + this.OrderUpdateOptionInfo[this.optionVal].color.name;
          text += "</b> 옵션으로 교환 요청하시겠습니까?";
          text += "<br/>배송드린 상품은 하기 배송지로 배송 부탁드립니다.";
          text += "<br/>상품 확인 후 교환 옵션으로 배송될 예정입니다.";
          text += "<br/>교환 제품 배송비는 배송시 동봉 부탁드립니다. (3,000원)";
          text += "<br/>배송지 : <b>서울 광진구 능동로55길 45 퍼시픽빌리지 C동 301호</b>";
      this.$dialog
        .confirm({
          title: "주문 옵션 교환 요청",
          text: text,
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let reqData = this.OrderUpdateOptionInfo[this.optionVal];
          this.$store
            .dispatch("order/updateExchangeRequest", reqData)
            .then((resp) => {
              if (resp) {
                this.$dialog.message.info("교환 요청 완료됐습니다..");
                this.$store.dispatch(
                  "order/getOrderDetailInfo",
                  this.OrderUpdateOptionInfo[this.optionVal].ordsCd
                );
                this.$emit("close");
              } else this.$dialog.message.error("요청에 실패하였습니다.");
            });
        });
    },
  },
};
</script>
