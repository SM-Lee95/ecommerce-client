<template>
  <v-container>
  <v-card
    class="mx-auto"
    width="100%"
    height="100%"
  >
    <v-container fluid>
      <v-row dense>
        <v-col
          v-for="(product,index) in JJimList"
          :key="product.cd"
          :cols="2"
        >
          <v-card>
            <v-row>
              <v-col>
            <v-img
              :src="product.thumbnail"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              max-height="100"
              max-width="130"
              contain
              @click="getDetailInfo(product.cd)"
            >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon @click.stop="like(index,product.cd,product.love)" :color="true==product.love?'pink':'black'">
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </v-card-actions>
            </v-img>
            <v-card-title class="col-12 text-body-1 text-truncate" v-text="product.name" @click="getDetailInfo(product.cd)"></v-card-title>
            <v-card-text  class="col-12 text-body-2 text-truncate" v-text="product.description" @click="getDetailInfo(product.cd)"></v-card-text>
            <v-card-text  class="col-11 text-body-2 text-truncate" v-text="'Price : '+product.depoPri"></v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "JJimPage.vue",
  components:{
  },
  data(){
    return {

    }
  },
  computed:{
    ...mapGetters(["JJimList"]),
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
        this.$store.state.JJimList[index].love = !love;
      })
    },
  }
}
</script>

<style scoped>

</style>