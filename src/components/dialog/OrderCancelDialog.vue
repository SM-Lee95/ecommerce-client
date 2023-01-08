<template>
  <v-container fluid class="white">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-row no-gutters>
        <v-col>
          <v-row class="mt-1">
            <v-col class="mt-1 ml-1 text-h6">개별 주문 취소 신청</v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row v-if="OrderCancelInfo.procTy == '0'">
            <v-col>
              <v-row>
                <v-col>{{ OrderCancelInfo.name }}</v-col>
              </v-row>
              <v-row>
                <v-col></v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-if="OrderCancelInfo.procTy != '0'">
            <v-col class="ml-2 mr-2">
              <validation-provider
                v-slot="{ errors }"
                name="Account"
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
                name="AccountHolder"
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
                name="Bank"
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
      cancelObj.returnAccount = this.returnAccount;
      cancelObj.returnBank = this.returnBank;
      cancelObj.accountHolder = this.accountHolder;
      cancelObj.orderInfo = this.OrderCancelInfo;
      console.log(cancelObj);
      this.$dialog
        .confirm({
          title: "주문 취소 요청",
          text:
            "환불 받으실 계좌번호는 " +
            cancelObj.returnAccount +
            "(" +
            cancelObj.accountHolder +
            ") 입니다. \n 다시 한번 확인해주세요.",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          this.$store
            .dispatch("order/deleteOrdsInfo", cancelObj)
            .then((resp) => {
              if (resp) this.$dialog.message.info("수정되었습니다.");
              else this.$dialog.message.error("수정에 실패하셨습니다.");
              this.modiDialog = false;
            });
        });
    },
  },
};
</script>
<style scoped></style>
