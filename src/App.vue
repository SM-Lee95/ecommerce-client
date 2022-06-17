<template>
  <v-app>
    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <Header/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <MenuBar/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
          <router-link to="/"></router-link>
          <router-view />
      </v-col>
    </v-row>
    <v-row>
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
