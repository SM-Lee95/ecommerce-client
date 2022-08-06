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
                  <v-col>
                    <v-img
              :src="product.thumbnail"
              align-self="center"
              class="white--text"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              max-height="100%"
              max-width="100%"
              min-width="100%"
              min-height="100%"
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
                </v-row>
              </v-col>
              <v-col cols="9">
                <v-row>
                  <v-col cols="1">
                      <v-checkbox
                        v-model="product.isSelected"
                        color="indigo"
                        hide-details
                      ></v-checkbox>
                  </v-col>
                  <v-col cols="5">
                <v-card-title class="col-12 text-body-2 " v-text="product.name" @click="getDetailInfo(product.cd)"></v-card-title>
                <v-card-text class="col-12 text-right" v-text="'Lovane('+product.corpNm+')'"></v-card-text>
                <v-card-subtitle  class="col-12 text-right text-truncate" v-text="product.discountRate+' %'"></v-card-subtitle>
                <v-card-subtitle  class="col-12 text-right text-truncate text-decoration-line-through" v-text="String(product.salesPri).comma()+' 원'"></v-card-subtitle>
                <v-card-subtitle  class="col-12 text-right text-body-1 text-truncate" v-text="String(Number(product.salesPri)*((100-Number(product.discountRate))/100)).comma()+' 원'"></v-card-subtitle>
                  </v-col>
                  <v-divider></v-divider>
                  <v-col cols="6">
                    <v-row>
                      <v-col cols="1"></v-col>
                      <v-col cols="4" class="text-center">
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
                        합계 : {{String(product.midSum).comma()}} 원
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
          총 합계 : {{String(BasketList.endSum).comma()}} 원
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
    ...mapGetters(["BasketList","getUserInfo"]),
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
          this.$store.state.BasketList[index].love = !love;
        }else{
          this.$dialog.message.warning("Fail");
        }
      })
    },
    order(){
      var orderList = [];
      this.BasketList.forEach(function(item){
        if(item.isSelected){
          orderList.push(item);
        }
      });
      this.$store.commit("setOrderList",orderList);
      this.$router.push("/Order");
    },
    deleteItem(productCd){
      if(!this.getUserInfo){
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("delBasketInfo",{prdCd:productCd, listCd:0}).then((resp) => {
        if(resp){
          this.$dialog.message.success("Success");
          this.$store.dispatch("getBasketList");
        } else
          this.$dialog.message.error("Fail");
      });
    },
    deleteOption(productKey){
      if(!this.getUserInfo){
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("delBasketInfo",productKey).then((resp) => {
        if (resp) {
          this.$dialog.message.success("Success");
          this.$store.dispatch("getBasketList");
        } else
          this.$dialog.message.error("Fail");
      });
    }
  }
}
</script>

<style scoped>

</style>