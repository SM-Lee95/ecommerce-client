<template>
  <v-container style="min-height: 1000px" fluid>
    <v-row>
      <v-col cols="6">
        <v-card elevation="0" max-width="450px" class="pa-10">
          <v-row>
            <v-col>
              <v-img
                :src="DetailInfo.thumbnail"
                contain
                min-width="430px"
                position="center center"
              ></v-img>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-row class="text-right">
          <v-col class="mr-2 mt-2">
            <v-btn text @click="getList(DetailInfo.catalog.cd)">
              {{ DetailInfo.catalog.name }}</v-btn
            >
          </v-col>
        </v-row>
        <v-card elevation="0" flat outlined>
          <v-row class="text-right" no-gutters>
            <v-col class="mr-5 mt-2">
              <v-btn
                icon
                @click.stop="like(DetailInfo.cd, DetailInfo.love)"
                :color="true == DetailInfo.love ? 'pink' : 'black'"
              >
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row no-gutters
            ><v-col
              ><v-card-title class="ml-4">{{
                DetailInfo.name
              }}</v-card-title></v-col
            ></v-row
          >
          <v-card-text>
            <v-row class="text-right" no-gutters>
              <v-col cols="1" class="text-h6"
                >{{ DetailInfo.discountRate }} %</v-col
              >
              <v-col cols="9"></v-col>
              <v-col cols="2" class="text-decoration-line-through text-h6"
                >{{ DetailInfo.salesPri.comma() }} 원</v-col
              >
            </v-row>
            <v-row class="text-h6 text-right" no-gutters>
              <v-col>
                {{
                  String(
                    Number(DetailInfo.salesPri) *
                      ((100 - Number(DetailInfo.discountRate)) / 100)
                  ).comma()
                }}
                원</v-col
              >
            </v-row>
            <v-row class="text-right" no-gutters>
              <v-col>택배배송 | 배송비 : {{ DetailInfo.deliPri.comma() }} 원</v-col>
            </v-row>
            <v-row class="text-right" no-gutters>
              <v-col>제조사 - {{ DetailInfo.corpNm }}</v-col>
            </v-row>
          </v-card-text>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            Option
            <v-chip-group
              v-model="option"
              active-class="deep-purple accent-4 white--text"
              column
            >
              <v-chip v-for="(tag, i) in DetailInfo.detail" :key="i"
                >{{ tag.size.name }}-{{ tag.color.name }}
              </v-chip>
            </v-chip-group>
            <v-divider class="mx-4"></v-divider>
          </v-card-text>
          <v-card-actions>
            <v-row no-gutters>
              <v-col class="text-right mr-10">
                <v-btn text color="deep-purple lighten-2" @click="addOption">
                  Add
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <v-list-item v-for="(item, i) in selectOptions" :key="i">
              <v-list-item-title>
                <v-row no-gutters>
                  <v-col align-self="center" class="text-left">
                    {{ item.size + "-" + item.color }}
                  </v-col>
                  <v-col class="text-right ml-5">
                    <v-select
                      v-model="item.cnt"
                      :items="items"
                      @change="calc"
                    ></v-select>
                  </v-col>
                  <v-col align-self="center" class="text-right">
                    <v-btn x-small text @click="deleteOption(i)">
                      <v-icon> mdi-close-outline </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-row dense no-gutters>
                <v-col class="text-left"><b>총 상품 금액</b></v-col>
                <v-col class="text-right">
                  총 수량 {{ this.cnt }}개 |
                  {{ String(this.totPrice).comma() }}원
                </v-col>
              </v-row>
            </v-list-item>
          </v-card-text>
          <v-card-actions>
            <v-row no-gutters>
              <v-col class="text-right">
                <v-btn
                  text
                  outlined
                  color="lighten-2"
                  @click="postBasket"
                  block
                >
                  장바구니
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-toolbar>
          <v-tabs dark background-color="grey" grow v-model="tab">
            <v-tab>
              <v-badge color="black" icon="mdi-information"> 상세정보 </v-badge>
            </v-tab>
            <v-tab>
              <v-badge color="red" icon="mdi-help"> Q&A </v-badge>
            </v-tab>
            <v-tab>
              <v-badge color="purple" icon="mdi-keyboard-return">
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
              <v-card-text v-html="DetailInfo.description"></v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <qn-a-info></qn-a-info>
          </v-tab-item>
          <v-tab-item>
            <return-info></return-info>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import ReturnInfo from "./ReturnInfo";
import QnAInfo from "./QnAInfo";

export default {
  name: "DetailPage.vue",
  components: {
    ReturnInfo,
    QnAInfo,
  },
  data() {
    return {
      option: null,
      cnt: 0,
      totPrice: 0,
      selectOptions: [],
      items: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      ],
      tab: null,
    };
  },
  computed: {
    ...mapGetters("product", ["DetailInfo"]),
    ...mapGetters("user", ["UserInfo"]),
  },
  methods: {
    like(cd, love) {
      if (!this.UserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("product/putLike", cd).then((resp) => {
        if (resp) {
          this.$dialog.message.success("Success");
          this.DetailInfo.love = !love;
        } else {
          this.$dialog.message.warning("Fail");
        }
      });
    },
    getList(param) {
      this.$store
        .dispatch("product/getItemList", { param: param, page: 0 })
        .then((resp) => {
          if (resp) {
            if (this.$route.path != "/") this.$router.push("/");
          } else this.$dialog.message.error("상품 목록 조회에 실패했습니다.");
        });
    },
    addOption() {
      if (this.option == null) {
        this.$dialog.message.warning("옵션을 선택 후 시도해주세요.");
        return;
      }
      var option = new Object();
      option.size = this.DetailInfo.detail[this.option].size.name;
      option.color = this.DetailInfo.detail[this.option].color.name;
      option.price =
        (this.DetailInfo.salesPri * (100 - this.DetailInfo.discountRate)) / 100;
      option.basketKey = this.DetailInfo.detail[this.option].productKey;
      option.cnt = 1;
      if (
        this.selectOptions.find((value) => value.basketKey == option.basketKey)
      ) {
        this.$dialog.message.warning(
          "선택된 옵션과 같은 추가된 옵션이 존재합니다."
        );
        return;
      }
      this.selectOptions.push(option);
      this.calc();
    },
    postOrder() {
      if (this.selectOptions.length == 0) {
        this.$dialog.message.warning("옵션을 추가하고 시도해주세요.");
        return;
      }
      this.$store.dispatch("postOrder", this.selectOptions).then(() => {
        this.$router.go("/");
      });
    },
    postBasket() {
      if (!this.UserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      if (this.selectOptions.length == 0) {
        this.$dialog.message.warning("옵션을 추가하고 시도해주세요.");
        return;
      }
      this.$store
        .dispatch("product/postBasket", this.selectOptions)
        .then((resp) => {
          if (resp) {
            this.$dialog.message.success("장바구니에 추가하셨습니다.");
            this.selectOptions = [];
            this.calc();
          } else {
            this.$dialog.message.warning("장바구니 추가에 실패했습니다.");
          }
        });
    },
    deleteOption(index) {
      this.selectOptions.splice(index, 1);
      this.calc();
    },
    calc() {
      var val = 0;
      var tot = 0;
      this.selectOptions.forEach((value) => {
        val += value.cnt * value.price;
        tot += value.cnt;
      });
      this.cnt = tot;
      this.totPrice = val;
    },
  },
};
</script>

<style scoped></style>
