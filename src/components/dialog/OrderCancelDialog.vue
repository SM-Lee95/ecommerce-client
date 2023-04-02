<template>
  <v-container fluid class="white">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-row no-gutters>
        <v-col>
          <v-row class="mt-1">
            <v-col
              v-if="OrderCancelInfo.procTy != '0'"
              class="mt-1 ml-1 text-h6"
              >개별 주문 취소</v-col
            >
            <v-col
              v-if="OrderCancelInfo.procTy == '0'"
              class="mt-1 ml-1 text-h6"
              >전체 주문 취소</v-col
            >
          </v-row>
          <v-divider></v-divider>
          <v-row v-if="OrderCancelInfo.procTy == '0'">
            <v-col>
              <v-row>
                <v-col class="red--text lighten-2 text-center"
                  >결제 이전 주문건은 전체 취소만 가능합니다. <br />총
                  {{ OrderCancelInfo.totCnt }} 개의 아이템 주문 건이
                  취소됩니다.</v-col
                >
              </v-row>
              <v-row>
                <v-col class="text-center"
                  >주문 요약 : {{ OrderCancelInfo.ordsDoc }}</v-col
                >
              </v-row>
            </v-col>
          </v-row>
          <v-row v-if="OrderCancelInfo.procTy != '0'">
            <v-col class="ml-2 mr-2">
              <validation-provider
                v-slot="{ errors }"
                name="계좌번호"
                rules="required|max:16|numeric"
              >
                <v-text-field
                  v-model="returnAccount"
                  :counter="16"
                  :error-messages="errors"
                  label="계좌번호(only number)"
                  required
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="예금주"
                rules="required|max:16"
              >
                <v-text-field
                  v-model="accountHolder"
                  :counter="16"
                  :error-messages="errors"
                  label="예금주"
                  required
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="은행"
                rules="required"
              >
                <v-select
                  :items="BankList"
                  item-text="name"
                  item-value="commonKey.commCd"
                  label="은행"
                  v-model="returnBank"
                  :error-messages="errors"
                ></v-select>
              </validation-provider>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col class="text-right">
              <v-btn @click="cancelOrder" text :disabled="invalid">
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
    cancelOrder() {
      let cancelObj = new Object();
      cancelObj.ordsCd = this.OrderCancelInfo.ordsCd;
      cancelObj.listCd = this.OrderCancelInfo.listCd;
      cancelObj.procTy = this.OrderCancelInfo.procTy;
      let title = "주문 취소 요청";
      let text = "전체 주문 건이 취소됩니다. 다시 한번 확인해주세요.";
      if (this.OrderCancelInfo.procTy != "0") {
        cancelObj.returnAccount = this.returnAccount;
        cancelObj.returnBank = this.returnBank;
        cancelObj.accountHolder = this.accountHolder;
        cancelObj.prdCd = this.OrderCancelInfo.prdCd;
        cancelObj.prdListCd = this.OrderCancelInfo.prdListCd;
        title = "개별 주문 취소 요청";
        text =
          "환불 받으실 계좌번호는 " +
          cancelObj.returnAccount +
          "(" +
          cancelObj.accountHolder +
          ") 입니다. \n 다시 한번 확인해주세요.";
      }
      this.$dialog
        .confirm({
          title: title,
          text: text,
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          this.$store
            .dispatch("order/deleteOrdsInfo", { params: cancelObj })
            .then((resp) => {
              if (resp == true) {
                this.$dialog.message.info("취소되었습니다.");
                this.clear();
                this.$store.dispatch(
                  "order/getOrderDetailInfo",
                  this.OrderCancelInfo.ordsCd
                );
                this.$emit("close");
              } else {
                this.$dialog.message.error(
                  "취소에 실패하셨습니다. 사유 : " + resp
                );
              }
            });
        });
    },
    clear() {
      this.returnAccount = "";
      this.returnBank = "";
      this.accountHolder = "";
    },
  },
};
</script>
<style scoped></style>
