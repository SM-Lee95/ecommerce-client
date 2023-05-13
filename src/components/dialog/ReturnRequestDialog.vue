<template>
  <v-container fluid class="white">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-row>
        <v-col>
          <v-row class="mt-1">
            <v-col class="mt-1 ml-1 text-h6">반품 요청</v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col class="text-center text-caption">
              안녕하세요:) 교환/반품 안내드려요.<br />
              cj택배에서 1~2일 이내로 배송지에서 수거해가실 거에요.<br />
              반품 신청해주신 제품 수령일로부터 7일 이내에 발송해주셔야
              합니다.<br />
              제품은 받아보신 그대로 보내주셔야 합니다.<br />
              상품 세탁, 착용 흔적이나 손상이 있어 재판매가 불가하다고 판단되는
              경우 어떤 이유에서건 교환/환불 불가하세요.<br />
              그 경우 고객님께로 반송되며 왕복 배송비 부담해주셔야 합니다.<br />
              이부분 정확히 이해해주시고 택배 보내주세요.<br />
              상세페이지의 공지사항도 한번 읽어주세요.<br />
              택배 잘 부탁드립니다. <br />배송지 :
              <b class="red--text"
                >서울 광진구 능동로55길 45 퍼시픽빌리지 C동 301호</b
              >
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="ma-2">
            <v-col>
              <v-select
                :items="countList"
                label="반품 갯수"
                v-model="returnCnt"
              ></v-select>
              <v-select
                :items="returnReasonList"
                item-text="name"
                item-value="cd"
                label="반품 사유"
                v-model="returnReason"
              ></v-select>
              <v-file-input
                v-if="returnReason == 2"
                accept="image/png, image/jpeg,"
                placeholder="파손 부분 사진을 넣어주세요"
                prepend-icon="mdi-camera"
                v-model="reasonFile"
                dense
              ></v-file-input>
              <v-textarea
                outlined
                v-model="reasonDetail"
                label="상세 사유 작성"
                rows="2"
              >
              </v-textarea>
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
    returnReasonList: [
      { cd: 0, name: "단순 변심" },
      { cd: 1, name: "주문 실수" },
      { cd: 2, name: "파손 및 불량" },
      { cd: 3, name: "오배송 및 지연" },
    ],
    returnReason: 0,
    reasonDetail: "",
    reasonFile: null,
    returnCnt: 1,
    countList: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ],
  }),
  computed: {
    ...mapGetters("order", ["OrderCancelInfo"]),
    ...mapGetters("common", ["BankList"]),
  },
  methods: {
    returnRequest() {
      if (this.OrderCancelInfo.cnt < this.returnCnt) {
        this.$dialog.message.error(
          "반품 신청한 갯수가 주문 갯수보다 많습니다."
        );
        return;
      }
      let formData = new FormData();
      let cancelObj = new Object();
      cancelObj.ordsCd = this.OrderCancelInfo.ordsCd;
      cancelObj.listCd = this.OrderCancelInfo.listCd;
      cancelObj.procTy = this.OrderCancelInfo.procTy;
      cancelObj.returnAccount = this.returnAccount;
      cancelObj.returnBank = this.returnBank;
      cancelObj.accountHolder = this.accountHolder;
      cancelObj.prdCd = this.OrderCancelInfo.prdCd;
      cancelObj.prdListCd = this.OrderCancelInfo.prdListCd;
      cancelObj.returnReason = this.returnReason;
      cancelObj.reasonDetail = this.reasonDetail;
      cancelObj.returnCnt = this.returnCnt;
      if (this.reasonFile) formData.append("reasonFile", this.reasonFile);
      formData.append(
        "cancelObj",
        new Blob([JSON.stringify(cancelObj)], { type: "application/json" })
      );
      let text =
        "환불 받으실 계좌번호는 " +
        cancelObj.returnAccount +
        "(" +
        cancelObj.accountHolder +
        ") 입니다. <br/> 다시 한번 확인해주세요.";
      this.$dialog
        .confirm({
          title: "반품 요청",
          text: text,
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          this.$store
            .dispatch("order/updateReturnRequest", formData)
            .then((resp) => {
              if (resp == true) {
                this.$dialog.message.info("반품 요청 완료됐습니다.");
                this.clear();
                this.$store.dispatch(
                  "order/getOrderDetailInfo",
                  this.OrderCancelInfo.ordsCd
                );
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
      this.returnReason = 0;
      this.reasonDetail = "";
      this.reasonFile = null;
    },
  },
};
</script>
<style scoped></style>
