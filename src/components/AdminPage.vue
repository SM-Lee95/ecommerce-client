<template>
  <v-container fluid fill-height style="align-items: inherit">
    <v-row no-gutters>
      <v-col cols="2" class="grey lighten-3">
        <v-list class="grey lighten-3">
          <v-list-item link @click="goProductMng" dense small>
            <v-list-item-icon>
              <v-icon>mdi-hanger</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> 상품 관리 </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="goOrderMng" dense>
            <v-list-item-icon>
              <v-icon>mdi-order-bool-descending-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> 주문 관리 </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="goTransMng" dense>
            <v-list-item-icon>
              <v-icon>mdi-truck-delivery-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> 배송 관리 </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="goUserMng" dense>
            <v-list-item-icon>
              <v-icon>mdi-account-box</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> 이용자 관리 </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="goCommonMng" dense>
            <v-list-item-icon>
              <v-icon>mdi-barcode</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> 공통코드 관리 </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="goQnaMng" dense>
            <v-list-item-icon>
              <v-icon>mdi-head-question-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Q&A 관리 </v-list-item-title>
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
      if (this.$route.path != "/Admin/ProductMng/SelectPrd") {
        this.$store
          .dispatch("product/selectPrdList", {
            cateCd: 0,
          })
          .then((resp) => {
            if (!resp)
              this.$dialog.message.warning("조회 중 에러가 발생했습니다.");
          });
        this.$router.push("/Admin/ProductMng/SelectPrd");
      }
    },
    goOrderMng() {
      if (this.$route.path != "/Admin/OrderMng") {
        this.$store
          .dispatch("order/selectOrderMngList", {
            beforeDati: new Date(
              Date.now() -
                new Date().getTimezoneOffset() * 60000 -
                60000 * 60 * 24 * 360
            )
              .toISOString()
              .substr(0, 10),
            afterDati: new Date(
              Date.now() -
                new Date().getTimezoneOffset() * 60000 +
                60000 * 60 * 24
            )
              .toISOString()
              .substr(0, 10),
          })
          .then((resp) => {
            if (!resp)
              this.$dialog.message.warning("조회 중 에러가 발생했습니다.");
          });
        this.$router.push("/Admin/OrderMng");
      }
    },
    goTransMng() {
      if (this.$route.path != "/Admin/TransMng") {
        this.$store
          .dispatch("order/selectTransactionList", {
            beforeDati: new Date(
              Date.now() -
                new Date().getTimezoneOffset() * 60000 -
                60000 * 60 * 24 * 120
            )
              .toISOString()
              .substr(0, 10),
            afterDati: new Date(
              Date.now() -
                new Date().getTimezoneOffset() * 60000 +
                60000 * 60 * 24
            )
              .toISOString()
              .substr(0, 10),
          })
          .then((resp) => {
            if (!resp)
              this.$dialog.message.warning("조회 중 에러가 발생했습니다.");
          });
        this.$router.push("/Admin/TransMng");
      }
    },
    goUserMng() {
      if (this.$route.path != "/Admin/UserMng") {
        this.$router.push("/Admin/UserMng");
      }
    },
    goCommonMng() {
      if (this.$route.path != "/Admin/CommonMng") {
        this.$router.push("/Admin/CommonMng");
      }
    },
    goQnaMng() {
      if (this.$route.path != "/Admin/QnaMng") {
        this.$router.push("/Admin/QnaMng");
      }
    },
  },
};
</script>

<style scoped></style>
