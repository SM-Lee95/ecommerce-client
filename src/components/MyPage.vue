<template>
  <v-container class="pa-15">
    <v-dialog v-model="userInfoDrawer" width="600px">
      <v-container class="white">
        <v-row>
          <v-col>
            <v-row class="mt-1" justify="space-between">
              <v-col class="ml-5 mt-1 text-h6"> 개인정보수정 </v-col>
              <v-col></v-col>
              <v-col class="text-right">
                <v-btn icon @click.stop="setUserInfoDrawer" right>
                  <v-icon>mdi-close-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col>
                <modi-info-page />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-dialog>
    <v-row>
      <v-col class="text-h4"> MyPage </v-col>
    </v-row>
    <v-row>
      <v-col cols="2"></v-col>
      <v-col align-self="center" cols="7">
        <v-row>
          <v-col cols="3" class="text-h5">{{ UserInfo.name }}</v-col>
          <v-col cols="6" class="text-h6"> ({{ UserInfo.id }}) </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <v-btn class="mx-2" text @click.stop="setUserInfoDrawer">
          회원정보 확인/변경
        </v-btn>
        <v-btn class="mx-2" text @click="myQnaInfoDrawer"> 내 Q&A 보기 </v-btn>
      </v-col>
    </v-row>
    <!--요약 화면-->
    <v-row justify="space-around">
      <v-col>
        <v-btn
          v-for="(process, index) in OrderHisSummary"
          :key="index"
          text
          @click="getHisList(index)"
        >
          {{ index + " : " + process }}
        </v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-5 ml-2">
      <v-col>
        주문 목록 / 배송 조회 내역 총 {{ this.OrderHisList.length }} 건
      </v-col>
    </v-row>
    <v-data-table
      :headers="header"
      :items="this.OrderHisList"
      class="mt-5"
      disable-sort
      no-data-text="주문 건이 존재하지 않습니다."
    >
      <template v-slot:item.date="{ item }">
        {{ item.regDati.substr(2, 8) }}
      </template>
      <template v-slot:item.cd="{ item }">
        <v-btn block text @click="getOrderDetail(item.ordsDtlKey.ordsCd)">
          {{ item.ordsDtlKey.ordsCd }}</v-btn
        >
      </template>
      <template v-slot:item.info="{ item }">
        <v-row no-gutters>
          <v-col class="text-left text-caption">
            <v-btn small text @click="getDetailInfo(item.prdCd)">
              {{ item.name }}
            </v-btn>
          </v-col></v-row
        >
        <v-row no-gutters>
          <v-col class="text-left text-caption">
            옵션 :
            {{ item.color + " / " + item.size + " / " + item.cnt + "개" }}
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.pri="{ item }">
        {{ item.applyPri.comma() + " 원" }}
      </template>
      <template v-slot:item.proc="{ item }">
        {{ OrderProcList[item.procTy] }}
      </template>
    </v-data-table>
    <v-dialog v-model="myQnaInfoDialogFlag" width="800px">
      <qna-info-dialog-vue></qna-info-dialog-vue>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import modiInfoPage from "./dialog/ModiInfoPage.vue";
import QnaInfoDialogVue from "./dialog/QnAInfoDialog.vue";
export default {
  components: {
    modiInfoPage,
    QnaInfoDialogVue,
  },
  data: () => ({
    userInfoDrawer: false,
    myQnaInfoDialogFlag: false,
    header: [
      { text: "주문번호(주문상세)", value: "cd", align: "center" },
      { text: "주문일자", value: "date", align: "center" },
      { text: "상품명", value: "info", align: "left" },
      { text: "결제금액", value: "pri", align: "center" },
      { text: "주문상태", value: "proc", align: "center" },
    ],
  }),
  computed: {
    ...mapGetters("order", ["OrderHisList", "OrderHisSummary"]),
    ...mapGetters("user", ["UserInfo"]),
    ...mapGetters("common", ["OrderProcList"]),
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
    setUserInfoDrawer() {
      this.userInfoDrawer = !this.userInfoDrawer;
    },
    getHisList(flag) {
      var code = "";
      for (var codeVal in this.OrderProcList) {
        if (flag.includes(this.OrderProcList[codeVal]))
          code = code.concat(codeVal + ",");
      }
      this.$store.dispatch("order/getMyPageInfo", code).then((resp) => {
        if (!resp)
          this.$dialog.message.error(
            flag + " 상태의 주문 정보 확인에 실패했습니다."
          );
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
    myQnaInfoDrawer(flag) {
      if (flag) {
        this.$store.dispatch("product/selectMyQnaInfoList").then((resp) => {
          if (resp) {
            this.myQnaInfoDialogFlag = !this.myQnaInfoDialogFlag;
          } else {
            this.$dialog.message.error(
              "QnA 정보를 가져오는데 오류가 발생했습니다."
            );
          }
        });
      } else this.myQnaInfoDialogFlag = !this.myQnaInfoDialogFlag;
    },
  },
  mounted() {},
};
</script>
<style scoped></style>
