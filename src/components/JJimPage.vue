<template>
  <v-container style="min-height: 950px" class="pl-15 pr-15">
    <v-row class="text-center"><v-col>찜 목록</v-col></v-row>
    <v-row class="mt-5" dense style="min-height: 800px">
      <v-col v-for="(product, index) in JJimList" :key="product.cd" cols="3">
        <v-card
          elevation="0"
          flat
          height="100%"
          @click="getDetailInfo(product.cd)"
          class="pa-2 mt-1 pb-1"
        >
          <v-img
            :src="product.thumbnail"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            aspect-ratio="0.75"
          >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click.stop="like(index, product.cd, product.love)"
                :color="true == product.love ? 'pink lighten-4' : 'white'"
              >
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-card-actions>
          </v-img>
          <v-card-title
            class="pa-2 text-caption"
            v-text="product.name"
            @click="getDetailInfo(product.cd)"
          ></v-card-title>
          <v-spacer v-if="product.name.length < 39"></v-spacer>
          <v-card-subtitle>
            <v-row>
              <v-col>
                <v-row class="text-caption" no-gutters>
                  <v-col class="text-left">{{
                    product.discountRate + " %"
                  }}</v-col>
                  <v-col
                    class="text-right text-decoration-line-through text-caption"
                    >{{ product.salesPri.comma() + " 원" }}</v-col
                  >
                </v-row>
                <v-row class="text-caption" no-gutters>
                  <v-col class="text-left">{{
                    product.deliPri == "0" ? "무료배송" : ""
                  }}</v-col>
                  <v-col class="text-right">{{
                    String(
                      Number(product.salesPri) *
                        ((100 - Number(product.discountRate)) / 100)
                    ).comma() + " 원"
                  }}</v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "JJimPage.vue",
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters("product", ["JJimList"]),
    ...mapGetters("user", ["UserInfo"]),
  },
  methods: {
    getDetailInfo(cd) {
      this.$store.dispatch("product/getDetailInfo", cd).then((resp) => {
        if (resp) {
          if (this.$route.path != "/Detail") this.$router.push("/Detail");
        } else
          this.$dialog.message.error(
            "상품 정보를 조회하는 중에 오류가 발생했습니다."
          );
      });
    },
    like(index, cd, love) {
      if (!this.UserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("product/putLike", cd).then((resp) => {
        if (resp) {
          this.$dialog.message.success("Success");
          this.JJimList[index].love = !love;
        } else {
          this.$dialog.message.warning("Fail");
        }
      });
    },
  },
};
</script>

<style scoped></style>
