<template>
  <v-app>
    <div id="header">
      <Header/>
      <router-link to="/"></router-link>
    </div>
    <v-main>
      <router-view />
    </v-main>
    <div id="footer">
      <Footer/>
    </div>
  </v-app>
</template>

<script>
import Footer from './layout/Footer.vue'
import Header from './layout/Header.vue'

export default {
  name: "App",
  components: {
    Footer,
    Header,
  },
  data: () => ({
    //
  }),
};
</script>
