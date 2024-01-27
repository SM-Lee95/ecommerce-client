<template><v-container></v-container></template>
<script>
export default {
  methods: {
    kakaoLogin() {
      const code = this.$router.history.current.query.code;
      this.$store
        .dispatch("user/kakaoLogin", {
          authorizationCode: code,
          redirectUri: "https://lovane.store/Kakao",
        })
        .then((resp) => {
          if (!resp)
            this.$dialog.message.warning(
              "카카오 로그인 중 에러가 발생했습니다."
            );
        });
    },
  },
  created() {
    this.kakaoLogin();
  },
};
</script>
