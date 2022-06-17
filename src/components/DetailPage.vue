<template>
<v-container>
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
          <div align="right">{{DetailInfo.depoPri}} 원</div>
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
                <h2 class="title_style5">교환/반품안내</h2>
                <dl class="info_txt">
                  <dt class="dtcolor">반품/교환</dt>
                  <dd>
                    <span>반품 및 교환은 상품 수령 후 7일 이내에 가능합니다. </span>
                  </dd>

                  <dt>반품규정</dt>
                  <dd>
                    1. 반드시 받으셨던 박스를 사용하여 우체국택배을 이용하여 반품해 주십시오.<br/>
                    2. 워런티 카드, 파우치, 지퍼백 중 하나라도 없을 경우, 반품처리가 되지 않습니다. 이 점 양해 부탁 드립니다.
                  </dd>

                  <dt>제품의 교환, 환불</dt>
                  <dd>
                    받으신 상품이 주문내용과 상이하거나 마음에 들지 않는 경우, 배송 후 7일 이내에 언제든지 교환 또는 환불이 가능합니다.
                  </dd>
                  <dd>
                    1. 교환 시, 교환하고자 하는 사유를 적어 제품과 함께 보내주세요. <br/><br class="d_hidden t_hidden"/>
                    2. 환불 시, 환불 사유 및 환불 받으실 계좌번호, 예금주를 적어 제품과 함께 보내주세요. 제품은 되도록 처음 상태를 유지시켜 주시고, 기존의 제품박스를 사용해야 합니다.<br/>
                    *환불은 반품 확인 후, 보내주신 계좌번호로 입금해드립니다. <br/><br class="d_hidden t_hidden"/>
                    3. 다음과 같은 경우 교환, 환불이 되지 않습니다.<br/>
                    - 제품 훼손 및 제품과 파우치의 연결고리 훼손<br/>
                    -  기존 포장박스 미사용<br/>
                    -  워런티 카드, 파우치, 지퍼백 중 하나라도 없을 경우<br/><br class="d_hidden t_hidden"/>
                    <span>*고객의 변심으로 인한 반품 시, 고객께서 반품 비용을 부담하셔야 합니다.</span><br/>
                  </dd>

                  <dt>교환/반품 절차</dt>
                  <dd>
                    ① 교환 및 반품 신청서를 작성해주세요. (교환 시, 교환을 원하시는 상품을 적어주세요.)<br/><br class="d_hidden t_hidden"/>
                    ② 교환 및 반품하실 상품을 워런티카드, 파우치, 지퍼백을 받은 상태 그대로 포장해주세요.<br/><br class="d_hidden t_hidden"/>
                    ③ 반품처로 우체국 택배를 이용하여 보내주세요. (반품처 : 서울특별시 광진구 능동로55길 45(퍼시픽빌리지)301호(우 : 04904)<br/><br class="d_hidden t_hidden"/>
                    ④ 고객 변심에 의한 교환 및 반품일 경우 택배비는 고객님 부담으로 미리 선지불하여 보내주세요. 택배사는 자유롭게 이용해주세요.<br/><br class="d_hidden t_hidden"/>
                    ⑤ 단, 상품에 하자가 있어 교환 및 반품할 경우, 온라인 고객센터로 통화하신 후, 우체국택배를 이용하여 보내주세요. (현대택배 대표번호 : 1588-2121)<br/><br class="d_hidden t_hidden"/>
                    ⑥ 반품 상품은 상품 확인 후, 무통장 입금 또는 카드결제 취소 처리 해드립니다.
                  </dd>

                  <dt>불가사유</dt>
                  <dd>
                    - 교환/반품 가능기간을 초과하였을 경우<br/>
                    - 상품을 사용하거나 훼손한 경우<br/>
                    - 택 제거나 상품에 부착된 보호필름지 등을 제거한 경우
                  </dd>
                  <v-divider></v-divider>

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