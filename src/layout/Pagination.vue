<template>
  <div class="text-center">
    <v-pagination
      v-model="pageNum"
      :length="Pagination.totalPages"
      circle
      @input="updateList"
    ></v-pagination>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    pageNum: this.Pagination.number+1,
  }),
  mounted() {
    this.$store.dispatch("getItemList",{param:1}).then((resp)=>{
      this.Catalogs = resp;
    })
  },
  methods:{
    updateList(page){
      this.$store.dispatch("getItemList",{page:page-1})
    },
  },
  computed:{
    ...mapGetters(["Pagination"]),
  }
}
</script>

<style scoped>

</style>