<template>
  <v-container fluid class="white">
    <v-row>
      <v-col>
        <v-textarea
          outlined
          v-model="description"
          label="Q & A 작성"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row class="text-right" no-gutters>
      <v-col>
        <v-checkbox
          v-model="secretYn"
          label="비공개여부"
          type="checkbox"
        ></v-checkbox>
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
    insertQnaInfo() {},
  },
};
</script>

<style></style>
