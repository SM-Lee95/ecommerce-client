<template>
<v-container
  style="min-height: 1000px">
  <v-row>
    <v-col cols="6">
      <v-card
        elevation="1"
        max-width="444"
        class="mx-auto"
      >
        <v-sheet
          height="100%"
          tile
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <v-img
              :src="DetailInfo.thumbnail"
              min-width="100%"
              max-width="100%"
              min-height="100%"
              max-height="100%"
              contain
            >
            </v-img>
          </v-row>
        </v-sheet>
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-row>
          <v-col cols="10"></v-col>
          <v-col cols="1" no-gutters>
            <v-btn text @click="getList(DetailInfo.catalog.cd)" small>> {{DetailInfo.catalog.name}}</v-btn>
          </v-col>
          <v-col cols="1"></v-col>
      </v-row>
      <v-card
        elevation="1">
        <v-row>
        <v-col cols="10"></v-col>
        <v-col cols="1" no-gutters>
          <v-btn icon @click.stop="like(DetailInfo.cd,DetailInfo.love)" :color="true==DetailInfo.love?'pink':'black'">
            <v-icon>mdi-heart</v-icon>찜하기
          </v-btn>
        </v-col>
          <v-col cols="1"></v-col>
        </v-row>
        <v-card-title>{{DetailInfo.name}}</v-card-title>
        <v-card-text>
          <div class="my-4 text-subtitle-1">
            {{DetailInfo.description}}
          </div>
          <div align="right" class="body-1">가격 : {{DetailInfo.depoPri}} 원</div>
          <div align="right">배송비 : {{DetailInfo.detail[0].deliPri}} 원</div>
          <div align="right">제조사 - {{DetailInfo.corpNm}}</div>
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
        <v-card-title>옵션 선택</v-card-title>
        <v-card-text>
          Option
          <v-chip-group
            v-model="option"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              v-for="(tag,i) in DetailInfo.detail"
              :key="i"
            >{{ tag.size.name }}-{{ tag.color.name }}</v-chip>
          </v-chip-group>
          <v-divider class="mx-4"></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-row no-gutters>
          <v-col cols="10"></v-col>
          <v-col cols="1">
          <v-btn
            text
            color="deep-purple lighten-2"
            @click="addOption"
          >
            Add
          </v-btn>
          </v-col>
            <v-col cols="1"></v-col>
          </v-row>
        </v-card-actions>
        <v-divider class="mx-4"></v-divider>
        <v-card-text>
          <v-list-item
            v-for="(item, i) in selectOptions"
            :key="i">
            <v-list-item-title>
              <v-row no-gutters>
                <v-col cols="4" align-self="center">
                  {{item.size+'-'+item.color}}
                </v-col>
                <v-col cols="2"></v-col>
                <v-col cols="3">
                  <v-select
                    v-model="item.cnt"
                    :items="items"
                    @change="calc"
                  ></v-select>
                </v-col>
                <v-col cols="1" align-self="center" no-gutters>
                  <v-btn
                    x-small
                    text
                    @click="deleteOption(i)"
                  >
                    <v-icon>
                      mdi-close-outline
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
          <v-row dense  no-gutters>
            <v-col cols="9"><b>총 상품 금액</b></v-col>
            <v-col cols="3">
                총 수량 {{this.cnt}}개 | {{this.totPrice}}원
            </v-col>
          </v-row>
          </v-list-item>
        </v-card-text>
        <v-card-actions>
          <v-row no-gutters>
            <v-col cols="8"></v-col>
            <v-col cols="2">
              <v-btn
                text
                color="deep-purple lighten-2"
                @click="postOrder"
              >
                주문하기
              </v-btn>
            </v-col>
            <v-col cols="1">
              <v-btn
                text
                color="deep-purple lighten-2"
                @click="postBasket"
              >
                장바구니
              </v-btn>
            </v-col>
            <v-col cols="1"></v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
    <v-toolbar>
      <v-tabs
        dark
        background-color="grey"
        grow
        v-model="tab"
      >
        <v-tab>
          <v-badge
            color="pink"
            dot
          >
            상세정보
          </v-badge>
        </v-tab>
<!--
        <v-tab>
          <v-badge
            color="green"
            content="6"
          >
            리뷰
          </v-badge>
        </v-tab>
