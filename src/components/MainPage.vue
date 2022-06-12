<template>
  <v-card
    class="mx-auto"
    width="100%"
    height="100%"
  >
    <v-container fluid>
      <v-row dense>
        <v-col
          v-for="(product,index) in Pagination.content"
          :key="product.cd"
          :cols="2"
        >
          <v-card>
            <v-img
              :src="product.thumbnail"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
              @click="getDetailInfo(product.cd)"
            >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon @click.stop="like(index,product.cd,product.love)" :color="true==product.love?'pink':'black'">
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </v-card-actions>
            </v-img>
            <v-card-title class="col-11 text-body-1 text-truncate" v-text="product.name" @click="getDetailInfo(product.cd)"></v-card-title>
            <v-card-subtitle  class="col-11 text-body-2 text-truncate" v-text="product.description"></v-card-subtitle>
            <v-card-text  class="col-11 text-body-2 text-truncate" v-text="'Price : '+product.depoPri"></v-card-text>
            <v-card-actions>
              <v-btn
                class="mx-2"
                fab
                dark
                x-small
                color="pink"
                @click="goBasket(product.cd)"
              >
                <v-icon dark>
                  mdi-basket
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div id="pagination">
      <pagination/>
    </div>
  </v-card>
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
    ...mapGetters(["Pagination"]),
  },
  methods:{
    getDetailInfo(cd){
      this.$store.dispatch("getDetailInfo",cd).then(()=>{
        this.$router.push("/Detail")
      })
    },
    like(index,cd,love){
      if(this.$store.getters.getUserInfo==null){
        alert("로그인후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("putLike",cd).then(()=> {
        this.$store.state.Pagination.content[index].love = !love;
      })
    },
    goBasket(cd){
      this.$store.dispatch("goBasket",cd).then(()=>{

      })
    }
  }
}
</script>

<style scoped>

</style>