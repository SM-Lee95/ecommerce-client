<template>
  <v-container fluid>
    <v-row>
      <v-col class="text-center">
        <v-menu
          v-for="catalog in MenuList"
          :key="catalog.cd"
          open-on-hover
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="updateList(catalog.cd)"
              v-bind="attrs"
              class="button mr-6"
              text
              v-on="on"
              v-if="catalog.children && catalog.children.length != '0'"
              >{{ catalog.name }}
            </v-btn>
            <v-btn
              @click="updateList(catalog.cd)"
              text
              class="button mr-6"
              v-if="!catalog.children || catalog.children.length == 0"
              >{{ catalog.name }}
            </v-btn>
          </template>
          <v-list flat rounded elevation="0">
            <v-list-item
              v-for="subCatalog in catalog.children"
              :key="subCatalog.cd"
              :value="subCatalog"
              no-gu
            >
              <v-btn class="caption" text @click="updateList(subCatalog.cd)">{{
                subCatalog.name
              }}</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
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
    updateList(param) {
      this.$store
        .dispatch("product/getItemList", { param: param, page: 0 })
        .then((resp) => {
          if (resp) {
            if (this.$route.path != "/") this.$router.push("/");
          } else this.$dialog.message.error("상품 목록 조회에 실패했습니다.");
        });
    },
  },
};
</script>
