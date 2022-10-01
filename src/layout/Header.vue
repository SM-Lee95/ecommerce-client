<template>
  <v-container fluid>
    <v-dialog
      transition="dialog-bottom-transition"
      v-model="drawer"
      persistent
      max-width="600px"
      height="1000px"
    >
      <v-row class="white" no-gutters>
        <v-col>
          <v-row class="mt-1" justify="space-between">
            <v-col class="text-h6 ml-4">
              로그인
            </v-col>
            <v-col></v-col>
            <v-col class="text-right">
              <v-btn
                icon
                @click.stop="drawer = !drawer"
              >
                <v-icon>mdi-close-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="ml-1 mr-1 mt-1">
            <v-col>
              <v-text-field
                label="아이디"
                :rules="rules"
                prepend-inner-icon="mdi-account-heart-outline"
                v-model="username"
              ></v-text-field>
              <v-text-field class="mx-auto" label="비밀번호" :rules="rules" prepend-inner-icon="mdi-lock" v-model="password"
                            :type="'password'">
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                block
                text
                elevation="1"
                @click="goLogin"
              >로그인
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-dialog>
    <v-card>
      <v-app-bar
        color="grey"
        fixed
        elevation="0"
        app
      >
        <template v-slot:img="{ props }">
          <v-img
            v-bind="props"
            gradient="to top right, white, white"
          ></v-img>
        </template>
        <v-app-bar-title>
          <v-btn @click="toMain" x-large plain>로브아네(Lovane)</v-btn>
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <v-row class="text-right">
          <v-col v-show="!isLogin">
            <v-btn value="login" small text @click.stop="drawer = !drawer">
              로그인
            </v-btn>
            <v-btn value="Join" small text @click="toJoinForm">
              회원가입
            </v-btn>
          </v-col>
          <v-col v-if="isLogin">
            <v-btn
              class="mx-2"
              text
              fab
              x-small
              @click="logout"
            >
              <v-icon>mdi-logout</v-icon>
            </v-btn>
            <v-btn
              class="mx-2"
              text
              x-small
              fab
              @click.stop="toMyPage"
            >
              <v-icon>mdi-account-circle</v-icon>
            </v-btn>
            <v-btn
              class="mx-2"
              x-small
              text
              fab
              @click="goBasket"
            >
              <v-icon dark>
                mdi-basket
              </v-icon>
            </v-btn>
            <v-btn
              class="mx-2"
              fab
              text
              x-small
              color="pink"
              @click="goJJim"
            >
              <v-icon dark>
                mdi-heart
              </v-icon>
            </v-btn>
            <v-btn
              class="mx-2"
              text
              fab
              x-small
              @click="goAdmin"
              v-if="isLogin && this.Role=='ADMIN'"
            >
              <v-icon>mdi-semantic-web</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-app-bar>
    </v-card>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      username: "",
      password: "",
      drawer: false,
      group: null,
      rules: [
        value => !!value || "Required.",
        value => (value && value.length >= 3) || "Min 3 characters"
      ]
    };
  },
  methods: {
    toJoinForm() {
      if (this.$route.path != "/JoinForm")
        this.$router.push("/JoinForm");
    },
    toMain() {
      if (this.$route.path != "/Main")
        this.$router.push("/Main");
    },
    goLogin() {
      this.$store.dispatch("login", {
        "id": this.username,
        "pwd": this.password
      }).then((resp) => {
        if (resp) {
          this.drawer = !this.drawer;
          if (this.$route.path != "/")
            this.$router.push("/");
        } else {
          this.$dialog.message.error("입력하신 로그인 정보가 일치하지 않습니다.");
        }
        this.username = "";
        this.password = "";
      });
    },
    logout() {
      this.$store.commit("setUserInfo", null);
      this.$store.commit("setToken", "");
      if (this.$route.path != "/")
        this.$router.push("/");
    },
    goJJim() {
      if (!this.getUserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("getJJimList").then((resp) => {
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
      if (!this.getUserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("getBasketList").then((resp) => {
        if (resp) {
          if (this.$route.path != "/Basket")
            this.$router.push("/Basket");
        } else {
          this.$dialog.message.warning("장바구니에 상품이 존재하지 않습니다.");
        }
      });
    },
    toMyPage() {
      if (!this.getUserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("getMyPageInfo").then((resp) => {
        if (resp) {
          if (this.$route.path != "/MyPage")
            this.$router.push("/MyPage");
        } else
          this.$dialog.message.error("주문 정보 확인에 실패했습니다.");
      });
    },
    goAdmin(){
      if(this.$route.path != "/Admin/ProductMng/SelectPrd")
        this.$router.push("/Admin/ProductMng/SelectPrd");
    }
  },
  computed: {
    isLogin: function() {
      return this.$store.getters.getToken == "" ? false : true;
    },
    ...mapGetters(["getUserInfo","Role"])
  },
  watch: {
    group() {
      this.drawer = false;
    }
  }
};
</script>

<style scoped>

</style>