-->
        <v-tab>
          <v-badge
            color="deep-purple accent-4"
            icon="mdi-vuetify"
          >
            반품/교환정보
          </v-badge>
        </v-tab>
      </v-tabs>
    </v-toolbar>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card flat>
            <v-card-text v-text="DetailInfo.description"></v-card-text>
          </v-card>
        </v-tab-item>
        <!--
        <v-tab-item>
          <v-card flat>
            <v-card-text v-text="DetailInfo.depoPri"></v-card-text>
          </v-card>
        </v-tab-item>
        -->
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <section class="customer_wrap2">
                <dl class="info_txt">
                  반품/교환 안내<br/>
                  반품/교환에 관한 일반적인 사항은 판매자 제시사항보다 관계법령이 우선합니다.<br/>
                  판매자 지정 택배사 :
                  우체국택배<br/>
                  반품배송비 :
                  편도 4,000원 (최초 배송비 무료인 경우 8,000원 부과)<br/>
                  교환배송비 :
                  8,000원<br/>
                  보내실 곳 :
                  서울특별시 광진구 능동로55길 45 (퍼시픽빌리지) c동 301호 (우 : 04904)<br/>
                  반품/교환 사유에 따른 요청 가능 기간<br/>
                  반품 시 먼저 판매자와 연락하셔서 반품사유, 택배사, 배송비, 반품지 주소 등을 협의하신 후 반품상품을 발송해 주시기 바랍니다.<br/>
                  구매자 단순 변심은 상품 수령 후 7일 이내 (구매자 반품배송비 부담)<br/>
                  표시/광고와 상이, 계약 내용과 다르게 이행된 경우 상품 수령 후 3개월 이내 혹은 표시/광고와 다른 사실을 안 날로부터 30일 이내 (판매자 반품배송비 부담) 둘 중 하나 경과 시 반품/교환 불가<br/>
                  반품/교환 불가능 사유<br/>
                  아래와 같은 경우 반품/교환이 불가능합니다.<br/>
                  1. 반품요청기간이 지난 경우<br/>
                  2. 구매자의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우(단, 상품의 내용을 확인하기 위하여 포장 등을 훼손한 경우는 제외)<br/>
                  3. 구매자의 책임있는 사유로 포장이 훼손되어 상품 가치가 현저히 상실된 경우 (예: 식품, 화장품, 향수류, 음반 등)<br/>
                  4. 구매자의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우 (라벨이 떨어진 의류 또는 태그가 떨어진 명품관 상품인 경우)<br/>
                  5. 시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우<br/>
                  6. 고객의 요청사항에 맞춰 제작에 들어가는 맞춤제작상품의 경우 (판매자에게 회복불가능한 손해가 예상되고, 그러한 예정으로 청약철회권 행사가 불가하다는 사실을 서면 동의 받은 경우)<br/>
                </dl>
              </section>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "DetailPage.vue",
  components:{

  },
  data(){
    return {
      option: null,
      cnt: 0,
      totPrice: 0,
      selectOptions: [],
      items: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      tab: null,
    }
  },
  computed:{
    ...mapGetters(["DetailInfo"]),
  },
  methods:{
    like(cd,love){
      if(this.$store.getters.getUserInfo==null){
        alert("로그인후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("putLike",cd).then(()=> {
        this.$store.state.DetailInfo.love = !love;
      })
    },
    getList(param){
      this.$store.dispatch("getItemList",{param:param,page:0}).then(()=>{
        if(this.$route.path !="/")
          this.$router.push("/");
      });
    },
    addOption(){
      if(this.option==null) {
        alert("옵션을 선택 후 시도해주세요.");
        return;
      }
      var option = new Object();
      option.size = this.DetailInfo.detail[this.option].size.name;
      option.color = this.DetailInfo.detail[this.option].color.name;
      option.price = this.DetailInfo.detail[this.option].salesPri * (100-this.DetailInfo.detail[this.option].discountRate) / 100;
      option.basketKey = this.DetailInfo.detail[this.option].productKey;
      option.cnt = 1;
      if(this.selectOptions.find(value =>
        value.basketKey == option.basketKey))
      {
        alert("선택된 옵션과 같은 추가된 옵션이 존재합니다.");
        return;
      }
      this.selectOptions.push(option);
      this.calc();
    },
    postOrder(){
      if(this.selectOptions.length==0){
        alert("옵션을 추가하고 시도해주세요.");
        return;
      }
       this.$store.dispatch("postOrder",this.selectOptions).then(()=> {
         this.$router.go("/");
       })
    },
    postBasket(){
      if(this.selectOptions.length==0){
        alert("옵션을 추가하고 시도해주세요.");
        return;
      }
      this.$store.dispatch("postBasket",this.selectOptions).then((resp)=> {
        if(resp){
          this.$router.push("/Basket");
        }
      })
    },
    deleteOption(index){
      this.selectOptions.splice(index,1);
    },
    calc(){
      var val = 0;
      var tot = 0;
      this.selectOptions.forEach(value => {
        val += value.cnt * value.price;
        tot += value.cnt;
      });
      this.cnt = tot;
      this.totPrice = val;
    },
  }
};
</script>

<style scoped>

</style>