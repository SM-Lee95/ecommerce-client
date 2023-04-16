<template>
  <v-container class="white" fluid>
    <v-card flat>
      <v-card-title class="text-h6"> 주문 상태 수정 </v-card-title>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row class="text-right">
          <v-col>
            <v-btn text @click="saveDtlProc"> 주문 상태 수정 </v-btn>
            <v-btn text @click="createTrdInfo"> 운송장 등록 </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-divider></v-divider>
      <v-card-text>
        <v-select
          :items="ProcList"
          item-text="name"
          item-value="commonKey.commCd"
          label="주문상태"
          v-model="procTy"
        ></v-select>
        <v-data-table
          :headers="detailHeader"
          :items="OrderEditObjList.orderDtlDtoList"
          class="elevation- mt-3"
          hide-default-footer
          show-select
          item-key="ordsDtlKey.listCd"
          v-model="selected"
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
                  "개 (남은수량 : " +
                  item.remainCnt +
                  "개)"
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
          <template v-slot:item.deliCnt="{ item }">
            <v-row no-gutters>
              <v-col class="text-caption">
                <v-text-field
                  v-model="item.deliCnt"
                  type="number"
                  single-line
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.subSumPri="{ item }">
            <v-row no-gutters>
              <v-col class="text-caption">{{
                String(Number(item.applyPri) * Number(item.cnt)).comma() + " 원"
              }}</v-col></v-row
            >
          </template>
          <template v-slot:item.proc="{ item }">
            <v-row no-gutters>
              <v-col class="text-caption">
                {{ OrderProcList[item.procTy] }}</v-col
              ></v-row
            >
          </template>
          <template v-slot:item.traCd="{ item }">
            <v-btn
              v-if="item.traCd"
              small
              text
              @click="
                getDeliInfo({
                  ords_cd: item.ordsDtlKey.ordsCd,
                  list_cd: item.ordsDtlKey.listCd,
                })
              "
              >배송상세</v-btn
            >
          </template>
        </v-data-table>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
    <v-dialog v-model="transactionDrawer" width="600px">
      <transaction-info-dialog></transaction-info-dialog>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import TransactionInfoDialog from "../dialog/TransactionInfoDialog.vue";
export default {
  name: "OrderMngPageModiDialog",
  components: {
    TransactionInfoDialog,
  },
  data: () => ({
    detailHeader: [
      { text: "상품정보", value: "prdInfo", align: "start", width: "150px" },
      { text: "할인율", value: "discountRate", align: "center" },
      { text: "금액", value: "salesPri", align: "start" },
      { text: "배송수량", value: "deliCnt", align: "center", width: "100px" },
      { text: "합계금액", value: "subSumPri", align: "start" },
      { text: "배송상태", value: "traCd", align: "center" },
      { text: "주문상태", value: "proc", align: "center" },
    ],
    procTy: 0,
    selected: [],
    transactionDrawer: false,
  }),
  methods: {
    saveDtlProc() {
      if (this.selected.length == 0) {
        this.$dialog.message.error("품목 선택 후 진행해주세요.");
        return;
      }
      this.$dialog
        .confirm({
          title: "개별 주문 상태 수정",
          text:
            this.OrderProcList[this.procTy] +
            " 상태로 선택된 품목의 주문 상태가 수정됩니다.",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let reqData = {
            procTy: this.procTy,
            ordsDtlList: this.selected,
          };
          this.$store
            .dispatch("order/updateOrdsDtlProc", reqData)
            .then((resp) => {
              if (resp) {
                this.$dialog.message.info("수정되었습니다.");
                this.$emit("refresh");
              } else this.$dialog.message.error("수정에 실패하셨습니다.");
            });
        });
    },
    createTrdInfo() {
      if (this.selected.length == 0) {
        this.$dialog.message.error("품목 선택 후 진행해주세요.");
        return;
      }
      if (
        this.selected.filter((vo) => {
          console.log(!vo.deliCnt);
          if (!vo.deliCnt || vo.deliCnt == "0") {
            this.$dialog.message.error("0보다 큰 숫자를 입력해주세요.");
            return true;
          } else if (isNaN(vo.deliCnt)) {
            this.$dialog.message.error(
              "선택된 주문의 배송수량을 숫자로 전부 입력해주세요."
            );
            return true;
          } else if (vo.remainCnt < vo.deliCnt) {
            this.$dialog.message.error(
              "선택된 주문 아이템의 남은 배송 수량보다 크지않은 배송수량을 입력해주세요."
            );
            return true;
          }
          return false;
        }).length
      ) {
        return;
      }
      this.$dialog
        .prompt({
          title: "운송장 등록",
          text: "운송장 번호를 입력해주세요.",
          showClose: false,
        })
        .then((resp) => {
          if (resp == false) return;
          if (!resp) {
            this.$dialog.message.error("등록되지 않았습니다.");
            return;
          }
          if (isNaN(resp)) {
            this.$dialog.message.error("숫자만 입력해주세요.");
            return;
          }
          let reqData = {
            traCd: resp,
            parcelCd: 1,
            orderDtlDtoList: this.selected,
          };
          this.$store.dispatch("order/insertTraList", reqData).then((resp) => {
            if (resp) {
              this.$dialog.message.info("등록되었습니다.");
              this.$emit("refresh");
            } else this.$dialog.message.error("등록에 실패하셨습니다.");
          });
        });
    },
    getDeliInfo(obj) {
      this.$store
        .dispatch("order/selectTransactionInfo", { params: obj })
        .then((resp) => {
          if (resp) this.transactionDrawer = !this.transactionDrawer;
          else
            this.$dialog.message.error(
              "배송 정보를 가져오는데 오류가 발생했습니다."
            );
        });
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
  computed: {
    ...mapGetters("order", ["OrderEditObjList"]),
    ...mapGetters("common", ["ProcList", "OrderProcList"]),
  },
};
</script>

<style scoped></style>
