<template>
  <v-app>
    <v-container fluid>
      <v-row style="min-height: 200px" no-gutters>
        <v-col>
          <Header />
        </v-col>
      </v-row>
      <v-row style="min-height: 950px" no-gutters>
        <v-col>
          <router-view />
        </v-col>
      </v-row>
      <v-row style="min-height: 200px" no-gutters>
        <v-col>
          <Footer />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Footer from "./layout/Footer.vue";
import Header from "./layout/Header.vue";

export default {
  name: "App",
  components: {
    Footer,
    Header,
  },
  data: () => ({
    //
  }),
  mounted() {
    this.$store.dispatch("common/selectAllCommonCode").then((resp) => {
      if (!resp)
        this.$dialog.message.warning(
          "공통 코드를 가져오는데 오류가 발생했습니다. 새로고침후 시도해주세요."
        );
    });
  },
};
</script>
<style>
@font-face {
  font-family: "mainFont";
  src: url("./assets/oneMobileRegular.ttf");
}

#App {
  font-family: mainFont;
}
</style>
