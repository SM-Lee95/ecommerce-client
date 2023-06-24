<template>
  <v-container fluid class="white pa-1">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-row class="pa-2">
        <v-col>
          <v-row class="pa-2">
            <v-col class="mt-1 ml-1 text-h6">결제 내역 등록</v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="pa-2 text-caption"
            ><v-col class="ml-2 mr-2 text-right">
              <v-data-table
                :headers="detailHeader"
                :items="paymentObj.orderDtlDtoList"
                class="elevation mt-3"
                hide-default-footer
                item-key="ordsDtlKey.listCd"
                disable-sort
                calculate-widths
                :items-per-page="-1"
                no-data-text="주문 건이 존재하지 않습니다."
              >
                <template v-slot:item.prdInfo="{ item }">
                  <v-row no-gutters>
                    <v-col class="text-caption">
                      {{ item.corpNm }}
                    </v-col>
                    <v-col
                      v-if="item.ordsTy != 'ORDER'"
                      class="red--text text-caption"
                      >{{ item.ordsTy == "RETURN" ? "반품" : "교환" }}</v-col
                    >
                  </v-row>
                  <v-row no-gutters>
                    <v-col class="text-caption">
                      <v-btn small text @click="getDetailInfo(item.prdCd)">{{
                        item.name
                      }}</v-btn>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col class="text-caption">
                      옵션 :
                      {{
                        item.color +
                        " / " +
                        item.size +
                        " / " +
                        item.cnt +
                        "개 "
                      }}
                    </v-col>
                  </v-row>
                </template>
                <template v-slot:item.discountRate="{ item }">
                  <v-row no-gutters>
                    <v-col class="text-caption">
                      {{ item.discountRate + " %" }}
                    </v-col>
                  </v-row>
                </template>
                <template v-slot:item.salesPri="{ item }">
                  <v-row no-gutters>
                    <v-col class="text-caption text-decoration-line-through">
                      {{ item.originPri.comma() + " 원" }}
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col class="text-caption">
                      {{ item.applyPri.comma() + " 원" }}
                    </v-col>
                  </v-row>
                </template>
                <template v-slot:item.subSumPri="{ item }">
                  <v-row no-gutters>
                    <v-col class="text-caption">{{
                      String(Number(item.applyPri) * Number(item.cnt)).comma() +
                      " 원"
                    }}</v-col></v-row
                  >
                </template>
              </v-data-table>
              상품합계 : {{ paymentObj.totPri.comma() }} 원 <br />
              배송비 : {{ paymentObj.totDeliPri.comma() }} 원 <br />
              입금예정금액 :
              {{
                String(
                  Number(paymentObj.totPri) + Number(paymentObj.totDeliPri)
                ).comma()
              }}
              원
            </v-col></v-row
          >
          <v-divider></v-divider>
          <v-row class="pa-1">
            <v-col class="ml-2 mr-2">
              <!-- <validation-provider
                v-slot="{ errors }"
                name="은행"
                rules="required"
              >
                <v-select
                  :items="BankList"
                  item-text="name"
                  item-value="commonKey.commCd"
                  label="은행"
                  v-model="bank"
                  :error-messages="errors"
                ></v-select>
              </validation-provider> -->
              <validation-provider
                v-slot="{ errors }"
                name="금액"
                rules="required|max:16|numeric"
              >
                <v-text-field
                  v-model="payPri"
                  :counter="16"
                  :error-messages="errors"
                  label="입금금액"
                  required
                ></v-text-field>
              </validation-provider>
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
                <v-date-picker v-model="payDate" no-title></v-date-picker>
              </v-menu>
            </v-col>
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
    bank: 11,
    payPri: "",
    dateFormatted: new Date(Date.now()).toISOString().substr(0, 10),
    menu1: false,
    payDate: null,
    detailHeader: [
      { text: "상품정보", value: "prdInfo", align: "start", width: "150px" },
      { text: "할인율", value: "discountRate", align: "center" },
      { text: "금액", value: "salesPri", align: "start" },
      { text: "합계금액", value: "subSumPri", align: "start" },
    ],
  }),
  props: {
    paymentObj: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters("common", ["BankList"]),
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
          title: "결제 등록",
          text: "주문 결제를 등록하시겠습니까?",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let reqData = {
            ordsCd: this.paymentObj.cd,
            payDate: this.dateFormatted,
            payPri: this.payPri,
            payMtd: "ACCOUNT_TRANSFER",
          };
          this.$store
            .dispatch("order/insertPaymentInfo", reqData)
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
  },
  watch: {
    payDate() {
      this.dateFormatted = this.parseDate(this.payDate);
    },
    paymentObj() {
      this.payPri =
        Number(this.paymentObj.totPri) + Number(this.paymentObj.totDeliPri);
    },
  },
};
</script>

<style></style>
