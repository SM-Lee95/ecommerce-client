<template>
  <v-container fluid>
    <v-toolbar flat>
      <v-row>
        <v-col cols="3">
          <v-select
            :items="AnswerFlagList"
            item-text="name"
            item-value="cd"
            v-model="answerYn"
            flat
            prepend-inner-icon="mdi-magnify"
            label="답변여부"
          ></v-select>
        </v-col>
        <v-col cols="3">
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
        <v-col cols="5">
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
    <v-divider inset></v-divider>
    <v-row>
      <v-col>
        <v-data-table
          :headers="header"
          :items="QnaList"
          disable-sort
          class="elevation-0 mt-2"
          item-key="cd"
          no-data-text="작성된 Q&A가 존재하지 않습니다."
        >
          <template v-slot:item.answerYn="{ item }">
            {{ item.answerYn == "Y" ? "완료" : "답변필요" }}
          </template>
          <template v-slot:item.question="{ item }">
            <v-row no-gutters>
              <v-col>
                <v-btn text @click="updateAnswerDialogDrawer(item)">
                  {{ item.question }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters v-if="item.answerYn == 'Y'">
              <v-col class="red--text"> 답변 : {{ item.answer }} </v-col>
            </v-row>
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
    <v-dialog v-model="updateAnswerDialog"
      ><answer-write-dialog
        v-on:close="updateAnswerDialogDrawer"
      ></answer-write-dialog
    ></v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import AnswerWriteDialog from "./dialog/AnswerWriteDialog.vue";
export default {
  name: "ProductMngPage",
  data: () => ({
    header: [
      { text: "답변상태", value: "answerYn", align: "center" },
      { text: "문의", value: "question", align: "start" },
      { text: "작성자", value: "userId", align: "center" },
      { text: "작성일자", value: "regDati", align: "center" },
    ],
    OptionList: [
      { name: "품목명", cd: "prdNm" },
      { name: "사용자명", cd: "custNm" },
    ],
    AnswerFlagList: [
      { name: "전체", cd: "" },
      { name: "답변대기", cd: "N" },
      { name: "답변완료", cd: "Y" },
    ],
    answerYn: "",
    optionCd: "prdNm",
    searchValue: "",
    updateAnswerDialog: false,
  }),
  components: {
    AnswerWriteDialog,
  },
  computed: {
    ...mapGetters("common", ["QnaList"]),
  },
  methods: {
    searchList() {
      let param = new Object();
      param.yn = this.answerYn;
      param.optionCd = this.optionCd;
      param.searchValue = this.searchValue;
      this.$store
        .dispatch("common/selectQuestionList", { params: param })
        .then((resp) => {
          if (!resp) {
            this.$dialog.message.error("조회 중 오류가 발생했습니다.");
          }
        });
    },
    updateAnswerDialogDrawer(item) {
      if (item) this.$store.commit("common/setAnswerWriteInfo", item);
      this.updateAnswerDialog = !this.updateAnswerDialog;
    },
  },
};
</script>

<style scoped></style>
