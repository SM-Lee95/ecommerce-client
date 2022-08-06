<template>
  <v-container
  style="min-height: 1000px"
  >
  <v-card
    class="mx-auto"
    width="100%"
    min-height="1000px"
  >
    <v-container fluid >
      <v-row dense style="min-height: 100%">
        <v-col
          v-for="(product,index) in Pagination.content"
          :key="product.cd"
          cols="3"
        >
          <v-card height="100%">
            <v-img
              :src="product.thumbnail"
              class="white--text"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              min-height="70%"
              max-height="70%"
              min-width="100%"
              @click="getDetailInfo(product.cd)"
            >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon @click.stop="like(index,product.cd,product.love)" :color="true==product.love?'pink':'black'">
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </v-card-actions>
            </v-img>
            <v-card-title class="body-2 col-11" v-text="product.name" @click="getDetailInfo(product.cd)"></v-card-title>
            <v-card-subtitle  class="text-right col-11 text-decoration-line-through" v-text="product.salesPri.comma()+' 원'"></v-card-subtitle>
            <v-card-subtitle  class="text-right col-11 text-truncate" v-text="product.discountRate+' %'"></v-card-subtitle>
            <v-card-text  class="body-1 text-right col-11 text-truncate" v-text="String(Number(product.salesPri)*((100-Number(product.discountRate))/100)).comma()+' 원'"></v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container style="align-self: self-end">
      <pagination/>
    </v-container>
  </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from '../layout/Pagination.vue'

export default {
  name: "MainPage.vue",
  components:{
    Pagination,
  },
  data(){
    return {

    }
  },
  computed:{
    ...mapGetters(["Pagination","getUserInfo"]),
  },
  methods:{
    getDetailInfo(cd){
      this.$store.dispatch("getDetailInfo",cd).then((resp)=>{
        if(resp){
          if(this.$route.path != "/Detail")
            this.$router.push("/Detail")
        }else
          this.$dialog.message.error("상품 정보를 조회하는 중에 오류가 발생했습니다.");
      })
    },
    like(index,cd,love){
      if(!this.getUserInfo){
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("putLike",cd).then((resp)=> {
        if(resp){
          this.$dialog.message.success("Success");
          this.$store.state.Pagination.content[index].love = !love;
        }else{
          this.$dialog.message.warning("Fail");
        }
      })
    },
  }
}
</script>

<style scoped>

</style>