<template>
  <v-container fluid>
    <v-divider></v-divider>
    <v-row
      ><v-col>
        <v-pagination
          v-model="Pagination.number"
          :length="Pagination.totalPages"
          color="grey"
          @input="updateList"
        ></v-pagination> </v-col
    ></v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({}),
  mounted() {},
  methods: {
    updateList(page) {
      this.$store
        .dispatch("product/getItemList", { page: page - 1 })
        .then((resp) => {
          if (resp) {
            if (this.$route.path != "/") this.$router.push("/");
          } else this.$dialog.message.error("상품 목록 조회에 실패했습니다.");
        });
    },
  },
  computed: {
    ...mapGetters(["Pagination"]),
  },
};
</script>