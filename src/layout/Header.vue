<template>
  <v-container fluid>
    <v-app-bar color="grey" fixed elevation="0" absolute>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, white, white"></v-img>
      </template>
      <v-app-bar-title>
        <v-btn @click="toMain" x-large plain>로브아네(Lovane)</v-btn>
      </v-app-bar-title>
      <v-row class="text-right">
        <v-col v-show="!isLogin">
          <v-btn value="login" small text @click.stop="drawer = !drawer">
            로그인
          </v-btn>
          <v-btn value="Join" small text @click="toJoinForm"> 회원가입 </v-btn>
        </v-col>
        <v-col v-if="isLogin">
          <v-btn class="mx-2" text x-small fab @click="logout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
          <v-btn class="mx-2" text x-small fab @click.stop="toMyPage">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
          <v-btn class="mx-2" text x-small fab @click="goBasket">
            <v-icon dark> mdi-basket </v-icon>
          </v-btn>
          <v-btn class="mx-2" text x-small fab @click="goJJim">
            <v-icon dark> mdi-heart </v-icon>
          </v-btn>
          <v-btn
            class="mx-2"
            text
            x-small
            fab
            @click="goAdmin"
            v-if="isLogin && this.Role == 'ADMIN'"
          >
            <v-icon>mdi-semantic-web</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-dialog v-model="drawer" height="100%" width="800px">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <v-row class="white" no-gutters>
            <v-col>
              <v-row class="mt-1" justify="space-between">
                <v-col class="text-h6 ml-4"> 로그인 </v-col>
                <v-col></v-col>
                <v-col class="text-right">
                  <v-btn icon @click.stop="drawer = !drawer">
                    <v-icon>mdi-close-outline</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="ml-1 mr-1 mt-1">
                <v-col>
                  <validation-provider
                    v-slot="{ errors }"
                    name="아이디"
                    rules="required"
                  >
                    <v-text-field
                      label="아이디"
                      prepend-inner-icon="mdi-account-heart-outline"
                      v-model="username"
                      :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    name="비밀번호"
                    rules="required"
                  >
                    <v-text-field
                      class="mx-auto"
                      label="비밀번호"
                      prepend-inner-icon="mdi-lock"
                      v-model="password"
                      :error-messages="errors"
                      :type="'password'"
                    >
                    </v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    block
                    text
                    elevation="0"
                    @click="goLogin"
                    :disabled="invalid"
                    >로그인
                  </v-btn>
                  <v-btn block text elevation="0" @click="searchPass"
                    >비밀번호찾기
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </form>
      </validation-observer>
      <v-dialog
        transition="dialog-bottom-transition"
        v-model="mailAuthDrawer"
        width="800px"
        height="100%"
      >
        <mail-auth-dialog v-on:complete="mailAuthComplete"></mail-auth-dialog>
      </v-dialog>
      <v-dialog
        transition="dialog-bottom-transition"
        v-model="newPassDrawer"
        width="800px"
        height="100%"
      >
        <new-pass-dialog v-on:close="close('newPassDrawer')" :id="newPassId"></new-pass-dialog>
      </v-dialog>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
import MailAuthDialog from "../components/dialog/MailAuthDialog.vue";
import NewPassDialog from "../components/dialog/NewPassDialog.vue";
export default {
  components: {
    MailAuthDialog,
    NewPassDialog,
  },
  data() {
    return {
      username: "",
      password: "",
      drawer: false,
      mailAuthDrawer: false,
      newPassDrawer: false,
      group: null,
      newPassId: null,
    };
  },
  methods: {
    toJoinForm() {
      if (this.$route.path != "/JoinForm") this.$router.push("/JoinForm");
    },
    toMain() {
      if (this.$route.path != "/") this.$router.push("/");
    },
    goLogin() {
      this.$store
        .dispatch("user/login", {
          id: this.username,
          pwd: this.password,
        })
        .then((resp) => {
          if (resp) {
            this.drawer = !this.drawer;
            this.$store.dispatch("product/getItemList", { page: 0 });
            if (this.$route.path != "/") this.$router.push("/");
          } else {
            this.$dialog.message.error(
              "입력하신 로그인 정보가 일치하지 않습니다."
            );
          }
          this.username = "";
          this.password = "";
        });
    },
    logout() {
      this.$store.dispatch("product/getItemList", { page: 0 });
      this.$store.commit("user/removeToken");
    },
    goJJim() {
      if (!this.UserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("product/getJJimList").then((resp) => {
        if (resp) {
          if (this.$route.path != "/JJim") {
            this.$router.push("/JJim");
          }
        } else {
          this.$dialog.message.warning("찜 목록에 상품이 존재하지 않습니다.");
        }
      });
    },
    goBasket() {
      if (!this.UserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("product/getBasketList").then((resp) => {
        if (resp) {
          if (this.$route.path != "/Basket") this.$router.push("/Basket");
        } else {
          this.$dialog.message.warning("장바구니에 상품이 존재하지 않습니다.");
        }
      });
    },
    toMyPage() {
      if (!this.UserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("order/getMyPageInfo").then((resp) => {
        if (resp) {
          if (this.$route.path != "/MyPage") this.$router.push("/MyPage");
        } else this.$dialog.message.error("주문 정보 확인에 실패했습니다.");
      });
    },
    goAdmin() {
      if (this.$route.path != "/Admin/ProductMng/SelectPrd")
        this.$router.push("/Admin/ProductMng/SelectPrd");
    },
    searchPass() {
      this.$store.commit("common/setMailAuthTy", 1);
      this.mailAuthDrawer = true;
    },
    mailAuthComplete(vo) {
      this.close("mailAuthDrawer");
      this.newPassId = vo.id;
      this.newPassDrawer = true;
      
    },
    close(name) {
      this[name] = false;
    },
  },
  computed: {
    isLogin: function () {
      return this.UserInfo ? true : false;
    },
    ...mapGetters("user", ["UserInfo", "Role"]),
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>

<style scoped></style>
