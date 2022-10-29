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
                <v-date-picker
                  v-model="date"
                  no-title
                  scrollable
                  range
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(date)"
                  >
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
              <v-btn text @click="searchList">
                검색
              </v-btn>
            </v-col>
          </v-row>
        </v-toolbar>
        <v-data-table
          :headers="header"
          :items="OrderMngList"
          class="elevation- mt-3"
          hide-default-footer
          disable-sort
          no-data-text="주문 건이 존재하지 않습니다."
        >
          <template v-slot:item.date="{ item }">
            {{ item.regDati[0] + "/" + item.regDati[1] + "/" + item.regDati[2] }}
          </template>
          <template v-slot:item.cd="{item}">
            {{ item.cd }}
          </template>
          <template v-slot:item.info="{item}">
            <v-btn text @click="getOrderDetail(item.cd)">
              {{ item.ordsDoc }}
            </v-btn>
          </template>
          <template v-slot:item.pri="{item}">
            {{ item.totPri.comma() + " 원" }}
          </template>
          <template v-slot:item.proc="{item}">
            {{ OrderProcList[item.procTy] }}
          </template>
          <template v-slot:item.address="{item}">
            ({{ item.postcode }})
            {{ item.mainAddress }}
            {{ item.etcAddress }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              @click="editDialog(item)"
            >
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-dialog
          v-model="modiDialog"
          width="85%"
        >
          <order-mng-page-modi-dialog></order-mng-page-modi-dialog>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import OrderMngPageModiDialog from "./OrderMngPageModiDialog";
export default {
  name: "OrderMngPage",
  components: {OrderMngPageModiDialog},
  methods: {
    editDialog(item){
      this.$store.commit("setOrderEditObjList",Object.assign({},item));
      this.modiDialog = !this.modiDialog;
    },
    searchList(){
      let reqData = {
        procCd: this.procCd,
        optionCd: this.optionCd,
        searchValue: this.searchValue,
        beforeDati: this.date[0],
        afterDati: this.date[1],
      };
      this.$store.dispatch("selectOrderMngList", reqData).then((resp) => {
        if (!resp) this.$dialog.message.warning("조회 중 에러가 발생했습니다.");
      });
    },
    getOrderDetail(ordsCd) {
      this.$store.dispatch("getOrderDetailInfo", ordsCd).then((resp) => {
        if (resp) {
          this.$router.push("/OrderDetailPage");
        } else {
          this.$dialog.message.error("주문 상세 정보를 가져오는데 실패했습니다.");
        }
      });
    },
  },
  data: ()=>({
    header: [
      { text: "주문일자", value: "date", align: "center" },
      { text: "주문번호", value: "cd", align: "center" },
      { text: "주문정보", value: "info", align: "center" },
      { text: "배송주소", value: "address", align: "center" },
      { text: "연락처", value: "recvPhone", align: "center" },
      { text: "수령자", value: "recvNm", align: "center" },
      { text: "결제금액", value: "pri", align: "center" },
      { text: "주문상태", value: "proc", align: "center" },
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
    date: [(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000 - (60000*60*24*30))).toISOString().substr(0, 10),new Date(Date.now()- (new Date()).getTimezoneOffset() * 60000).toISOString().substr(0, 10)],
  }),
  computed: {
    ...mapGetters(["ProcList","OrderMngList","OrderProcList","DeliList"]),
    dateRangeText () {
      return this.date.join(' ~ ')
    },
  },
};
</script>

<style scoped>

</style>