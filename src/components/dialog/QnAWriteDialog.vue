<template>
  <v-container class="white">
    <v-row>
      <v-col class="ma-1">
        <v-textarea
          outlined
          v-model="description"
          label="Q & A 작성"
          rows="10"
          auto-grow
          rounded
        ></v-textarea>
        <v-checkbox
          v-model="secretYn"
          label="비공개"
          color="blue lighten-2"
          hide-details
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row class="text-right" no-gutters>
      <v-col>
        <v-btn text @click="insertQnaInfo"> 작성하기 </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      description: "",
      secretYn: false,
    };
  },
  computed: {
    ...mapGetters("product", ["DetailInfo"]),
  },
  methods: {
    insertQnaInfo() {
      console.log(this.description);
      console.log(this.secretYn);
      this.$dialog
        .confirm({
          title: "QnA 작성",
          text: "QnA를 작성하시겠습니까?",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let reqData = {
            question: this.description,
            secretYn: this.secretYn ? "Y" : "N",
            prdCd: this.DetailInfo.cd,
          };
          this.$store
            .dispatch("product/insertQuestionInfo", reqData)
            .then((resp) => {
              if (resp) {
                this.$dialog.message.info("QnA 작성이 완료되었습니다.");
                this.$store.dispatch(
                  "product/getDetailInfo",
                  this.DetailInfo.cd
                );
                this.$emit("close");
              } else {
                this.$dialog.message.error("QnA 작성에 실패하였습니다.");
              }
            });
        });
    },
  },
};
</script>

<style></style>
