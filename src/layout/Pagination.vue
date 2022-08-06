<template>
  <div class="text-center">
    <v-pagination
      v-model="Pagination.number"
      :length="Pagination.totalPages"
      color="grey"
      @input="updateList"
    ></v-pagination>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({

  }),
  mounted() {
  },
  methods:{
    updateList(page){
      this.$store.dispatch("getItemList",{page:page-1}).then((resp)=>{
        if(resp){
          if(this.$route.path !="/")
            this.$router.push("/");
        }else
          this.$dialog.message.error("상품 목록 조회에 실패했습니다.");
      })
    },
  },
  computed:{
    ...mapGetters(["Pagination"]),
  }
}
</script>

<style scoped>

</style>