<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="text-h6"> 주문 상태 수정 </v-card-title>
      <v-divider></v-divider>
      <v-card-actions>
        <v-row class="text-right">
          <v-col>
            <v-btn text @click="saveInfoProc"> 주문별 상태 수정 </v-btn>
            <v-btn text @click="saveDtlProc"> 아이템별 주문 상태 수정 </v-btn>
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
          no-data-text="주문 건이 존재하지 않습니다."
        >
          <template v-slot:item.prdInfo="{ item }">
            <v-row no-gutters>
              <v-col class="text-left">
                {{ item.corpNm }}
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="text-left">
                <v-btn text @click="getDetailInfo(item.prdCd)">{{ item.name }}</v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="text-left">
                옵션 :
                {{ item.color + " / " + item.size + " / " + item.cnt + "개" }}
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.originPri="{ item }">
            {{ item.applyPri.comma() + " 원" }}
          </template>
          <template v-slot:item.discountRate="{ item }">
            {{ item.discountRate + " %" }}
          </template>
          <template v-slot:item.salesPri="{ item }">
            {{ item.applyPri.comma() + " 원" }}
          </template>
          <template v-slot:item.deliCnt="{ item }">
            <v-text-field v-model="item.deliCnt" type="number" single-line></v-text-field>
          </template>
          <template v-slot:item.subSumPri="{ item }">
            {{ String(Number(item.applyPri) * Number(item.cnt)).comma() + " 원" }}
          </template>
          <template v-slot:item.proc="{ item }">
            {{ OrderProcList[item.procTy] }}
          </template>
          <template v-slot:item.traCd="{ item }">
            <v-btn text @click="getDeliInfo(item.traCd)">{{ item.traCd }}</v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "OrderMngPageModiDialog",
  data: () => ({
    detailHeader: [
      { text: "상품정보", value: "prdInfo", align: "start", width: "10px" },
      { text: "금액", value: "originPri", align: "start", width: "10px" },
      { text: "할인율", value: "discountRate", align: "center", width: "10px" },
      { text: "할인금액", value: "salesPri", align: "start", width: "20px" },
      { text: "배송수량", value: "deliCnt", align: "center", width: "90px" },
      { text: "합계금액", value: "subSumPri", align: "start", width: "10px" },
      { text: "운송장번호", value: "traCd", align: "center", width: "30px" },
      { text: "주문상태", value: "proc", align: "center", width: "10px" },
    ],
    procTy: 0,
    selected: [],
  }),
  methods: {
    saveInfoProc() {
      this.$dialog
        .confirm({
          title: "주문 상태 수정",
          text:
            this.OrderProcList[this.procTy] + " 로 해당 주문의 주문 상태가 수정됩니다.",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let reqData = {
            procTy: this.procTy,
            ordsCd: this.OrderEditObjList.cd,
          };
          this.$store.dispatch("order/updateOrdsInfoProc", reqData).then((resp) => {
            if (resp) this.$dialog.message.info("수정되었습니다.");
            else this.$dialog.message.error("수정에 실패하셨습니다.");
            this.modiDialog = false;
          });
        });
    },
    saveDtlProc() {
      this.$dialog
        .confirm({
          title: "개별 주문 상태 수정",
          text: this.OrderProcList[this.procTy] + " 상태로 선택된 품목의 주문 상태가 수정됩니다.",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let reqData = {
            procTy: this.procTy,
            ordsDtlList: this.selected,
          };
          this.$store.dispatch("order/updateOrdsDtlProc", reqData).then((resp) => {
            if (resp) this.$dialog.message.info("수정되었습니다.");
            else this.$dialog.message.error("수정에 실패하셨습니다.");
            this.modiDialog = false;
          });
        });
    },
    createTrdInfo() {
      if (this.selected.length == 0) {
        this.$dialog.message.error("품목 선택 후 진행해주세요.");
        return;
      }
      let isErr = this.selected.filter((vo) => {
        if (!vo.deliCnt) {
          this.$dialog.message.error("0보다 큰 숫자를 입력해주세요.");
          return true;
        } else if (isNaN(vo.deliCnt)){
          this.$dialog.message.error("선택된 주문의 배송수량을 숫자로 전부 입력해주세요.");
          return true;
        } else if (vo.remainCnt < vo.deliCnt) {
          this.$dialog.message.error("선택된 주문 아이템의 남은 배송 수량보다 크지않은 배송수량을 입력해주세요.");
          return true;
        }
        return false;
      }).length;
      if (isErr) return;
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
            if (resp) this.$dialog.message.info("등록되었습니다.");
            else this.$dialog.message.error("등록에 실패하셨습니다.");
            this.modiDialog = false;
          });
        });
    },
    getDeliInfo(traCd) {
      this.$deliInfoPopup(traCd);
    },
    getDetailInfo(cd) {
      this.$store.dispatch("product/getDetailInfo", cd).then((resp) => {
        if (resp) {
          if (this.$route.path != "/Detail") this.$router.push("/Detail");
        } else this.$dialog.message.error("상품 정보를 조회하는 중에 오류가 발생했습니다.");
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
