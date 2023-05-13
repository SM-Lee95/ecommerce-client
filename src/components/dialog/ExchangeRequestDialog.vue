<template>
  <v-container fluid class="white">
    <v-row no-gutters>
      <v-col>
        <v-row class="mt-1">
          <v-col class="mt-1 ml-1 text-h6">주문 교환 요청</v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="text-center text-caption">
            안녕하세요:) 교환/반품 안내드려요.<br />
            cj택배에서 1~2일 이내로 배송지에서 수거해가실 거에요.<br />
            교환 신청해주신 제품 수령일로부터 7일 이내에 발송해주셔야 합니다.<br />
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
            <v-card-text v-if="returnReason != 2">
              변경 가능한 옵션
              <v-chip-group
                v-model="optionVal"
                active-class="black accent-4 white--text"
              >
                <v-chip
                  v-for="vo in OrderUpdateOptionInfo"
                  :key="vo.productKey.listCd"
                >
                  {{ vo.size.name }}-{{ vo.color.name }}
                </v-chip>
              </v-chip-group>
            </v-card-text>
            <v-select
              :items="countList"
              label="교환 갯수"
              v-model="returnCnt"
            ></v-select>
            <v-select
              :items="returnReasonList"
              item-text="name"
              item-value="cd"
              label="교환 사유"
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
    returnReasonList: [
      { cd: 0, name: "단순 변심" },
      { cd: 1, name: "주문 실수" },
      { cd: 2, name: "파손 및 불량" },
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
    ...mapGetters("order", ["OrderUpdateOptionInfo"]),
  },
  methods: {
    updateInfo() {
      console.log(this.OrderUpdateOptionInfo);
      if (!this.optionVal && this.optionVal != "0" && this.returnReason != 2) {
        this.$dialog.message.error("옵션을 선택한 후에 진행해주세요.");
        return;
      }
      let reqData = this.OrderUpdateOptionInfo[0];
      if (reqData.cnt < this.returnCnt) {
        this.$dialog.message.error(
          "교환 신청한 갯수가 주문 갯수보다 많습니다."
        );
        return;
      }
      let text =
        this.returnCnt +
        "개의 상품을 " +
        (this.returnReason == 2
          ? "파손 사유로 같은 옵션으로 교환 요청하시겠습니까?"
          : "선택 옵션으로 교환 요청하시겠습니까?");
      this.$dialog
        .confirm({
          title: "주문 옵션 교환 요청",
          text: text,
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          if (this.returnReason != 2) {
            reqData = this.OrderUpdateOptionInfo[this.optionVal];
            cancelObj.prdCd = reqData.productKey.prdCd;
            cancelObj.prdListCd = reqData.productKey.listCd;
          }
          let formData = new FormData();
          let cancelObj = new Object();
          cancelObj.ordsCd = reqData.ordsCd;
          cancelObj.listCd = reqData.listCd;
          cancelObj.returnReason = this.returnReason;
          cancelObj.reasonDetail = this.reasonDetail;
          cancelObj.returnCnt = this.returnCnt;
          if (this.reasonFile) formData.append("reasonFile", this.reasonFile);
          formData.append(
            "cancelObj",
            new Blob([JSON.stringify(cancelObj)], { type: "application/json" })
          );
          this.$store
            .dispatch("order/updateExchangeRequest", formData)
            .then((resp) => {
              if (resp == true) {
                this.$dialog.message.info("교환 요청 완료됐습니다..");
                this.$store.dispatch(
                  "order/getOrderDetailInfo",
                  reqData.ordsCd
                );
                this.$emit("close");
              } else this.$dialog.message.error("요청에 실패하였습니다.");
            });
        });
    },
  },
};
</script>
