<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="header"
          :items="DetailInfo.reviewList"
          disable-sort
          class="elevation-0 mt-2"
          item-key="cd"
          no-data-text="작성된 리뷰가 존재하지 않습니다."
        >
          <template v-slot:item.reviewImage="{ item }">
            <v-img
              :src="item.reviewImageUrl"
              contain
              max-width="100"
              @click="zoomIn(item.reviewImageUrl)"
            ></v-img>
          </template>
          <template v-slot:item.description="{ item }">
            <v-row class="text-caption"
              ><v-col>{{ item.description }}</v-col></v-row
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
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "QnAInfo.vue",
  data() {
    return {
      header: [
        { text: "사진", value: "reviewImage", align: "center" },
        { text: "내용", value: "description", align: "center" },
        { text: "작성자", value: "userId", align: "center" },
        { text: "작성일자", value: "regDati", align: "center" },
      ],
    };
  },
  computed: {
    ...mapGetters("product", ["DetailInfo"]),
    ...mapGetters("user", ["UserInfo"]),
  },
  methods: {
    zoomIn(url) {
      window.open(url);
    },
  },
};
</script>

<style></style>
