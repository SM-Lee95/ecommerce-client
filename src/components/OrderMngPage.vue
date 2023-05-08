<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-toolbar flat>
          <v-row>
            <v-col cols="3">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateRangeText"
                    label="주문일자"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title scrollable range>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(date)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="2">
              <v-select
                :items="ProcList"
                item-text="name"
                item-value="commonKey.commCd"
                v-model="procCd"
                flat
                prepend-inner-icon="mdi-magnify"
                label="주문상태"
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-select
                :items="OptionList"
                item-text="name"
                item-value="cd"
                v-model="optionCd"
                flat
                prepend-inner-icon="mdi-magnify"
                label="검색조건"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-text-field
                clearable
                flat
                v-model="searchValue"
                prepend-inner-icon="mdi-magnify"
                label="검색어"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-btn text @click="searchList"> 검색 </v-btn>
            </v-col>
          </v-row>
        </v-toolbar>
        <v-row>
          <v-col class="text-right">
            <v-btn text @click="completePayment"> 결제완료처리 </v-btn>
          </v-col>
        </v-row>
        <v-data-table
          :headers="header"
          :items="OrderMngList"
          class="elevation- mt-3"
          hide-default-footer
          show-select
          item-key="cd"
          v-model="selected"
          no-data-text="주문 건이 존재하지 않습니다."
          :items-per-page="-1"
        >
          <template v-slot:item.date="{ item }">
            <v-row no-gutters class="text-caption"
              ><v-col>{{ item.regDati.substr(2, 8) }}</v-col></v-row
            >
          </template>
          <template v-slot:item.cd="{ item }">
            <v-row no-gutters class="text-caption"
              ><v-col>{{ item.cd }}</v-col></v-row
            >
          </template>
          <template v-slot:item.info="{ item }">
            <v-btn x-small text @click="getOrderDetail(item.cd)">
              {{ item.ordsDoc }}
            </v-btn>
          </template>
          <template v-slot:item.pri="{ item }">
            <v-row no-gutters class="text-caption"
              ><v-col>
                <v-btn text small @click="paymentInfo(item)">{{
                  item.totPri.comma() + " 원"
                }}</v-btn></v-col
              ></v-row
            >
          </template>
          <template v-slot:item.recvPhone="{ item }">
            <v-row no-gutters class="text-caption"
              ><v-col> {{ item.recvPhone }}</v-col></v-row
            >
          </template>
          <template v-slot:item.recvNm="{ item }">
            <v-row no-gutters class="text-caption"
              ><v-col> {{ item.recvNm }}</v-col></v-row
            >
          </template>
          <template v-slot:item.address="{ item }">
            <v-row no-gutters class="text-caption"
              ><v-col>
                ({{ item.postcode }})
                {{ item.mainAddress }}
                {{ item.etcAddress }}</v-col
              ></v-row
            >
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small @click="editDialog(item)"> mdi-pencil </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="modiDialog" width="1200px" persistent>
      <order-mng-page-modi-dialog
        v-on:close="editDialog"
      ></order-mng-page-modi-dialog>
    </v-dialog>
    <v-dialog v-model="paymentDrawer" width="1000px" persistent>
      <insert-payment-dialog
        :paymentObj="paymentObj"
        v-on:close="togglePaymentDrawer"
      ></insert-payment-dialog>
    </v-dialog>
    <v-dialog v-model="paymentInfoDrawer" width="600px">
      <payment-info-dialog
        :paymentObj="paymentObj"
        v-on:close="paymentInfo"
      ></payment-info-dialog>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import OrderMngPageModiDialog from "./dialog/OrderMngPageModiDialog";
import InsertPaymentDialog from "./dialog/InsertPaymentDialog.vue";
import PaymentInfoDialog from "./dialog/PaymentInfoDialog.vue";

export default {
  name: "OrderMngPage",
  components: {
    InsertPaymentDialog,
    OrderMngPageModiDialog,
    PaymentInfoDialog,
  },
  methods: {
    editDialog(item) {
      if (item) {
        item.orderDtlDtoList.forEach((vo) => {
          vo.deliCnt = vo.remainCnt;
        });
        this.$store.commit(
          "order/setOrderEditObjList",
          Object.assign({}, item)
        );
      } else {
        this.searchList();
      }
      this.modiDialog = !this.modiDialog;
    },
    searchList() {
      let reqData = {
        procCd: this.procCd,
        optionCd: this.optionCd,
        searchValue: this.searchValue,
        beforeDati: this.date[0],
        afterDati: this.date[1],
      };
      this.$store.dispatch("order/selectOrderMngList", reqData).then((resp) => {
        if (!resp) this.$dialog.message.warning("조회 중 에러가 발생했습니다.");
        else this.selectedRefresh();
      });
    },
    getOrderDetail(ordsCd) {
      this.$store.dispatch("order/getOrderDetailInfo", ordsCd).then((resp) => {
        if (resp) {
          this.$router.push("/OrderDetailPage");
        } else {
          this.$dialog.message.error(
            "주문 상세 정보를 가져오는데 실패했습니다."
          );
        }
      });
    },
    completePayment() {
      if (this.selected.length != 1) {
        this.$dialog.message.error("단일 주문 선택 후 진행해주세요.");
        return;
      }
      if (
        this.selected[0].orderDtlDtoList.filter((dtl) => {
          if (dtl.procTy != 0) {
            this.$dialog.message.error(
              "주문 접수 상태인 것만 처리 가능합니다."
            );
            return true;
          }
          return false;
        }).length
      ) {
        return;
      }
      this.paymentObj = this.selected[0];
      this.togglePaymentDrawer();
    },
    togglePaymentDrawer() {
      if (this.paymentDrawer) {
        this.searchList();
      }
      this.paymentDrawer = !this.paymentDrawer;
    },
    paymentInfo(info) {
      if (info) {
        this.paymentObj = info;
      }
      this.paymentInfoDrawer = !this.paymentInfoDrawer;
    },
    selectedRefresh() {
      this.selected.splice(0, this.selected.length);
    },
  },
  data: () => ({
    header: [
      { text: "주문일자", value: "date", align: "center" },
      { text: "주문번호", value: "cd", align: "center" },
      { text: "주문정보", value: "info", align: "left" },
      { text: "수령자", value: "recvNm", align: "center" },
      { text: "연락처", value: "recvPhone", align: "center" },
      { text: "배송지", value: "address", align: "center" },
      { text: "결제금액", value: "pri", align: "center" },
      { text: "", value: "actions", align: "center" },
    ],
    OptionList: [
      { name: "품목명", cd: "prdNm" },
      { name: "수령자명", cd: "acepNm" },
    ],
    optionCd: "prdNm",
    procCd: "",
    searchValue: "",
    dates: [],
    menu: false,
    modiDialog: false,
    editObjList: [],
    date: [
      new Date(
        Date.now() -
          new Date().getTimezoneOffset() * 60000 -
          60000 * 60 * 24 * 360
      )
        .toISOString()
        .substr(0, 10),
      new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000 + 60000 * 60 * 24
      )
        .toISOString()
        .substr(0, 10),
    ],
    paymentDrawer: false,
    selected: [],
    paymentObj: null,
    paymentInfoDrawer: false,
  }),
  computed: {
    ...mapGetters("common", ["ProcList", "OrderProc", "DeliList"]),
    ...mapGetters("order", ["OrderMngList"]),
    dateRangeText() {
      return this.date.join(" ~ ");
    },
  },
};
</script>

<style scoped></style>
