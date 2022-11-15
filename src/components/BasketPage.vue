<template>
  <v-container fluid>
      <v-row no-gutters>
        <v-col class="ml-6">
            <v-icon x-large>
              mdi-basket
            </v-icon>
            <b class="text-h5 ml-4">장바구니</b>
        </v-col>
        <v-col class="text-right mr-4">
            <b>장바구니</b> > 주문 / 결제
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :headers="header"
            :items="BasketList"
            disable-sort
            class="elevation-0 mt-2"
            show-select
            hide-default-footer
            v-model="selectList"
            item-key="cd"
            no-data-text="상품이 존재하지 않습니다."
            
          >
            <template v-slot:item.thumbnail="{item}">
              <v-img :src="item.thumbnail" max-height="100%" min-height="100%" max-width="100" @click="getDetailInfo(item.cd)">
              </v-img>
            </template>
            <template v-slot:item.prdNm="{ item }">
              <v-row>
                <v-col>
                  <v-btn text @click="getDetailInfo(item.cd)">{{ item.name }}</v-btn>
                </v-col>
              </v-row>
            </template>
            <template v-slot:item.options="{item}">
                  <v-row
                    v-for="(detail,index) in item.detail"
                    :key="index">
                    <v-col>
                      {{ detail.size.name }} - {{ detail.color.name }} - {{ detail.basketCnt }}개
                      <v-btn icon
                             x-small
                             @click="deleteOption(detail.productKey)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
            </template>
            <template v-slot:item.deliPri="{item}">
              {{ item.deliPri.comma() + " 원" }}
            </template>
            <template v-slot:item.midSum="{item}">
              {{ String(item.midSum).comma() + " 원" }}
            </template>
            <template v-slot:item.salesPri="{item}">
              <v-row><v-col class="text-decoration-line-through">{{ item.salesPri.comma() + " 원" }}</v-col></v-row>
            </template>
            <template v-slot:item.discountPri="{item}">
              {{ String(Number(item.salesPri) * ((100 - Number(item.discountRate)) / 100)).comma() + " 원" }}
            </template>
            <template v-slot:item.discountRate="{item}">
              {{ item.discountRate + " %" }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                @click="deleteItem(item.cd)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    <v-divider></v-divider>
      <v-row class="mt-5">
        <v-col class="text-left ml-10">
          총 합계 : {{ String(BasketList.endSum).comma() }} 원
        </v-col>
        <v-col class="text-right mr-10">
          <v-btn text @click="order">
            주문하기
          </v-btn>
        </v-col>
      </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "BasketPage.vue",
  components: {},
  data() {
    return {
      selectList: [], //장바구니 삭제 리스트
      header: [
        { value: "thumbnail", align: "center" },
        { text: "상품명", value: "prdNm", align: "start" },
        { text: "선택옵션", value: "options", align: "center" },
        { text: "판매금액", value: "salesPri", align: "center" },
        { text: "할인율", value: "discountRate", align: "center" },
        { text: "할인금액", value: "discountPri", align: "center" },
        { text: "배송비", value: "deliPri", align: "center" },
        { text: "합계", value: "midSum", align: "center" },
        { text: "삭제", value: "actions", align: "center" }
      ],
    };
  },
  computed: {
    ...mapGetters(["BasketList", "getUserInfo"]),
  },
  methods: {
    getDetailInfo(cd) {
      console.log(this.BasketList);
      this.$store.dispatch("getDetailInfo", cd).then((resp) => {
        if (resp) {
          if (this.$route.path != "/Detail")
            this.$router.push("/Detail");
        } else
          this.$dialog.message.error("상품 정보를 조회하는 중에 오류가 발생했습니다.");
      });
    },
    like(index, cd, love) {
      if (!this.getUserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("putLike", cd).then((resp) => {
        if (resp) {
          this.$dialog.message.success("Success");
          this.$store.state.BasketList[index].love = !love;
        } else {
          this.$dialog.message.warning("Fail");
        }
      });
    },
    order() {
      if(!this.selectList.length){
        this.$dialog.message.warning("상품 선택후에 진행해주세요.");
        return;
      }
      this.$store.commit("setOrderList", this.selectList);
      this.$router.push("/Order");
    },
    deleteItem(productCd) {
      if (!this.getUserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("delBasketInfo", { prdCd: productCd, listCd: 0 }).then((resp) => {
        if (resp) {
          this.$dialog.message.success("Success");
          this.$store.dispatch("getBasketList");
        } else
          this.$dialog.message.error("Fail");
      });
    },
    deleteOption(productKey) {
      if (!this.getUserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("delBasketInfo", productKey).then((resp) => {
        if (resp) {
          this.$dialog.message.success("Success");
          this.$store.dispatch("getBasketList");
        } else
          this.$dialog.message.error("Fail");
      });
    }
  }
};
</script>

<style scoped>

</style>