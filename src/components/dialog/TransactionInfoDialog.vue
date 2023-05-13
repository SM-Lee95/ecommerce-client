<template>
  <v-container class="white">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-row class="pa-1"
        ><v-col class="text-h6">배송 정보</v-col>
        <v-col class="text-right">
          <v-btn icon @click="close" right>
            <v-icon>mdi-close-box</v-icon>
          </v-btn></v-col
        ></v-row
      >
      <v-divider v-if="version == 'WRITE'"></v-divider>
      <v-row class="pa-1 mt-2 ml-1" v-if="version == 'WRITE'"
        ><v-col cols="8">
          <v-menu
            v-model="menu1"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <validation-provider
                v-slot="{ errors }"
                name="완료일자"
                rules="required|dateFormat"
              >
                <v-text-field
                  v-model="dateFormatted"
                  label="완료일자"
                  hint="YYYY-MM-DD"
                  persistent-hint
                  :messages="errors"
                  v-bind="attrs"
                  @blur="compDate = parseDate(dateFormatted)"
                  v-on="on"
                ></v-text-field>
              </validation-provider>
            </template>
            <v-date-picker v-model="compDate" no-title></v-date-picker> </v-menu
        ></v-col>
        <v-col class="text-right" align-self="center">
          <v-btn text @click="completeDelivery" block :disabled="invalid"
            >배송완료처리</v-btn
          ></v-col
        ></v-row
      >
      <v-divider></v-divider>
      <v-row>
        <v-col>
          <v-data-table
            :headers="header"
            :items="TransactionInfo"
            class="mt-3"
            hide-default-footer
            show-select
            item-key="transactionKey.traCd"
            disable-sort
            v-model="selected"
            calculate-widths
            :items-per-page="-1"
            no-data-text="배송 건이 존재하지 않습니다."
          >
            <template v-slot:item.parcelCd="{ item }"
              ><v-row no-gutters
                ><v-col class="text-caption">{{
                  getDeliName(item.parcelCd)
                }}</v-col></v-row
              >
            </template>
            <template v-slot:item.info="{ item }"
              ><v-row no-gutters
                ><v-col class="text-caption"
                  ><v-btn
                    text
                    @click="getOrderDetail(item.transactionKey.ordsCd)"
                    small
                    >{{
                      item.transactionKey.ordsCd +
                      " - " +
                      item.transactionKey.listCd
                    }}</v-btn
                  ></v-col
                ></v-row
              >
            </template>
            <template v-slot:item.traCd="{ item }"
              ><v-row no-gutters
                ><v-col class="text-caption"
                  ><v-btn
                    text
                    @click="getDeliInfo(item.transactionKey.traCd)"
                    small
                    >{{ item.transactionKey.traCd }}</v-btn
                  ></v-col
                ></v-row
              >
            </template>
            <template v-slot:item.cnt="{ item }"
              ><v-row no-gutters
                ><v-col class="text-caption">{{
                  item.cnt + "개"
                }}</v-col></v-row
              >
            </template>
            <template v-slot:item.compDati="{ item }"
              ><v-row no-gutters
                ><v-col class="text-caption">{{ item.compDati }}</v-col></v-row
              >
            </template>
          </v-data-table></v-col
        >
      </v-row>
    </validation-observer>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    version: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    header: [
      { text: "택배사", value: "parcelCd", align: "start", width: "150px" },
      { text: "주문번호", value: "info", align: "center" },
      { text: "운송번호", value: "traCd", align: "center" },
      { text: "상품갯수", value: "cnt", align: "start" },
      { text: "완료일자", value: "compDati", align: "start" },
    ],
    selected: [],
    compDate: "",
    menu1: false,
    dateFormatted: new Date(Date.now()).toISOString().substr(0, 10),
  }),
  computed: {
    ...mapGetters("order", ["TransactionInfo"]),
    ...mapGetters("common", ["DeliList"]),
  },
  methods: {
    parseDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    getDeliInfo(traCd) {
      this.$deliInfoPopup(traCd);
    },
    getDeliName(parcelCd) {
      return this.DeliList.filter((vo) => vo.commonKey.commCd == parcelCd)[0]
        .name;
    },
    completeDelivery() {
      if (this.selected.length == 0) {
        this.$dialog.message.error("배송 건 선택 후 진행해주세요.");
        return;
      }
      if (
        this.selected.filter((vo) => {
          if (vo.compDati) {
            this.$dialog.message.error(
              "배송 일자가 없는 건만 처리 가능합니다."
            );
            return true;
          }
          return false;
        }).length
      ) {
        return;
      }
      this.$dialog
        .confirm({
          title: "배송 완료 처리",
          text: "해당 운송번호와 동일한 건들이 선택 날짜로 배송 완료 처리됩니다.",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let reqData = {
            transactionList: this.selected,
            compDate: this.dateFormatted,
          };
          this.$store
            .dispatch("order/updateTransProc", reqData)
            .then((resp) => {
              if (resp) {
                this.$dialog.message.info("수정되었습니다.");
                this.close();
              } else this.$dialog.message.error("수정에 실패하셨습니다.");
            });
        });
    },
    selectedRefresh() {
      this.selected.splice(0, this.selected.length);
    },
    close() {
      this.selectedRefresh();
      this.$emit("close");
    },
    getOrderDetail(ordsCd) {
      this.$store.dispatch("order/getOrderDetailInfo", ordsCd).then((resp) => {
        if (resp) {
          if (this.$route.path != "/OrderDetailPage")
            this.$router.push("/OrderDetailPage");
        } else {
          this.$dialog.message.error(
            "주문 상세 정보를 가져오는데 실패했습니다."
          );
        }
      });
    },
  },
  watch: {
    compDate() {
      this.dateFormatted = this.parseDate(this.compDate);
    },
  },
};
</script>
