<template>
  <v-container fluid>
    <v-row align-content="space-between">
      <v-col></v-col>
      <v-col>
        <v-slide-group>
          <v-slide-item v-for="catalog in MenuList" :key="catalog.cd" v-slot="{ active }">
            <v-btn @click="updateList(catalog.cd)" v-text="catalog.name" :input-value="active" text>
            </v-btn>
          </v-slide-item>
        </v-slide-group>
      </v-col>
      <v-col></v-col>
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
    updateList(param) {
      this.$store.dispatch("product/getItemList", { param: param, page: 0 }).then((resp) => {
        if (resp) {
          if (this.$route.path != "/") this.$router.push("/");
        } else this.$dialog.message.error("상품 목록 조회에 실패했습니다.");
      });
    },
  },
};
</script>
