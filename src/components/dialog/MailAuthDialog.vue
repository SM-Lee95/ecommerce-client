<template>
  <v-container fluid class="white">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-row class="white pa-1" no-gutters>
        <v-col>
          <v-row class="mt-1">
            <v-col class="mb-1 ml-1 text-h6"> 이메일 인증 </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="mt-1 mr-1">
            <v-col class="text-right text-caption red--text"
              >* 메일 송부후 현재 창을 떠나지 말고 메일에 존재하는 번호를 입력 후 인증 완료 버튼을 눌러주세요.</v-col
            >
          </v-row>
          <v-row class="mt-1 mb-1">
            <v-col class="ml-2 mr-2">
              <validation-provider
                v-slot="{ errors }"
                name="아이디"
                rules="required"
                v-if="MailAuthTy == 1"
              >
                <v-text-field
                  v-model="id"
                  :error-messages="errors"
                  label="아이디"
                  required
                  :readonly="send"
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="이메일"
                rules="required|email"
              >
                <v-text-field
                  v-model="email"
                  :error-messages="errors"
                  label="본인 확인 이메일(****@****.com)"
                  required
                  :readonly="send"
                ></v-text-field>
              </validation-provider>
              <v-text-field
                v-model="authNum"
                label="인증번호"
                required
                v-if="send"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col class="text-right">
              <v-btn v-if="!send" @click="sendMail" text :disabled="invalid">
                메일송부
                <v-icon color="gray darken-2">mdi-content-save-move</v-icon>
              </v-btn>
              <v-btn v-if="send" @click="authComp" text>
                인증완료
                <v-icon color="gray darken-2">mdi-content-save-move</v-icon>
              </v-btn>
              <v-btn v-if="send" @click="clear" text> 초기화 </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </validation-observer>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    email: "",
    id: "",
    send: false,
    authId: null,
    authNum: "",
  }),
  computed: {
    ...mapGetters("common", ["MailAuthTy"]),
  },
  methods: {
    sendMail() {
      this.$refs.observer.validate().then((resp) => {
        if (resp == false) {
          this.$dialog.message.warning("입력값을 확인해주세요.");
          return;
        } else {
          let url =
            this.MailAuthTy == 1
              ? "user/emailPass"
              : this.MailAuthTy == 2
              ? "user/emailId"
              : "user/emailAuth";
          this.$store
            .dispatch(url, {
              email: this.email,
              name: this.id,
            })
            .then((resp) => {
              if (resp.data.statusCode == "200") {
                this.$dialog.message.success(
                  "메일 예약에 성공하셨습니다. 5분이내로 송부된 메일에 인증 버튼을 눌러주세요."
                );
                this.send = true;
                this.authId = resp.data.message;
              } else if (
                resp.data.statusCode == "12" ||
                resp.data.statusCode == "6" ||
                resp.data.statusCode == "13"
              ) {
                this.$dialog.message.warning(
                  "메일 송부에 실패하셨습니다. " + resp.data.message
                );
              } else {
                this.$dialog.message.warning(
                  "메일 송부에 실패하셨습니다. 입력 정보 확인 후 재시도해주세요."
                );
              }
            });
        }
      });
    },
    authComp() {
      if (!this.authId) {
        this.$dialog.message.warning("시스템에 문제가 존재합니다.");
        return;
      } else {
        if (this.authNum == "") {
          this.$dialog.message.warning(
            "인증번호 입력 후에 시도해주시기 바랍니다."
          );
          return;
        }
        this.$store
          .dispatch("user/compAuth", {
            authId: this.authId,
            authNum: this.authNum,
          })
          .then((resp) => {
            if (resp.data.statusCode == "200" && resp.data.message == "true") {
              this.$dialog.message.success("인증에 성공하셨습니다.");
              this.$emit("complete", {
                email: this.email,
                id: this.id,
                authType: this.MailAuthTy,
              });
              this.clear();
            } else {
              this.$dialog.message.warning(
                "인증에 실패하셨습니다. 메일에 기재된 번호를 입력한 후 다시 시도해주세요."
              );
            }
          });
      }
    },
    clear() {
      this.send = false;
      this.authId = "";
      this.email = "";
    },
  },
};
</script>
<style scoped></style>
