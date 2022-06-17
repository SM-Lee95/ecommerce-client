<template>
  <v-sheet
    class="mx-auto"
    height="100%"
  >
    <v-sheet height="70%"></v-sheet>
    <v-slide-group
      multiple
    >
      <v-slide-item
        v-for="catalog in Catalogs"
        :key="catalog.cd"
        v-slot="{ active }"
      >
        <v-btn
          @click="updateList(catalog.cd)"
          v-text="catalog.name"
          :input-value="active"
          text
        >
        </v-btn>
      </v-slide-item>
    </v-slide-group>
  </v-sheet>
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
      this.$store.dispatch("getItemList",{param:param,page:0}).then(()=>{
        if(this.$route.path !="/")
          this.$router.push("/");
      });
    },
  },
}
</script>

<style scoped>

</style>