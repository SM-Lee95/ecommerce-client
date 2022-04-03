<template>
  <v-app>
    <div id="header">
      <Header/>
      <MenuBar/>
      <router-link to="/"></router-link>
    </div>
    <v-main>
      <router-view />
    </v-main>
    <div id="pagination">
      <pagination/>
    </div>
    <div id="footer">
      <Footer/>
    </div>
  </v-app>
</template>

<script>
import Footer from './layout/Footer.vue'
import Header from './layout/Header.vue'
import MenuBar from './layout/MenuBar.vue'
import Pagination from './layout/Pagination.vue'

export default {
  name: "App",
  components: {
    Footer,
    Header,
    MenuBar,
    Pagination,
  },
  data: () => ({
    //
  }),
};
</script>
