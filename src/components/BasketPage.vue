<template>
  <v-container>
    <v-card
      class="mx-auto"
    >
      <v-row no-gutters>
        <v-col cols="2">

      <v-card-title>
        <v-icon large left color="">
          mdi-basket
        </v-icon> 장바구니
      </v-card-title>
        </v-col>
        <v-col cols="8"></v-col>
        <v-col cols="2">
      <v-card-subtitle>
        <b>장바구니</b>  >  주문/결제
      </v-card-subtitle>
        </v-col>
      </v-row>
    </v-card>
<v-divider></v-divider>
  <v-card
    class="mx-auto"
  >
    <v-container>
      <v-row dense
             v-for="(product,index) in BasketList"
             :key="index">
        <v-col>
          <v-card>
            <v-row>
              <v-col cols="3">
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
              </v-col>
              <v-col cols="9">
                <v-card-actions>
                  <v-checkbox
                  v-model="SelectBasketItems[index]"
                  color="indigo"
                  hide-details
                  value="product.productKey"
                ></v-checkbox></v-card-actions>
                <v-card-title class="col-12 text-body-1 text-truncate " v-text="product.name" @click="getDetailInfo(product.cd)"></v-card-title>
                <v-card-text class="col-8 " v-text="'Lovane('+product.corpNm+')'"></v-card-text>
                <v-card-text  class="col-4 text-body-2 text-truncate" v-text="product.depoPri+' 원'"></v-card-text>
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
  name: "BasketPage.vue",
  components:{

  },
  data(){
    return {
    }
  },
  computed:{
    ...mapGetters(["BasketList","SelectBasketItems"]),
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
        this.$store.state.BasketList[index].love = !love;
      })
    },
  }
}
</script>

<style scoped>

</style>