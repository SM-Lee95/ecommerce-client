<template>
  <v-container fluid fill-height style="align-items: inherit;">
    <v-row no-gutters>
      <v-col cols="2" class="grey lighten-3">
        <v-list class="grey lighten-3">
          <v-list-item link @click="goProductMng" dense small>
            <v-list-item-icon>
              <v-icon>mdi-hanger</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Product </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="goOrderMng" dense>
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Order </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="goUserMng" dense>
            <v-list-item-icon>
              <v-icon>mdi-account-box</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> User </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="goCommonMng" dense>
            <v-list-item-icon>
              <v-icon>mdi-barcode</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Common </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="goQnaMng" dense>
            <v-list-item-icon>
              <v-icon>mdi-head-question-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Q&A </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="10">
        <router-view></router-view>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AdminPage.vue",
  methods: {
    goProductMng() {
      if (this.$route.path != "/Admin/ProductMng/SelectPrd")
        this.$router.push("/Admin/ProductMng/SelectPrd");
    },
    goOrderMng() {
      if (this.$route.path != "/Admin/OrderMng")
        this.$router.push("/Admin/OrderMng");
    },
    goUserMng() {
      if (this.$route.path != "/Admin/UserMng")
        this.$router.push("/Admin/UserMng");
    },
    goCommonMng() {
      if (this.$route.path != "/Admin/CommonMng")
        this.$router.push("/Admin/CommonMng");
    },
    goQnaMng(){
      if (this.$route.path != "/Admin/QnaMng")
        this.$router.push("/Admin/QnaMng");
    }
  },
};
</script>

<style scoped>
</style>