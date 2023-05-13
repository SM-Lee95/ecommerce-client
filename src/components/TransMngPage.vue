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
                    label="배송 등록 일자"
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
                item-value="cd"
                v-model="procCd"
                flat
                prepend-inner-icon="mdi-magnify"
                label="배송상태"
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
          <v-col class="text-right" align-self="center">
            <v-btn text @click="deliveryCompDialog">배송완료처리</v-btn></v-col
          >
        </v-row>
        <v-data-table
          :headers="header"
          :items="TransactionList"
          class="elevation- mt-3"
          hide-default-footer
          show-select
          item-key="key"
          v-model="selected"
          no-data-text="주문 건이 존재하지 않습니다."
          group-by="transactionKey.traCd"
          show-group-by
          :items-per-page="-1"
        >
          <template v-slot:item.date="{ item }">
            <v-row no-gutters class="text-caption"
              ><v-col>{{ String(item.regDati).substring(2, 10) }}</v-col></v-row
            >
          </template>
          <template v-slot:item.parcelCd="{ item }"
            ><v-row no-gutters
              ><v-col class="text-caption">{{
                getDeliName(item.parcelCd)
              }}</v-col></v-row
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
              ><v-col class="text-caption">{{ item.cnt + "개" }}</v-col></v-row
            >
          </template>
          <template v-slot:item.compDati="{ item }"
            ><v-row no-gutters
              ><v-col class="text-caption">{{
                item.compDati ? String(item.compDati).substring(2, 10) : "-"
              }}</v-col></v-row
            >
          </template>
          <template v-slot:item.info="{ item }">
            <v-btn
              small
              text
              @click="getOrderDetail(item.transactionKey.ordsCd)"
            >
              {{
                item.transactionKey.ordsCd + " " + item.transactionKey.listCd
              }}
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="deliveryCompDrawer" width="600px" persistent>
      <v-container class="white">
        <v-row class="pa-1">
          <v-col class="text-h6 ml-1">배송 완료 처리</v-col>
          <v-col class="text-right">
            <v-btn icon @click="deliveryCompDialog" right>
              <v-icon>mdi-close-box</v-icon>
            </v-btn></v-col
          >
        </v-row>
        <v-divider></v-divider>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-row class="pa-1 ml-1 mr-1"
            ><v-col>
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
                <v-date-picker v-model="compDate" no-title></v-date-picker>
              </v-menu> </v-col
          ></v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col class="text-right">
              <v-btn text :disabled="invalid" @click="completeDelivery"
                >확인</v-btn
              >
              <v-btn text @click="close">취소</v-btn>
            </v-col>
          </v-row>
        </validation-observer>
      </v-container>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TransMngPage",
  components: {},
  methods: {
    deliveryCompDialog() {
      if (!this.deliveryCompDrawer) {
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
      }
      this.deliveryCompDrawer = !this.deliveryCompDrawer;
    },
    searchList() {
      let reqData = {
        procCd: this.procCd,
        optionCd: this.optionCd,
        searchValue: this.searchValue,
        beforeDati: this.date[0],
        afterDati: this.date[1],
      };
      this.$store
        .dispatch("order/selectTransactionList", { params: reqData })
        .then((resp) => {
          if (!resp)
            this.$dialog.message.warning("조회 중 에러가 발생했습니다.");
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
    selectedRefresh() {
      this.selected.splice(0, this.selected.length);
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
            compDate: this.compDate,
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
    parseDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    getDeliName(parcelCd) {
      return this.DeliList.filter((vo) => vo.commonKey.commCd == parcelCd)[0]
        .name;
    },
  },
  data: () => ({
    header: [
      { text: "등록일자", value: "date", align: "center", groupable: false },
      { text: "주문정보", value: "info", align: "center", groupable: false },
      { text: "운송번호", value: "traCd", align: "center", groupable: false },
      { text: "개수", value: "cnt", align: "center", groupable: false },
      {
        text: "완료일자",
        value: "compDati",
        align: "center",
        groupable: false,
      },
      { text: "택배사", value: "parcelCd", align: "center", groupable: false },
    ],
    OptionList: [
      { name: "주문번호", cd: "ordsCd" },
      { name: "운송장번호", cd: "traCd" },
    ],
    optionCd: "ordsCd",
    ProcList: [
      { name: "배송중", cd: "0" },
      { name: "배송완료", cd: "1" },
    ],
    procCd: "0",
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
    selected: [],
    deliveryCompDrawer: false,
    dateFormatted: new Date(Date.now()).toISOString().substr(0, 10),
    compDate: "",
    menu1: false,
  }),
  computed: {
    ...mapGetters("common", ["DeliList"]),
    ...mapGetters("order", ["TransactionList"]),
    dateRangeText() {
      return this.date.join(" ~ ");
    },
  },
  watch: {
    compDate() {
      this.dateFormatted = this.parseDate(this.compDate);
    },
  },
};
</script>

<style scoped></style>
