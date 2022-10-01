<template>
  <v-container fluid class="mt-3">
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
            <v-card>
              <v-card-title class="text-h6">
                주문 상태 수정
              </v-card-title>
              <v-divider></v-divider>
              <v-card-actions>
                <v-row class="text-right">
                  <v-col>
                    <v-btn
                      text
                      @click="saveInfoProc"
                    >
                      주문 상태 수정
                    </v-btn>
                    <v-btn
                      text
                      @click="saveDtlProc"
                    >
                      개별 주문 상태 수정
                    </v-btn>
                    <v-btn
                      text
                      @click="createTrdInfo"
                    >
                      운송장 등록
                    </v-btn>
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
                  :items="editObjList.orderDtlDtoList"
                  class="elevation- mt-3"
                  hide-default-footer
                  show-select
                  item-key="ordsDtlKey.listCd"
                  v-model="selected"
                  disable-sort
                  no-data-text="주문 건이 존재하지 않습니다."
                >
                  <template v-slot:item.thumbnail="{item}">
                    <v-img :src="item.thumbnail" max-height="100%" min-height="100%" max-width="100"></v-img>
                  </template>
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
                        옵션 : {{ item.color + " / " + item.size }}
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:item.originPri="{item}">
                    {{ item.applyPri.comma() + " 원" }}
                  </template>
                  <template v-slot:item.discountRate="{item}">
                    {{ item.discountRate + " %" }}
                  </template>
                  <template v-slot:item.salesPri="{item}">
                    {{ item.applyPri.comma() + " 원" }}
                  </template>
                  <template v-slot:item.cnt="{item}">
                    {{ item.cnt + " 개" }}
                  </template>
                  <template v-slot:item.subSumPri="{item}">
                    {{ (String(Number(item.applyPri) * Number(item.cnt))).comma() + " 원" }}
                  </template>
                  <template v-slot:item.proc="{item}">
                      {{ OrderProcList[item.procTy] }}
                  </template>
                  <template v-slot:item.traCd="{item}">
                    <v-btn text @click="getDeliInfo(item.traCd)">{{ item.traCd }}</v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-divider></v-divider>
            </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "OrderMngPage",
  methods: {
    getDeliInfo(traCd){
      console.log(traCd);
    },
    editDialog(item){
      this.editObjList = Object.assign({},item);
      this.procTy = this.editObjList.procTy;
      this.modiDialog = !this.modiDialog;
    },
    saveDtlProc(){
      this.$dialog.confirm({
        title: "개별 주문 상태 수정",
        text: this.OrderProcList[this.procTy]+" 로 선택된 품목의 주문 상태가 수정됩니다.",
        showClose: false
      }).then((resp) => {
        if (!resp) return;
        let reqData = {
          procTy: this.procTy,
          ordsDtlList: this.selected,
        }
        this.$store.dispatch("updateOrdsDtlProc", reqData).then((resp) => {
          if (resp) this.$dialog.message.info("수정되었습니다.");
          else this.$dialog.message.error("수정에 실패하셨습니다.");
          this.modiDialog = false;
          this.searchList();
        });
      });
    },
    saveInfoProc(){
      this.$dialog.confirm({
        title: "주문 상태 수정",
        text: this.OrderProcList[this.procTy]+" 로 해당 주문의 모든 품목 주문 상태가 수정됩니다.",
        showClose: false
      }).then((resp) => {
        if (!resp) return;
        let reqData = {
          procTy: this.procTy,
          ordsCd: this.editObjList.cd,
        }
        this.$store.dispatch("updateOrdsInfoProc", reqData).then((resp) => {
          if (resp) this.$dialog.message.info("수정되었습니다.");
          else this.$dialog.message.error("수정에 실패하셨습니다.");
          this.modiDialog = false;
          this.searchList();
        });
      });
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
      console.log(ordsCd);
      this.$store.dispatch("getOrderDetailInfo", ordsCd).then((resp) => {
        if (resp) {
          this.$router.push("/OrderDetailPage");
        } else {
          this.$dialog.message.error("주문 상세 정보를 가져오는데 실패했습니다.");
        }
      });
    },
    createTrdInfo(){
      if(this.selected.length == 0){
        this.$dialog.message.error('품목 선택 후 진행해주세요.');
        return;
      }
      this.$dialog.prompt({
        title: "운송장 등록",
        text: "운송장 번호를 입력해주세요.",
        showClose: false
      }).then((resp) => {
        if(resp == false)return;
        if(!resp){
          this.$dialog.message.error('입력되지 않았습니다.');
          return;
        }
        if(isNaN(resp)){
          this.$dialog.message.error('숫자만 입력해주세요.');
          return;
        }
        let reqData = {
          traCd: resp,
          parcelCd: 1,
          orderDtlDtoList: this.selected,
        }
        this.$store.dispatch("insertTraList", reqData).then((resp) => {
          if (resp) this.$dialog.message.info("등록되었습니다.");
          else this.$dialog.message.error("등록에 실패하셨습니다.");
          this.modiDialog = false;
          // this.searchList();
        });
      });;
    }
  },
  data: ()=>({
    header: [
      { text: "주문일자", value: "date", align: "center" },
      { text: "주문번호", value: "cd", align: "center" },
      { text: "주문정보", value: "info", align: "center" },
      { text: "배송주소", value: "address", align: "center" },
      { text: "연락처", value: "recvPhone", align: "center" },
      { text: "수령자", value: "recvNm", align: "center" },
      { text: "운송장번호", value: "traCd", align: "center" },
      { text: "결제금액", value: "pri", align: "center" },
      { text: "주문상태", value: "proc", align: "center" },
      { text: "", value: "actions", align: "center" },
    ],
    detailHeader:[
      { value: "thumbnail", align: "center" },
      { text: "상품정보", value: "prdInfo", align: "start"},
      { text: "금액", value: "originPri", align: "start"},
      { text: "할인율", value: "discountRate", align: "center" },
      { text: "할인금액", value: "salesPri", align: "start" },
      { text: "수량", value: "cnt", align: "center" },
      { text: "합계금액", value: "subSumPri", align: "start" },
      { text: "주문상태", value: "proc", align: "center" }
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
    procTy: 0,
    selected: [],
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