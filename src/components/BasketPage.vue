<template>
  <v-container>
    <v-card
      class="mx-auto"
    >
      <v-row no-gutters>
        <v-col cols="2">

      <v-card-title>
        <v-icon large left>
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
            <v-row style="max-height:fit-content;">
              <v-col cols="2" align-self="center">
                <v-row no-gutters>
                  <v-col cols="2"></v-col>
                  <v-col cols="8">
                    <v-img
              :src="product.thumbnail"
              align-self="center"
              class="white--text"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              max-height="130"
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
                  </v-col>
                  <v-col cols="2"></v-col>
                </v-row>
              </v-col>
              <v-col cols="9">
                <v-row>
                  <v-col cols="6">
                <v-card-actions>
                  <v-checkbox
                  v-model="product.isSelected"
                  color="indigo"
                  hide-details
                ></v-checkbox>
                </v-card-actions>
                <v-card-title class="col-12 text-body-1 text-truncate " v-text="product.name" @click="getDetailInfo(product.cd)"></v-card-title>
                <v-card-text class="col-8 " v-text="'Lovane('+product.corpNm+')'"></v-card-text>
                <v-card-text  class="col-4 text-body-2 text-truncate" v-text="product.depoPri+' 원'"></v-card-text>
                  </v-col>
                  <v-divider></v-divider>
                  <v-col cols="6">
                    <v-row>
                      <v-col cols="1"></v-col>
                      <v-col cols="4" align-self="center">
                        선택 옵션
                      </v-col>
                      <v-col cols="4"></v-col>
                      <v-col cols="2">
                        <v-btn icon
                               @click="deleteItem(product.cd)">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="1"></v-col>
                      <v-col cols="11">
                          <v-row
                                 v-for="(detail,index) in product.detail"
                                 :key="index">
                            <v-col cols="10">
                            {{ detail.size.name }}-{{ detail.color.name }}-{{detail.basketCnt}}개
                            </v-col>
                            <v-col cols="1">
                              <v-btn icon
                                     x-small
                                     @click="deleteOption(detail.productKey)">
                                <v-icon>mdi-close</v-icon>
                              </v-btn>
                            </v-col>
                            <v-col cols="1"></v-col>
                          </v-row>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="8"></v-col>
                      <v-col cols="4">
                        합계 : {{product.midSum}} 원
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10" align-self="center">
          총 합계 : {{BasketList.endSum}} 원
        </v-col>
        <v-col cols="2">
          <v-btn text @click="order">
            주문하기
          </v-btn>
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
      deleteList: [], //장바구니 삭제 리스트
    }
  },
  computed:{
    ...mapGetters(["BasketList"]),
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
    order(){
      var orderList = [];
      var midCnt = 0;
      var deliPri = 200000;
      var totPri = 0;
      var totDeliPri = 200000;
      this.BasketList.forEach(function(item){
        midCnt = 0;
        deliPri = 200000;
        if(item.isSelected){
          item.detail.forEach(function(detail){
            midCnt += detail.basketCnt;
            deliPri = Math.min(deliPri,detail.deliPri);
          })
          item.midCnt = midCnt;
          item.deliPri = deliPri;
          totPri += item.midSum+deliPri;
          totDeliPri = Math.min(totDeliPri,deliPri);
          orderList.push(item);
        }
      });
      orderList.totPrdPri = totPri;
      orderList.totDeliPri = totDeliPri;
      orderList.totPri = totPri+totDeliPri;
      this.$store.commit("setOrderList",orderList);
      console.log(orderList);
      this.$router.push("/Order");
    },
    deleteItem(productCd){
      this.$store.dispatch("delBasketInfo",{prdCd:productCd, listCd:0});
    },
    deleteOption(productKey){
      this.$store.dispatch("delBasketInfo",productKey);
    }
  }
}
</script>

<style scoped>

</style>