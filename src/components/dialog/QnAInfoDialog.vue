<template>
  <v-container fluid class="white">
    <v-row>
      <v-col>
        <v-data-table
          :headers="header"
          :items="QnaDetailInfo"
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
                {{ item.question }}
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
            {{ item.regDati.substring(0, 10)}}
          </template>
        </v-data-table>
      </v-col>
    </v-row></v-container
  >
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      header: [
        { text: "답변상태", value: "answerYn", align: "center" },
        { text: "문의", value: "question", align: "start" },
        { text: "작성자", value: "userId", align: "center" },
        { text: "작성일자", value: "regDati", align: "center" },
      ],
    };
  },
  computed: {
    ...mapGetters("product", ["QnaDetailInfo"]),
  },
};
</script>

<style></style>
