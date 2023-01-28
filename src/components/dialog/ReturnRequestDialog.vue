<template>
  <v-container fluid class="white">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-row no-gutters>
        <v-col>
          <v-row class="mt-1">
            <v-col class="mt-1 ml-1 text-h6">반품 요청</v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col class="text-center">
              배송드린 상품은 하기 배송지로 배송 부탁드립니다.
              <br />상품 확인 후 환불 예정입니다.
              <br />배송지 : <b class="red--text">서울 광진구 능동로55길 45 퍼시픽빌리지 C동 301호</b>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col class="ml-2 mr-2">
              <validation-provider v-slot="{ errors }" name="Account" rules="required|max:16|numeric">
                <v-text-field v-model="returnAccount" :counter="16" :error-messages="errors" label="계좌번호(only number)"
                  required></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="AccountHolder" rules="required|max:16">
                <v-text-field v-model="accountHolder" :counter="16" :error-messages="errors" label="예금주"
                  required></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="Bank" rules="required">
                <v-select :items="BankList" item-text="name" item-value="commonKey.commCd" label="은행"
                  v-model="returnBank" :error-messages="errors"></v-select>
              </validation-provider>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col class="text-right">
              <v-btn @click="returnRequest" text :disabled="invalid">
                신청
                <v-icon color="gray darken-2">mdi-content-save-move</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </validation-observer>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "OrderCancelDialog",
  data: () => ({
    returnAccount: "",
    returnBank: "",
    accountHolder: "",
  }),
  computed: {
    ...mapGetters("order", ["OrderCancelInfo"]),
    ...mapGetters("common", ["BankList"]),
  },
  methods: {
    returnRequest() {
      let cancelObj = new Object();
      cancelObj.ordsCd = this.OrderCancelInfo.ordsCd;
      cancelObj.listCd = this.OrderCancelInfo.listCd;
      cancelObj.procTy = this.OrderCancelInfo.procTy;
      cancelObj.returnAccount = this.returnAccount;
      cancelObj.returnBank = this.returnBank;
      cancelObj.accountHolder = this.accountHolder;
      cancelObj.prdCd = this.OrderCancelInfo.prdCd;
      cancelObj.prdListCd = this.OrderCancelInfo.prdListCd;
      let text = "환불 받으실 계좌번호는 " + cancelObj.returnAccount + "(" + cancelObj.accountHolder + ") 입니다. <br/> 다시 한번 확인해주세요.";
      this.$dialog
        .confirm({
          title: "반품 요청",
          text: text,
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          this.$store
            .dispatch("order/updateReturnRequest", { params: cancelObj })
            .then((resp) => {
              if (resp == true) {
                this.$dialog.message.info("반품 요청 완료됐습니다.");
                this.clear();
                this.$store.dispatch("order/getOrderDetailInfo", this.OrderCancelInfo.ordsCd);
                this.$emit("close");
              } else {
                this.$dialog.message.error(
                  "반품 요청에 실패하셨습니다. 사유 : " + resp
                );
              }
            });
        });
    },
    clear() {
      this.returnAccount = "";
      this.returnBank = "";
      this.accountHolder = "";
    }
  },
};
</script>
<style scoped>

</style>
