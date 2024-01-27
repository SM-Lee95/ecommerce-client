<template>
  <v-container fluid>
    <v-app-bar
      color="white"
      elevation="0"
      fixed
      flat
      absolute
      src="../assets/lovane.png"
      extension-height="110%"
    >
      <template v-slot:img="{ props }">
        <v-img v-bind="props" contain @click="toMain"></v-img>
      </template>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!isLogin"
        value="login"
        small
        text
        @click.stop="drawer = !drawer"
      >
        로그인
      </v-btn>
      <v-btn v-if="!isLogin" value="Join" small text @click="toJoinForm">
        회원가입
      </v-btn>
      <v-btn v-if="isLogin" class="mx-2" text x-small fab @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-btn
        v-if="isLogin"
        class="mx-2"
        text
        x-small
        fab
        @click.stop="toMyPage"
      >
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
      <v-btn v-if="isLogin" class="mx-2" text x-small fab @click="goBasket">
        <v-icon dark> mdi-basket </v-icon>
      </v-btn>
      <v-btn v-if="isLogin" class="mx-2" text x-small fab @click="goJJim">
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

      <template v-slot:extension>
        <MenuBar />
      </template>
    </v-app-bar>
    <v-dialog v-model="drawer" width="500px">
      <v-container class="white" fluid>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <form @submit.prevent="submit">
            <v-row class="white" no-gutters>
              <v-col>
                <v-row class="mt-1" justify="space-between">
                  <v-col class="text-h6 ml-4"> Login </v-col>
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
                        label="ID"
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
                        label="Password"
                        prepend-inner-icon="mdi-lock"
                        v-model="password"
                        :error-messages="errors"
                        :type="'password'"
                        @keyup.enter="goLogin"
                      >
                      </v-text-field>
                    </validation-provider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-row no-gutters>
                      <v-col align-self="center">
                        <v-btn
                          block
                          text
                          elevation="0"
                          @click="goLogin"
                          :disabled="invalid"
                          >Login
                        </v-btn>
                      </v-col>
                      <v-col align-self="center">
                        <v-btn text image elevation="0" @click="loginWithKakao">
                          <v-img
                            contain
                            height="40"
                            width="100%"
                            src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
                          ></v-img> </v-btn
                      ></v-col>
                    </v-row>

                    <v-row no-gutters>
                      <v-col>
                        <v-btn block text elevation="0" @click="searchID"
                          >아이디 찾기
                        </v-btn>
                      </v-col>
                      <v-col>
                        <v-btn block text elevation="0" @click="searchPass"
                          >비밀번호 찾기
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </form>
        </validation-observer>

        <v-dialog
          transition="dialog-bottom-transition"
          v-model="mailAuthDrawer"
          width="500px"
        >
          <mail-auth-dialog v-on:complete="mailAuthComplete"></mail-auth-dialog>
        </v-dialog>
        <v-dialog
          transition="dialog-bottom-transition"
          v-model="newPassDrawer"
          width="720px"
        >
          <new-pass-dialog
            v-on:close="close('newPassDrawer')"
            :id="newPassId"
          ></new-pass-dialog>
        </v-dialog>
      </v-container>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
import MailAuthDialog from "../components/dialog/MailAuthDialog.vue";
import NewPassDialog from "../components/dialog/NewPassDialog.vue";
import MenuBar from "./MenuBar.vue";
export default {
  components: {
    MailAuthDialog,
    NewPassDialog,
    MenuBar,
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
    loginWithKakao() {
      window.Kakao.Auth.authorize({
        redirectUri:
          window.location.protocol + "//" + window.location.host + "/Kakao",
      });
    },
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
      if (this.$route.path != "/Admin/ProductMng/SelectPrd") {
        this.$store
          .dispatch("product/selectPrdList", {
            cateCd: 0,
          })
          .then((resp) => {
            if (!resp)
              this.$dialog.message.warning("조회 중 에러가 발생했습니다.");
          });
        this.$router.push("/Admin/ProductMng/SelectPrd");
      }
    },
    searchPass() {
      this.$store.commit("common/setMailAuthTy", 1);
      this.mailAuthDrawer = true;
    },
    searchID() {
      this.$store.commit("common/setMailAuthTy", 2);
      this.mailAuthDrawer = true;
    },
    mailAuthComplete(vo) {
      this.close("mailAuthDrawer");
      if (vo.authType == 1) {
        this.newPassId = vo.id;
        this.newPassDrawer = true;
      } else if (vo.authType == 2) {
        this.$store
          .dispatch("user/selectUserIdFromEmail", {
            params: {
              email: vo.email,
            },
          })
          .then((resp) => {
            if (resp.data.statusCode == "200") {
              this.$dialog
                .confirm({
                  title: "아이디 찾기",
                  text:
                    "하기 회원님의 이메일로 가입된 아이디는 <b>" +
                    resp.data.message.substring(0, 4) +
                    "****" +
                    "</b> 입력창에 자동 입력하시겠습니까?",
                  showClose: false,
                })
                .then((flag) => {
                  if (!flag) return;
                  this.username = resp.data.message;
                });
            } else {
              this.$dialog.message.error(
                "일치하는 메일 계정이 존재하지 않습니다."
              );
            }
          });
      }
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
