<template>
  <v-container fluid class="mt-8 white">
    <v-row>
      <v-col class="text-center">
        <v-btn
          v-for="catalog in MenuList"
          :key="catalog.cd"
          @click="updateList(catalog)"
          text
          >{{ catalog.name }}
        </v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    Catalogs: null,
  }),
  computed: {
    ...mapGetters("common", ["MenuList"]),
  },
  mounted() {
    this.$store.dispatch("common/getMenuList").then((resp) => {
      if (resp) {
        this.updateList(0);
      } else this.$dialog.message.error("메뉴 조회시 오류가 발생했습니다.");
    });
  },
  methods: {
    updateList(obj) {
      this.$store
        .dispatch("product/getItemList", { param: obj.cd, page: 0 })
        .then((resp) => {
          if (resp) {
            this.$store.commit("common/setSelectedMenu", obj);
            if (this.$route.path != "/") {
              this.$router.push("/");
            }
          } else this.$dialog.message.error("상품 목록 조회에 실패했습니다.");
        });
    },
  },
};
</script>
