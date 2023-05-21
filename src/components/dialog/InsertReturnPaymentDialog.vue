<template>
  <v-container fluid class="white pa-1">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-row class="pa-2">
        <v-col>
          <v-row class="pa-2">
            <v-col class="mt-1 ml-1 text-h6">환불 내역 등록</v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row
            ><v-col>
              <v-list outlined>
                <v-list-item v-if="CancelRequestInfo.returnFile">
                  <v-list-item-subtitle>참고 사진</v-list-item-subtitle>
                  <v-list-item-subtitle
                    ><v-img v-model="CancelRequestInfo.returnFile"></v-img
                  ></v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-subtitle>반품 사유</v-list-item-subtitle>
                  <v-list-item-subtitle>{{
                    CancelRequestInfo.returnReason
                  }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-subtitle>예금주</v-list-item-subtitle>
                  <v-list-item-subtitle>{{
                    CancelRequestInfo.accountHolder
                  }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-subtitle> 은행 </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <v-select
                      :items="BankList"
                      item-text="name"
                      item-value="commonKey.commCd"
                      label="은행"
                      v-model="CancelRequestInfo.returnBank"
                      disabled
                    ></v-select
                  ></v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-subtitle> 계좌번호 </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    {{ CancelRequestInfo.returnAccount }}</v-list-item-subtitle
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-subtitle>입금금액</v-list-item-subtitle>
                  <v-list-item-subtitle
                    >{{
                      CancelRequestInfo.returnPri.comma()
                    }}원</v-list-item-subtitle
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-subtitle>입금일자</v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <v-menu
                      v-model="menu1"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="auto"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dateFormatted"
                          label="입금일자(YYYY-MM-DD)"
                          persistent-hint
                          v-bind="attrs"
                          @blur="payDate = parseDate(dateFormatted)"
                          v-on="on"
                          readonly
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="payDate"
                        no-title
                      ></v-date-picker> </v-menu
                  ></v-list-item-subtitle>
                </v-list-item>
              </v-list> </v-col
          ></v-row>
          <v-row class="pa-1">
            <v-col class="ml-2 mr-2"> </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col class="text-right">
              <v-btn @click="insertPayment" text :disabled="invalid">
                등록
                <v-icon color="gray darken-2">mdi-content-save-move</v-icon>
              </v-btn>
              <v-btn @click="cancel" text>
                취소
                <v-icon color="gray darken-2">mdi-cancel</v-icon>
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
  data: () => ({
    payPri: "",
    dateFormatted: new Date(Date.now()).toISOString().substr(0, 10),
    menu1: false,
    payDate: null,
  }),
  computed: {
    ...mapGetters("common", ["BankList"]),
    ...mapGetters("order", ["CancelRequestInfo"]),
  },
  methods: {
    parseDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    insertPayment() {
      this.$dialog
        .confirm({
          title: "환불 등록",
          text: "환불 정보를 등록하시겠습니까?",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let reqData = {
            cd: this.CancelRequestInfo.cd,
            ordsCd: this.CancelRequestInfo.ordsCd,
            listCd: this.CancelRequestInfo.listCd,
            payDate: this.dateFormatted,
          };
          this.$store
            .dispatch("order/insertReturnPaymentInfo", reqData)
            .then((resp) => {
              if (resp) {
                this.$dialog.message.info("결제 등록이 완료되었습니다.");
                this.cancel();
              } else {
                this.$dialog.message.error("결제 등록에 실패하였습니다.");
              }
            });
        });
    },
    cancel() {
      this.$emit("close");
    },
  },
  watch: {
    payDate() {
      this.dateFormatted = this.parseDate(this.payDate);
    },
  },
};
</script>

<style></style>
