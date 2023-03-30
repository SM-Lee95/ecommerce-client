<template>
  <v-container fluid>
    <v-row class="text-right"
      ><v-col>
        <v-btn text @click="qnaWriteDialogView">Q&A 작성하기</v-btn>
        <v-btn text @click="goMyQnA">내 Q&A 보기</v-btn>
      </v-col></v-row
    >
    <v-row>
      <v-col>
        <v-data-table
          :headers="header"
          :items="DetailInfo.questionLists"
          disable-sort
          class="elevation-0 mt-2"
          item-key="cd"
          no-data-text="작성된 Q&A가 존재하지 않습니다."
        >
          <template v-slot:item.answerYn="{ item }">
            {{ item.answerYn == "Y" ? "완료" : "답변필요" }}
          </template>
          <template v-slot:item.question="{ item }">
            <v-btn
              @click="qnaInfoDialogView(item)"
              :disabled="
                (item.secretYn == 'N' ||
                  (UserInfo && UserInfo.cd == item.userCd)) &&
                item.answerYn == 'Y'
                  ? false
                  : true
              "
              text
              >{{
                item.secretYn == "N" || !UserInfo || UserInfo.cd == item.userCd
                  ? item.question
                  : "비밀글입니다."
              }}</v-btn
            >
          </template>
          <template v-slot:item.userId="{ item }">
            {{ item.userId.substring(0, 2) + "****" }}
          </template>
          <template v-slot:item.regDati="{ item }">
            {{ item.regDati.substring(0, 10) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="qnaInfoDialogFlag" max-width="40%">
      <qn-a-info-dialog></qn-a-info-dialog>
    </v-dialog>
    <v-dialog v-model="qnaWriteDialogFlag" max-width="40%">
      <qn-a-write-dialog v-on:close="qnaWriteDialogView"></qn-a-write-dialog>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import QnAInfoDialog from "./dialog/QnAInfoDialog.vue";
import QnAWriteDialog from "./dialog/QnAWriteDialog.vue";

export default {
  components: { QnAInfoDialog, QnAWriteDialog },
  name: "QnAInfo.vue",
  data() {
    return {
      header: [
        { text: "답변상태", value: "answerYn", align: "center" },
        { text: "문의", value: "question", align: "start" },
        { text: "작성자", value: "userId", align: "center" },
        { text: "작성일자", value: "regDati", align: "center" },
      ],
      qnaInfoDialogFlag: false,
      qnaWriteDialogFlag: false,
    };
  },
  computed: {
    ...mapGetters("product", ["DetailInfo"]),
    ...mapGetters("user", ["UserInfo"]),
  },
  methods: {
    qnaInfoDialogView(item) {
      if (item) {
        let body = new Array();
        body.push(item);
        this.$store.commit("product/setQnaDetailInfo", body);
      }
      this.qnaInfoDialogFlag = !this.qnaInfoDialogFlag;
    },
    qnaWriteDialogView() {
      if (!this.UserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.qnaWriteDialogFlag = !this.qnaWriteDialogFlag;
    },
    goMyQnA() {
      if (!this.UserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("order/getMyPageInfo").then((resp) => {
        if (resp) {
          if (this.$route.path != "/MyPage") this.$router.push("/MyPage");
        } else this.$dialog.message.error("주문 정보 확인에 실패했습니다.");
      });
    },
  },
};
</script>

<style></style>
