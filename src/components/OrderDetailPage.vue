<template>
  <v-container>
    <v-row no-gutters>
      <v-col class="text-h6 font-weight-bold">주문 상세 정보</v-col>
      <v-col class="text-right mr-4" align-self="center"
        >일자 : <b>{{ this.OrderDetailInfo[0].regDati }}</b></v-col
      >
    </v-row>
    <v-row no-gutters>
      <v-col class="text-left"
        >주문 번호 : <b>{{ this.OrderDetailInfo[0].ordsCd }}</b></v-col
      >
      <v-col class="text-right">
        <v-btn text @click="goTokTok">TokTok 주문 문의</v-btn>
      </v-col>
    </v-row>
    <v-row
      ><v-col>
        <v-data-table
          :headers="header"
          :items="this.OrderDetailInfo"
          class="elevation-0 mt-2"
          hide-default-footer
          disable-sort
          no-data-text="주문 건이 존재하지 않습니다."
        >
          <template v-slot:item.thumbnail="{ item }">
            <v-img :src="item.thumbnail" contain max-width="100"></v-img>
          </template>
          <template v-slot:item.prdInfo="{ item }">
            <v-row no-gutters>
              <v-col class="text-left text-caption">
                <v-btn small text @click="getDetailInfo(item.prdCd)">{{
                  item.name
                }}</v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="text-left text-caption ml-3">
                옵션 : {{ item.color + " / " + item.size }}
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.originPri="{ item }">
            {{ item.applyPri.comma() + " 원" }}
          </template>
          <template v-slot:item.discountRate="{ item }">
            <v-row no-gutters class="text-caption"
              ><v-col>{{ item.discountRate + " %" }}</v-col></v-row
            >
          </template>
          <template v-slot:item.salesPri="{ item }">
            <v-row no-gutters class="text-decoration-line-through text-caption"
              ><v-col>{{ item.originPri.comma() + " 원" }}</v-col></v-row
            >
            <v-row no-gutters class="text-caption"
              ><v-col>{{ item.applyPri.comma() + " 원" }}</v-col></v-row
            >
          </template>
          <template v-slot:item.cnt="{ item }">
            <v-row no-gutters class="text-caption"
              ><v-col> {{ item.cnt + " 개" }}</v-col></v-row
            >
          </template>
          <template v-slot:item.subSumPri="{ item }">
            <v-row no-gutters class="text-caption"
              ><v-col>{{
              String(Number(item.applyPri) * Number(item.cnt)).comma() + " 원"
            }}</v-col></v-row
            >
          </template>
          <template v-slot:item.proc="{ item }">
            <v-row no-gutters>
              <v-col align-self="center">
                <v-btn small text @click="getProcAlert(item)">
                  {{ OrderProcList[item.procTy] }}
                  {{
                    (item.procTy == "2" ||
                      item.procTy == "3" ||
                      item.procTy == "4") &&
                    item.traCd
                      ? "(" + item.traCd + ")"
                      : ""
                  }}
                </v-btn>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.action="{ item }">
            <v-row no-gutters>
              <v-col v-if="item.procTy < 3">
                <v-row no-gutters v-if="item.listCd >= 0"
                  ><v-col>
                    <v-btn small text @click="cancelOrder(item)"
                      >주문취소</v-btn
                    >
                  </v-col></v-row
                >
                <v-row no-gutters v-if="item.listCd >= 0 && item.procTy < 1"
                  ><v-col>
                    <v-btn small text @click="updateOption(item)"
                      >옵션변경</v-btn
                    >
                  </v-col></v-row
                >
              </v-col>
              <v-col v-if="item.procTy == 4">
                <v-row no-gutters
                  ><v-col>
                    <v-btn small text @click="confirmPurchase(item)"
                      >구매확정</v-btn
                    >
                  </v-col></v-row
                >
                <v-row no-gutters v-if="item.listCd >= 0"
                  ><v-col>
                    <v-btn small text @click="exchangeRequest(item)"
                      >교환요청</v-btn
                    >
                  </v-col></v-row
                >
                <v-row no-gutters
                  ><v-col>
                    <v-btn small text @click="returnRequest(item)"
                      >반품요청</v-btn
                    >
                  </v-col></v-row
                >
              </v-col>
              <v-col v-if="item.procTy == 5">
                <v-row
                  ><v-col v-if="!item.reviewDescription">
                    <v-btn small text @click="writeReview(item)"
                      >후기작성</v-btn
                    >
                  </v-col>
                  <v-col v-if="item.reviewDescription" class="text-caption">
                    후기작성완료
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-col></v-row
    >
    <v-divider inset dark></v-divider>
    <v-row
      ><v-col>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-row class="pa-5 mt-5">
            <v-col cols="6">
              <v-row no-gutters>
                <v-col class="text-subtitle-1" cols="8"> 배송지 정보 </v-col>
                <v-col
                  class="text-right"
                  cols="4"
                  v-if="
                    !OrderDetailInfo.filter(
                      (vo) => vo.procTy >= 2 && vo.procTy != 10
                    ).length &&
                    OrderDetailInfo.filter((vo) => vo.procTy != 10).length
                  "
                >
                  <v-btn v-if="!updateFlag" text @click="updateOrderInfo" small
                    >주문정보수정</v-btn
                  >
                  <v-btn
                    text
                    @click="updateComplete(OrderDetailInfo[0].ordsCd)"
                    v-if="updateFlag"
                    :disabled="invalid"
                    small
                    >변경완료</v-btn
                  >
                  <v-btn text @click="updateCancel" v-if="updateFlag" small
                    >변경취소</v-btn
                  >
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col>
                  <v-list outlined>
                    <v-list-item>
                      <v-list-item-subtitle> 이름 </v-list-item-subtitle>
                      <v-list-item-subtitle v-if="!updateFlag">
                        {{ OrderDetailInfo[0].recvNm }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle v-if="updateFlag">
                        <validation-provider
                          v-slot="{ errors }"
                          name="name"
                          rules="required|max:15"
                        >
                          <v-text-field
                            flat
                            dense
                            v-model="name"
                            :counter="15"
                            :error-messages="errors"
                          ></v-text-field>
                        </validation-provider>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-subtitle> 연락처 </v-list-item-subtitle>
                      <v-list-item-subtitle v-if="!updateFlag">
                        {{ OrderDetailInfo[0].recvPhone }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle v-if="updateFlag">
                        <validation-provider
                          v-slot="{ errors }"
                          name="(010-****-****)"
                          :rules="{
                            required: true,
                            regex: [/^\d{2,3}-\d{3,4}-\d{4}$/],
                          }"
                        >
                          <v-text-field
                            flat
                            dense
                            :counter="13"
                            :error-messages="errors"
                            v-model="phone"
                          ></v-text-field>
                        </validation-provider>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-subtitle> 배송지 주소 </v-list-item-subtitle>
                      <v-list-item-subtitle v-if="!updateFlag">
                        {{ OrderDetailInfo[0].postcode }}<br />
                        {{ OrderDetailInfo[0].mainAddress }}<br />
                        {{ OrderDetailInfo[0].etcAddress }}<br />
                      </v-list-item-subtitle>
                      <v-list-item-subtitle v-if="updateFlag">
                        <v-text-field
                          flat
                          dense
                          v-model="postcode"
                          readonly
                          @click="daumPostCode"
                        ></v-text-field>
                        <v-text-field
                          flat
                          dense
                          v-model="mainAddress"
                          readonly
                          @click="daumPostCode"
                        ></v-text-field>
                        <v-text-field
                          flat
                          dense
                          v-model="etcAddress"
                        ></v-text-field>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-subtitle> 배송 메시지 </v-list-item-subtitle>
                      <v-list-item-subtitle v-if="!updateFlag">
                        {{ OrderDetailInfo[0].reqMemo }}<br />
                      </v-list-item-subtitle>
                      <v-list-item-subtitle v-if="updateFlag">
                        <validation-provider
                          v-slot="{ errors }"
                          name="배송 메시지"
                          :rules="{
                            required: false,
                          }"
                        >
                          <v-text-field
                            flat
                            dense
                            :counter="50"
                            :error-messages="errors"
                            v-model="reqMemo"
                          ></v-text-field>
                        </validation-provider>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col class="text-h6 text-subtitle-1"> 최종 결제 정보 </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col>
                  <v-list outlined>
                    <v-list-item>
                      <v-list-item-subtitle>
                        총 상품 개수
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{ OrderDetailInfo[0].totCnt }} 개
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-subtitle> 상품 합계 </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{ OrderDetailInfo[0].totPri.comma() }} 원
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-subtitle> 배송비 합계 </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{ OrderDetailInfo[0].totDeliPri.comma() }} 원
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-subtitle> 총 합계 </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        {{
                          String(
                            Number(OrderDetailInfo[0].totDeliPri) +
                              Number(OrderDetailInfo[0].totPri)
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
        </validation-observer>
      </v-col></v-row
    >
    <v-dialog v-model="optionDialog" width="600px"
      ><order-option-update-dialog
        v-on:close="close('optionDialog')"
      ></order-option-update-dialog>
    </v-dialog>
    <v-dialog v-model="cancelDialog" width="600px"
      ><order-cancel-dialog
        v-on:close="close('cancelDialog')"
      ></order-cancel-dialog>
    </v-dialog>
    <v-dialog v-model="exchangeDialog" width="800px">
      <exchange-request-dialog
        v-on:close="close('exchangeDialog')"
      ></exchange-request-dialog>
    </v-dialog>
    <v-dialog v-model="returnDialog" width="800px">
      <return-request-dialog
        v-on:close="close('returnDialog')"
      ></return-request-dialog>
    </v-dialog>
    <v-dialog v-model="reviewDialogDrawer" width="600px">
      <review-write-dialog
        v-on:close="close('reviewDialogDrawer')"
      ></review-write-dialog>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import OrderCancelDialog from "./dialog/OrderCancelDialog.vue";
import ExchangeRequestDialog from "./dialog/ExchangeRequestDialog.vue";
import OrderOptionUpdateDialog from "./dialog/OrderOptionUpdateDialog.vue";
import ReturnRequestDialog from "./dialog/ReturnRequestDialog.vue";
import ReviewWriteDialog from "./dialog/ReviewWriteDialog.vue";

export default {
  name: "OrderDetailPage",
  components: {
    OrderOptionUpdateDialog,
    OrderCancelDialog,
    ExchangeRequestDialog,
    ReturnRequestDialog,
    ReviewWriteDialog,
  },
  data: () => ({
    header: [
      { value: "thumbnail", align: "center", width: "100px" },
      { text: "상품정보", value: "prdInfo", align: "center", width: "500px" },
      { text: "할인율", value: "discountRate", align: "center", width: "65px" },
      { text: "할인금액", value: "salesPri", align: "center", width: "100px" },
      { text: "수량", value: "cnt", align: "center", width: "60px" },
      { text: "합계금액", value: "subSumPri", align: "center", width: "100px" },
      { text: "주문상태", value: "proc", align: "center", width: "50px" },
      { text: "", value: "action", align: "center", width: "50px" },
    ],
    postcode: "",
    mainAddress: "",
    etcAddress: "",
    name: "",
    phone: "",
    reqMemo: "",
    updateFlag: false,
    optionDialog: false,
    cancelDialog: false,
    exchangeDialog: false,
    returnDialog: false,
    reviewDialogDrawer: false,
  }),
  computed: {
    ...mapGetters("order", ["OrderDetailInfo"]),
    ...mapGetters("common", ["OrderProcList", "BankList"]),
  },
  methods: {
    getDetailInfo(cd) {
      this.$store.dispatch("product/getDetailInfo", cd).then((resp) => {
        if (resp) {
          if (this.$route.path != "/Detail") this.$router.push("/Detail");
        } else
          this.$dialog.message.error(
            "상품 정보를 조회하는 중에 오류가 발생했습니다."
          );
      });
    },
    getProcAlert(item) {
      if (item.procTy == 0) {
        this.$dialog.error({
          title: "주문 접수",
          text:
            "<b>계좌로 입금이 완료되지 않았습니다.</b><br/>" +
            "정확한 금액으로 입금 후 확인 부탁드립니다. <br/>" +
            "입금 계좌 : 3021649166621 (농협) <br/>" +
            "예금주 : 김진현 ",
          showClose: false,
        });
      } else if (item.procTy == 1) {
        this.$dialog.error({
          title: "결제 확인",
          text: "결제 확인이 완료되었습니다. 배송 예정입니다.",
          showClose: false,
        });
      } else if (item.procTy == 2) {
        this.$dialog.error({
          title: "배송준비중",
          text: "배송이 준비중입니다.",
          showClose: false,
        });
      } else if (item.procTy == 3 || item.procTy == 4) {
        this.$deliInfoPopup(item.traCd);
      } else if (item.procTy == 10) {
        let text = "<b>주문이 취소되었습니다.</b>";
        if (item.returnAccount) {
          text += "<br/>환불 계좌 : " + item.returnAccount;
          text += "<br/>예금주 : " + item.accountHolder;
          text +=
            "<br/>은행 : " +
            this.BankList.filter(
              (vo) => vo.commonKey.commCd == item.returnBank
            )[0].name;
          text += "<br/>환불 금액 : " + item.returnPri.comma() + "원";
          text +=
            "<br/><b class='red--text'>한 주문의 모든 아이템 취소시 마지막 개별 취소 건에 배송비가 합산 환불됩니다.</b>";
        }
        this.$dialog.error({
          title: "주문취소",
          text: text,
          showClose: false,
        });
      } else if (item.procTy == 8) {
        this.$dialog.error({
          title: "물품 회수",
          text: "물품 회수가 완료됐습니다. <br/>반품 건은 환불이 진행되고 교환 건은 배송이 진행됩니다.",
          showClose: false,
        });
      }
    },
    cancelOrder(item) {
      this.$store.commit("order/setOrderCancelInfo", item);
      this.cancelDialog = true;
    },
    updateOption(item) {
      this.$store
        .dispatch("order/selectItemOptionInfo", {
          params: {
            ordsCd: item.ordsCd,
            listCd: item.listCd,
            prdCd: item.prdCd,
            prdListCd: item.prdListCd,
          },
        })
        .then((resp) => {
          if (resp) this.optionDialog = true;
          else
            this.$dialog.error("상품 옵션을 가져오는데 문제가 발생했습니다.");
        });
    },
    updateOrderInfo() {
      this.postcode = this.OrderDetailInfo[0].postcode;
      this.mainAddress = this.OrderDetailInfo[0].mainAddress;
      this.etcAddress = this.OrderDetailInfo[0].etcAddress;
      this.name = this.OrderDetailInfo[0].recvNm;
      this.phone = this.OrderDetailInfo[0].recvPhone;
      this.reqMemo = this.OrderDetailInfo[0].reqMemo;
      this.updateFlag = true;
    },
    daumPostCode() {
      this.$daumPostCode();
    },
    updateComplete(ordsCd) {
      let reqData = {
        cd: ordsCd,
        postcode: this.postcode,
        etcAddress: this.etcAddress,
        mainAddress: this.mainAddress,
        recvNm: this.name,
        recvPhone: this.phone,
        reqMemo: this.reqMemo,
      };
      this.$store.dispatch("order/updateOrderInfo", reqData).then((resp) => {
        if (resp) {
          this.$dialog.message.info("주문 정보 변경이 완료되었습니다.");
          this.OrderDetailInfo[0].postcode = this.postcode;
          this.OrderDetailInfo[0].mainAddress = this.mainAddress;
          this.OrderDetailInfo[0].etcAddress = this.etcAddress;
          this.OrderDetailInfo[0].recvNm = this.name;
          this.OrderDetailInfo[0].recvPhone = this.phone;
          this.OrderDetailInfo[0].reqMemo = this.reqMemo;
          this.updateCancel();
        } else {
          this.$dialog.message.error("주문 정보 변경에 실패하였습니다.");
        }
      });
    },
    updateCancel() {
      this.updateFlag = false;
      this.postcode = "";
      this.mainAddress = "";
      this.etcAddress = "";
      this.name = "";
      this.phone = "";
      this.reqMemo = "";
    },
    returnRequest(item) {
      this.$store.commit("order/setOrderCancelInfo", item);
      this.returnDialog = true;
    },
    exchangeRequest(item) {
      this.$store
        .dispatch("order/selectItemOptionInfo", {
          params: {
            ordsCd: item.ordsCd,
            listCd: item.listCd,
            prdCd: item.prdCd,
            prdListCd: item.prdListCd,
          },
        })
        .then((resp) => {
          if (resp) this.exchangeDialog = true;
          else
            this.$dialog.error("상품 옵션을 가져오는데 문제가 발생했습니다.");
        });
    },
    confirmPurchase(item) {
      this.$dialog
        .confirm({
          title: "주문 확정",
          text: "해당 품목 주문을 확정하시겠습니까?",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let reqData = {
            ordsCd: item.ordsCd,
            listCd: item.listCd,
          };
          this.$store
            .dispatch("order/updateConfirmPurchase", reqData)
            .then((resp) => {
              if (resp == true) {
                this.$dialog.message.info("주문 확정이 완료되었습니다.");
                this.$store.dispatch("order/getOrderDetailInfo", item.ordsCd);
              } else {
                this.$dialog.message.error("주문 확정에 실패하였습니다.");
              }
            });
        });
    },
    goTokTok() {
      let url = "https://smartstore.naver.com/lovane";
      window.open(url);
    },
    close(vo) {
      this[vo] = false;
    },
    writeReview(vo) {
      this.$store.commit("order/setReviewWriteItemInfo", vo);
      this.reviewDialogDrawer = true;
    },
  },
};
</script>

<style scoped></style>
