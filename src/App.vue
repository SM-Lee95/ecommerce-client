<template>
  <v-app>
    <v-row style="max-height: 35px;min-height: 35px;">
      <v-col>
        <Header/>
      </v-col>
    </v-row>
    <v-row style="min-height: 60px;max-height: 60px; min-width: 100%">
      <v-col>
        <MenuBar/>
      </v-col>
    </v-row>
    <v-row style="min-height: available;">
      <v-col>
          <router-link to="/"></router-link>
          <router-view />
      </v-col>
    </v-row>
    <v-row  style="height: 35px">
      <v-col>
      <Footer/>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import Footer from './layout/Footer.vue'
import Header from './layout/Header.vue'
import MenuBar from './layout/MenuBar.vue'

export default {
  name: "App",
  components: {
    Footer,
    Header,
    MenuBar,
  },
  data: () => ({
    //
  }),
};
</script>
<style>
@font-face {
  font-family: "mainFont";
  src: url('./assets/oneMobileRegular.ttf')
}
#App{
  font-family: mainFont;
}
</style>
