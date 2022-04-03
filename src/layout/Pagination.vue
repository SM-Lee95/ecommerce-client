<template>
  <div class="text-center">
    <v-pagination
      v-model="Pagination.pageable.pageNumber"
      :length="Pagination.totalPages"
      circle
    ></v-pagination>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    page: 1,
  }),
  mounted() {
    this.$store.dispatch("getItemList",{param:1}).then((resp)=>{
      this.Catalogs = resp;
    })
  },
  methods:{
    updateList(param){
      this.$store.dispatch("getItemList",{param:param})
    },
  },
  computed:{
    ...mapGetters(["Pagination"]),
  }
}
</script>

<style scoped>

</style>