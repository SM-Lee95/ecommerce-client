<template>
  <Container>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      temporary
      right
    >
      <div>
        <v-btn
          class=""
          icon
          @click.stop="drawer = !drawer"
        >
          <v-icon>mdi-close-outline</v-icon>
        </v-btn>
        <div></div>
        <v-text-field
          class="mx-auto"
          label="아이디"
          :rules="rules"
          prepend-inner-icon="mdi-account-heart-outline"
          v-model="username"
        ></v-text-field>
        <v-text-field class="mx-auto" label="비밀번호" :rules="rules" prepend-inner-icon="mdi-lock" v-model="password" :type="'password'">
        </v-text-field>
        <v-btn
          block
          elevation="2"
          @click="goLogin"
        >로그인
        </v-btn>
      </div>
    </v-navigation-drawer>
    <v-dialog
      transition="dialog-bottom-transition"
      v-model="userInfoDrawer"
      persistent
      max-width="600px"
      height="1000px"
    >
      <v-container class="white">
        <v-row>
          <v-col cols="3" align-self="center">
            개인정보수정
          </v-col>
          <v-col cols="8"></v-col>
          <v-col cols="1">
       <v-btn
        icon
        @click.stop="setUserInfoDrawer"
        right
        >
        <v-icon>mdi-close-box</v-icon>
        </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <MyPage />
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
        <div v-show="!isLogin">
          <v-btn value="login" small text @click.stop="drawer = !drawer">
            로그인
          </v-btn>
          <v-btn value="Join" small text  @click="toJoinForm">
            회원가입
          </v-btn>
        </div>
        <div v-show="isLogin">
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
            @click.stop="setUserInfoDrawer"
          >
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </div>
        <div>
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
        </div>
      </v-app-bar>
    </v-card>
  </Container>
</template>
<script>
import MyPage from "../components/MyPage.vue";

export default {
  components: {
    MyPage
  },
  data() {
    return {
      username: "",
      password: "",
      drawer: false,
      userInfoDrawer: false,
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
        this.drawer = !this.drawer;
        this.username = "";
        this.password = "";
        if (resp) {
          if (this.$route.path != "/")
            this.$router.push("/");
        }
      });
    },
    logout() {
      this.$store.commit("setUserInfo", null);
      this.$store.commit("setToken", "");
      if (this.$route.path != "/")
        this.$router.push("/");
    },
    setUserInfoDrawer(){
      this.userInfoDrawer = !this.userInfoDrawer;
    },
    goJJim(){
      this.$store.dispatch("getJJimList").then((resp) => {
        if(resp && this.$route.path != "/JJim")
          this.$router.push("/JJim");
      });
      },
    goBasket(){
      this.$store.dispatch("getBasketList").then((resp)=>{
        if(resp && this.$route.path != "/Basket")
          this.$router.push("/Basket");
      });
    }
  },
  computed: {
    isLogin: function() {
      return this.$store.getters.getToken == "" ? false : true;
    }
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