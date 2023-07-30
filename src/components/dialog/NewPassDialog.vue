<template>
  <v-container fluid class="white">
    <validation-observer ref="observer">
      <v-row class="white" no-gutters>
        <v-col>
          <v-row class="mt-1">
            <v-col class="ml-1 text-h6"> 비밀번호변경 </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="pa-1">
            <v-col class="ml-2 mr-2">
              <validation-provider
                v-slot="{ errors }"
                name="Password"
                :rules="{
                  required: true,
                  min: 8,
                  max: 20,
                  regex: [/^[0-9a-zA-Z!@#$%^+\-=]*$/],
                  passwordCustom: true,
                }"
              >
                <v-text-field
                  v-model="newPwd"
                  :counter="20"
                  :error-messages="errors"
                  label="새로운 비밀번호"
                  :type="'password'"
                  required
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Confirm"
                rules="required|max:20|min:8|confirmed:Password"
              >
                <v-text-field
                  v-model="confirmPwd"
                  :counter="20"
                  :error-messages="errors"
                  label="비밀번호 확인"
                  :type="'password'"
                  required
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col class="text-right">
              <v-btn @click="savePass" text>
                저장
                <v-icon color="gray darken-2">mdi-content-save-move</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </validation-observer>
  </v-container>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    newPwd: null,
    confirmPwd: null,
  }),
  methods: {
    savePass() {
      this.$refs.observer.validate().then((resp) => {
        if (resp == false) {
          this.$dialog.message.warning("입력값을 확인해주세요.");
          return;
        } else {
          this.$store
            .dispatch("user/updateEmailPass", {
              id: this.id,
              pwd: this.currentPwd,
              newPwd: this.newPwd,
            })
            .then((resp) => {
              if (resp) {
                this.$dialog.message.success(
                  "비밀번호 변경에 성공하셨습니다. 변경된 비밀번호로 로그인 시도해주세요."
                );
                this.$emit("close");
              } else {
                this.$dialog.message.warning("비밀번호 변경에 실패하셨습니다.");
              }
            });
        }
      });
    },
  },
};
</script>
<style scoped></style>
