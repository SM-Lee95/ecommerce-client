<template>
  <v-card  height="49px">
    <v-app-bar
      color="#7ea098"
      dark
      prominent
      height="49px"
    >
      <v-btn
        class="mx-4 align-self-center"
        fab
        x-small
        dark
        color="#b3d6ce"
      >
        <v-icon>
          mdi-menu
        </v-icon>
      </v-btn>
      <v-divider/>
      <v-row dense class="align-self-center">
        <v-col
          v-for="catalog in Catalogs"
          :key="catalog.cd"
          :cols="1"
        >
          <v-btn
            @click="updateList(catalog.cd)"
            v-text="catalog.name"
            x-small
          >
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    Catalogs: null,
  }),
  mounted() {
    this.$store.dispatch("getMenuList").then((resp)=>{
      this.Catalogs = resp;
    })
  },
  methods:{
    updateList(param){
      this.$store.dispatch("getItemList",{param:param,page:0})
    },
  },
}
</script>

<style scoped>

</style>