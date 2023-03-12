<template>
  <v-container fluid class="white">
    <v-row><v-col> </v-col></v-row>
    <v-row class="mt-1">
      <v-col class="mt-1 ml-1 text-h6">
        <v-icon large>mdi-pencil</v-icon>답변 등록</v-col
      >
      <v-col class="text-right"> 등록자 : {{ AnswerWriteInfo.userId }} </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-1"
      ><v-col>
        <v-textarea
          outlined
          label="Question"
          readonly
          v-model="AnswerWriteInfo.question"
        ></v-textarea> </v-col
    ></v-row>
    <v-divider inset></v-divider>
    <v-row>
      <v-col>
        <v-textarea outlined v-model="answer" label="답변 작성"></v-textarea>
      </v-col>
    </v-row>
    <v-row class="text-right" no-gutters>
      <v-col>
        <v-btn text @click="insertAnswerInfo"> 작성하기 </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      answer: "",
    };
  },
  computed: {
    ...mapGetters("common", ["AnswerWriteInfo"]),
  },
  methods: {
    insertAnswerInfo() {
      this.$dialog
        .confirm({
          title: "답변 작성",
          text: "답변을 작성하시겠습니까?",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let reqData = {
            answer: this.answer,
            cd: this.AnswerWriteInfo.cd,
          };
          this.$store
            .dispatch("common/updateAnswerInfo", reqData)
            .then((resp) => {
              if (resp) {
                this.$dialog.message.info("답변 작성이 완료되었습니다.");
                this.$emit("close");
              } else {
                this.$dialog.message.error("답변 작성에 실패하였습니다.");
              }
            });
        });
    },
  },
};
</script>

<style></style>
