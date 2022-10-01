<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col>
          <Header />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <MenuBar />
        </v-col>
      </v-row>
      <v-row style="min-height: 50%">
        <v-col>
          <router-view />
        </v-col>
      </v-row>
      <v-row>
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
import MenuBar from "./layout/MenuBar.vue";

export default {
  name: "App",
  components: {
    Footer,
    Header,
    MenuBar
  },
  data: () => ({
    //
  }),
  mounted() {
    this.$store.dispatch("selectAllCommonCode").then((resp) => {
      if (!resp) this.$dialog.message.warning("공통 코드를 가져오는데 오류가 발생했습니다. 새로고침후 시도해주세요.");
    });
  }
};
</script>
<style>
@font-face {
  font-family: "mainFont";
  src: url('./assets/oneMobileRegular.ttf')
}

#App {
  font-family: mainFont;
}
</style>
