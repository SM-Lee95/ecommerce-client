<template>
  <v-container style="min-height: 1000px">
    <v-row style="min-height: 600px">
      <v-col cols="6" class="d-flex justify-center">
        <v-img
          :src="DetailInfo.thumbnail"
          contain
          position="center center"
          max-width="80%"
          aspect-ratio="0.75"
        ></v-img>
      </v-col>
      <v-col cols="6">
        <v-row class="text-left">
          <v-col class="mr-2 mt-2">
            <v-btn text @click="getList(DetailInfo.catalog.cd)">
              {{ DetailInfo.catalog.name }}</v-btn
            >
          </v-col>
        </v-row>
        <v-card elevation="0" outlined>
          <v-row class="text-right" no-gutters>
            <v-col class="mr-2 mt-2">
              <v-btn
                icon
                @click.stop="like(DetailInfo.cd, DetailInfo.love)"
                :color="true == DetailInfo.love ? 'pink lighten-4' : 'black'"
              >
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row no-gutters
            ><v-col
              ><v-card-title class="ml-2 subtitle-1">{{
                DetailInfo.name
              }}</v-card-title></v-col
            ></v-row
          >
          <v-card-text>
            <v-row class="text-right" no-gutters>
              <v-col cols="1" class="subtitle-1"
                >{{ DetailInfo.discountRate }} %</v-col
              >
              <v-col cols="9"></v-col>
              <v-col cols="2" class="text-decoration-line-through subtitle-2"
                >{{ DetailInfo.salesPri.comma() }} 원</v-col
              >
            </v-row>
            <v-row class="subtitle-1 text-right" no-gutters>
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
              <v-col
                >택배배송 | 배송비 : {{ DetailInfo.deliPri.comma() }} 원</v-col
              >
            </v-row>
          </v-card-text>
          <v-divider class="mx-4"></v-divider>
          <v-card-text class="ml-2">
            Option
            <v-chip-group
              v-model="option"
              active-class="black white--text"
              column
            >
              <v-chip
                v-for="(tag, i) in DetailInfo.detail"
                :key="i"
                @click="addOption(i)"
                >{{ tag.size.name }}-{{ tag.color.name }}
              </v-chip>
            </v-chip-group>
            <v-divider class="mx-4"></v-divider>
          </v-card-text>
          <v-card-text>
            <v-list-item v-for="(item, i) in selectOptions" :key="i">
              <v-list-item-title>
                <v-row no-gutters>
                  <v-col
                    align-self="center"
                    class="text-left subtitle-2"
                    cols="4"
                  >
                    {{ item.size + "-" + item.color }}
                  </v-col>
                  <v-col class="text-right ml-5" cols="3">
                    <v-select
                      v-model="item.cnt"
                      :items="items"
                      @change="calc"
                      item-color="black"
                    ></v-select>
                  </v-col>
                  <v-col align-self="center" class="text-right">
                    <v-btn small text @click="deleteOption(i)">
                      <v-icon small> mdi-close </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-row dense no-gutters>
                <v-col class="text-left">총 상품 금액</v-col>
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
    <v-row class="mt-5">
      <v-col>
        <v-toolbar flat>
          <v-tabs
            background-color="white"
            grow
            v-model="tab"
            slider-color="grey"
          >
            <v-tab active-class="black--text">상세정보 </v-tab>
            <v-tab active-class="black--text">Q&A </v-tab>
            <v-tab active-class="black--text">반품/교환정보 </v-tab>
          </v-tabs>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-container>
              <v-row
                ><v-col class="d-flex justify-center">
                  <v-img
                    src="../assets/LovaneNotice.jpeg"
                    contain
                    position="center center"
                    max-width="60%"
                  ></v-img> </v-col
              ></v-row>
              <v-row>
                <v-col class="d-flex justify-center">
                  <v-card flat>
                    <v-card-text v-html="DetailInfo.description"></v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row>
                <v-col class="ml-3 mt-3">
                  상품정보 제공고시
                  <v-simple-table class="mt-5">
                    <template v-slot:default>
                      <colgroup>
                        <col width="50%" />
                        <col />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="row">제품소재</th>
                          <td colspan="1">상품상세참조</td>
                        </tr>
                        <tr>
                          <th scope="row">색상</th>
                          <td colspan="1">상품상세참조</td>
                        </tr>
                        <tr>
                          <th scope="row">치수</th>
                          <td colspan="1">상품상세참조</td>
                        </tr>
                        <tr>
                          <th scope="row">제조자(사)</th>
                          <td colspan="1">상품상세참조</td>
                        </tr>
                        <tr>
                          <th scope="row">제조국</th>
                          <td colspan="1">국산</td>
                        </tr>
                        <tr>
                          <th scope="row">세탁방법 및 취급시 주의사항</th>
                          <td colspan="1">상품상세참조</td>
                        </tr>
                        <tr>
                          <th scope="row">제조연월</th>
                          <td colspan="1">상품상세참조</td>
                        </tr>
                        <tr>
                          <th scope="row">품질보증기준</th>
                          <td colspan="1">상품상세참조</td>
                        </tr>
                        <tr>
                          <th scope="row">A/S 책임자와 전화번호</th>
                          <td colspan="1">상품상세참조 (010-2610-9255)</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="ml-3 mt-3">
                  거래조건에 관한 정보
                  <v-simple-table class="mt-5">
                    <template v-slot:default>
                      <colgroup>
                        <col width="50%" />
                        <col />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="row">재화등의 배송방법에 관한 정보</th>
                          <td colspan="1">택배</td>
                        </tr>
                        <tr>
                          <th scope="row">주문 이후 예상되는 배송기간</th>
                          <td colspan="1">
                            대금 지급일로부터 12일 이내에 발송
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            제품하자·오배송 등에 따른 청약철회 등의 경우
                            청약철회 등의 기한 및 통신판매업자가 부담하는
                            반품비용 등에 관한 정보
                          </th>
                          <td colspan="1">
                            전자상거래 등에서의 소비자보호에 관한 법률 등에 의한
                            제품의 하자 또는 오배송 등으로 인한 청약철회의
                            경우에는 상품 수령 후 3개월 이내, 그 사실을 안 날
                            또는 알 수 있었던 날로부터 30일 이내에 청약철회를 할
                            수 있으며, 반품 비용은 통신판매업자가 부담합니다.
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            제품하자가 아닌 소비자의 단순변심에 따른 청약철회 시
                            소비자가 부담하는 반품비용 등에 관한 정보
                          </th>
                          <td colspan="1">
                            편도 4000원 (최초 배송비 무료인 경우 8000원 부과)
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            제품하자가 아닌 소비자의 단순변심에 따른 청약철회가
                            불가능한 경우 그 구체적 사유와 근거
                          </th>
                          <td colspan="1">
                            전자상거래 등에서의 소비자보호에 관한 법률 등에 의한
                            청약철회 제한 사유에 해당하는 경우 및 기타
                            객관적으로 이에 준하는 것으로 인정되는 경우
                            청약철회가 제한될 수 있습니다.
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            재화등의 교환·반품·보증 조건 및 품질보증기준
                          </th>
                          <td colspan="1">
                            소비자분쟁해결기준(공정거래위원회 고시) 및
                            관계법령에 따릅니다.
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">재화등의 A/S 관련 전화번호</th>
                          <td colspan="1">010-2610-9255</td>
                        </tr>
                        <tr>
                          <th scope="row">
                            대금을 환불받기 위한 방법과 환불이 지연될 경우
                            지연배상금을 지급받을 수 있다는 지연배상금 지급의
                            구체적인 조건·절차
                          </th>
                          <td colspan="1">
                            주문취소 및 대금의 환불은 네이버페이 마이페이지에서
                            신청할 수 있으며, 전자상거래 등에서의 소비자보호에
                            관한 법률에 따라 소비자의 청약철회 후 판매자가 재화
                            등을 반환 받은 날로부터 3영업일 이내에 지급받은
                            대금의 환급을 정당한 사유 없이 지연하는 때에는
                            소비자는 지연기간에 대해서 연 15%의 지연배상금을
                            판매자에게 청구할 수 있습니다.
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            소비자피해보상의 처리, 재화등에 대한 불만 처리 및
                            소비자와 사업자 사이의 분쟁처리에 관한 사항
                          </th>
                          <td colspan="1">
                            소비자분쟁해결기준(공정거래위원회 고시) 및
                            관계법령에 따릅니다.
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">
                            거래에 관한 약관의 내용 또는 확인할 수 있는 방법
                          </th>
                          <td colspan="1">
                            상품상세 페이지 및 페이지 하단의 이용약관 링크를
                            통해 확인할 수 있습니다.
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="ml-3 mt-3">
                  판매자정보 안내
                  <v-simple-table class="mt-5">
                    <template v-slot:default>
                      <colgroup>
                        <col width="20%" />
                        <col width="30%" />
                        <col width="20%" />
                        <col />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="row">상호명</th>
                          <td colspan="1">
                            로브아네 (lovane) (사업자 / 개인 사업자)
                          </td>
                          <th scope="row">대표자</th>
                          <td>김진현</td>
                        </tr>
                        <tr>
                          <th scope="row">사업자등록번호</th>
                          <td colspan="1">5310501959</td>
                          <th scope="row">통신판매업번호</th>
                          <td>2022-서울광진-1585</td>
                        </tr>
                        <tr>
                          <th scope="row">사업장소재지</th>
                          <td colspan="3">
                            서울특별시 광진구 능동로55길 45 (퍼시픽빌리지) 씨동
                            301호 (우 : 04904)
                            <br />(메일:lovaneofficial@gmail.com)
                            <br />고객센터: 010-2610-9255
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-container>
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
    addOption(index) {
      var option = new Object();
      option.size = this.DetailInfo.detail[index].size.name;
      option.color = this.DetailInfo.detail[index].color.name;
      option.price =
        (this.DetailInfo.salesPri * (100 - this.DetailInfo.discountRate)) / 100;
      option.basketKey = this.DetailInfo.detail[index].productKey;
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
