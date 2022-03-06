<template>
  <div>
    <v-card>
      <v-app-bar
        absolute
        color="white"
        elevation="1"
        dense
        app
      >
        <template v-slot:img="{ props }">
          <v-img
            v-bind="props"
            gradient="to top right, white, white"
          ></v-img>
        </template>
        <v-app-bar-title><a @click="toMain" style="text-decoration: none">PlumGreenTea</a></v-app-bar-title>
        <v-spacer></v-spacer>
        <div v-show="!isLogin">
          <v-btn value="login" small plain @click.stop="drawer = !drawer">
            로그인
          </v-btn>

          <v-btn value="Join" small plain @click="toJoinForm">
            회원가입
          </v-btn>
        </div>
        <div v-show="isLogin">
          <v-btn
            class="mx-2"
            color="warning"
            fab
            dark
            x-small
            @click="logout"
          >
            <v-icon>mdi-logout</v-icon>
          </v-btn>
          <v-btn
            class="mx-2"
            color="warning"
            fab
            dark
            x-small
            @click.stop="userInfoDrawer = !userInfoDrawer"
          >
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </div>
        <div>
          <v-btn
            class="mx-2"
            fab
            dark
            x-small
            color="pink"
          >
            <v-icon dark>
              mdi-basket
            </v-icon>
          </v-btn>
          <v-btn
            class="mx-2"
            fab
            dark
            x-small
            color="pink"
          >
            <v-icon dark>
              mdi-heart
            </v-icon>
          </v-btn>
        </div>
      </v-app-bar>
    </v-card>
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
        <v-text-field class="mx-auto" label="비밀번호" :rules="rules" prepend-inner-icon="mdi-lock" v-model="password"
                      :type="'password'"></v-text-field>
        <v-btn
          block
          elevation="2"
          @click="goLogin"
        >로그인
        </v-btn>
      </div>
    </v-navigation-drawer>
    <v-dialog
      v-model="userInfoDrawer"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-btn
        class=""
        icon
        @click.stop="userInfoDrawer = !userInfoDrawer"
      >
        <v-icon>mdi-close-outline</v-icon>
      </v-btn>
      <MyPage />
    </v-dialog>
  </div>
</template>

<script>
import MyPage from "../components/MyPage.vue";

export default {
  name: "Header.vue",
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
          this.$router.push("/");
        }
      });
    },
    logout() {
      this.$store.commit("setUserId", "");
      this.$store.commit("setToken", "");
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