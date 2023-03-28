<template>
  <v-container class="white pa-15">
    <v-row class="pl-15 pr-15">
      <v-col>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <form @submit.prevent="submit">
            <validation-provider
              v-slot="{ errors }"
              name="이름"
              rules="required|max:15"
            >
              <v-text-field
                v-model="name"
                :counter="15"
                :error-messages="errors"
                label="이름"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="아이디"
              rules="required|max:20|existId"
            >
              <v-text-field
                v-model="id"
                :counter="20"
                :error-messages="errors"
                label="아이디"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="비밀번호"
              :rules="{
                required: true,
                min: 8,
                max: 20,
                regex: [/^[0-9a-zA-Z!@#$%^+\-=]*$/],
                passwordCustom: true,
              }"
            >
              <v-text-field
                v-model="pwd"
                :counter="20"
                :error-messages="errors"
                label="비밀번호 (8~20자의 영문 대소문자, 숫자, 특수문자(!@#$%^+\-=))"
                :type="'password'"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="비밀번호 재확인"
              :rules="{
                required: true,
                confirmed: '비밀번호',
              }"
            >
              <v-text-field
                v-model="confirm"
                :counter="20"
                :error-messages="errors"
                label="비밀번호 재확인"
                :type="'password'"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="휴대전화"
              :rules="{
                required: true,
                regex: [/^\d{3}-\d{4}-\d{4}$/],
              }"
            >
              <v-text-field
                v-model="phone"
                :counter="13"
                :error-messages="errors"
                label="휴대전화(010-****-****)"
                required
                @keyup="transToPhone"
              ></v-text-field>
            </validation-provider>
            <v-row no-gutters>
              <v-col cols="10">
                <validation-provider
                  v-slot="{ errors }"
                  name="본인 확인 이메일"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="email"
                    :error-messages="errors"
                    label="본인 확인 이메일(****@****)"
                    required
                    readonly
                    @click="joinMailAuth"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="2" align-self="center">
                <v-btn
                  class="mr-4"
                  @click="joinMailAuth"
                  :disabled="mailAuthComp"
                  text
                  >메일인증</v-btn
                >
              </v-col>
              <v-col>
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateFormatted"
                      label="생년월일"
                      hint="YYYY-MM-DD"
                      persistent-hint
                      v-bind="attrs"
                      @blur="birth = parseDate(dateFormatted)"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="birth"
                    no-title
                    @input="menu1 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <label>주소지</label>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      dense
                      label="우편번호"
                      hide-details="auto"
                      required
                      v-model="postcode"
                      readonly
                      @click="daumPostCode"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      dense
                      label="주소"
                      hide-details="auto"
                      required
                      readonly
                      v-model="mainAddress"
                      @click="daumPostCode"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      dense
                      label="상세 주소"
                      v-model="etcAddress"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="text-right">
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="checkbox"
                >
                  <v-checkbox
                    v-model="ageYn"
                    :error-messages="errors"
                    label="[필수] 만 14세 이상입니다."
                    type="checkbox"
                  ></v-checkbox>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="checkbox"
                >
                  <v-checkbox
                    v-model="storeTermsYn"
                    :error-messages="errors"
                    label="[필수] 로브아네 스토어 이용 약관"
                    type="checkbox"
                    @click="storeTermsDrawerToggle('STORE')"
                  ></v-checkbox>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="checkbox"
                >
                  <v-checkbox
                    v-model="personalTermsYn"
                    :error-messages="errors"
                    label="[필수] 개인정보 수집 및 이용 동의"
                    type="checkbox"
                    @click="storeTermsDrawerToggle('PERSONAL')"
                  ></v-checkbox>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="checkbox"
                >
                  <v-checkbox
                    v-model="emailYn"
                    :error-messages="errors"
                    label="[선택] Email 수신 동의"
                    type="checkbox"
                  ></v-checkbox>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="checkbox"
                >
                  <v-checkbox
                    v-model="phoneYn"
                    :error-messages="errors"
                    label="[선택] SMS 수신 동의"
                    type="checkbox"
                  ></v-checkbox> </validation-provider
              ></v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  class="mr-4"
                  type="submit"
                  :disabled="invalid"
                  block
                  text
                >
                  회원가입
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </validation-observer>
      </v-col>
    </v-row>
    <v-dialog v-model="mailAuthDrawer" width="800px" height="100%" scrollable
      ><mail-auth-dialog v-on:complete="mailAuthComplete"></mail-auth-dialog
    ></v-dialog>
    <v-dialog v-model="storeTermsDrawer" width="800px" height="100%">
      <store-terms-dialog :version="storeTermsVersion"></store-terms-dialog
    ></v-dialog>
  </v-container>
</template>

<script>
import mailAuthDialog from "./dialog/MailAuthDialog.vue";
import StoreTermsDialog from "./dialog/StoreTerms.vue";
export default {
  components: {
    mailAuthDialog,
    StoreTermsDialog,
  },
  data: () => ({
    name: "",
    id: "",
    pwd: "",
    confirm: null,
    phone: null,
    email: null,
    phoneYn: true,
    emailYn: true,
    postcode: "",
    mainAddress: "",
    etcAddress: "",
    birth: null,
    mailAuthDrawer: false,
    mailAuthComp: false,
    storeTermsDrawer: false,
    storeTermsVersion: "",
    ageYn: false,
    storeTermsYn: false,
    personalTermsYn: false,
    menu1: false,
    dateFormatted: "",
  }),
  methods: {
    parseDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    submit() {
      const formData = new FormData();
      if (!this.ageYn || !this.storeTermsYn || !this.personalTermsYn) {
        this.$dialog.message.error("필수 이용약관을 모두 동의해주세요.");
        return;
      }
      if (!this.birth) {
        this.$dialog.message.error("생일을 입력해주세요.");
        return;
      }
      const userInfoDto = {
        name: this.name,
        id: this.id,
        pwd: this.pwd,
        phone: this.phone,
        email: this.email,
        smsYn: this.phoneYn ? "Y" : "N",
        emailYn: this.emailYn ? "Y" : "N",
        postcode: this.postcode,
        mainAddress: this.mainAddress,
        etcAddress: this.etcAddress,
        birth: this.birth,
      };
      formData.append(
        "userInfoDto",
        new Blob([JSON.stringify(userInfoDto)], { type: "application/json" })
      );
      this.$store.dispatch("user/signUp", formData).then((resp) => {
        if (resp) {
          this.$dialog.message.success("회원가입에 성공하셨습니다.");
          this.$store
            .dispatch("user/login", {
              id: this.id,
              pwd: this.pwd,
            })
            .then((resp) => {
              if (!resp)
                this.$dialog.message.error(
                  "유저 정보를 가져오는데 오류가 발생했습니다."
                );
              if (this.$route.path != "/") this.$router.push("/");
            });
        } else {
          this.$dialog.message.error(
            "회원가입에 실패하셨습니다. 다시 시도해주세요."
          );
        }
      });
    },
    imgPreview() {
      if (this.profile_photo != null)
        this.preview = URL.createObjectURL(this.profile_photo);
    },
    clear() {
      this.name = "";
      this.id = "";
      this.pwd = "";
      this.confirm = null;
      this.phone = null;
      this.email = "";
      this.mainAddress = "";
      this.etcAddress = "";
      this.birth = null;
      this.mailAuthComp = false;
      this.$refs.observer.reset();
    },
    daumPostCode() {
      this.$daumPostCode();
    },
    joinMailAuth() {
      if (this.mailAuthComp) return;
      this.$store.commit("common/setMailAuthTy", 0);
      this.mailAuthDrawer = true;
    },
    mailAuthComplete(obj) {
      this.mailAuthDrawer = false;
      this.email = obj.email;
      this.mailAuthComp = true;
    },
    transToPhone(event) {
      this.phone = event.target.value
        .replace(/[^0-9]/g, "")
        .replace(/^(\d{3})(\d{4})(\d{4})$/, `$1-$2-$3`);
    },
    storeTermsDrawerToggle(flag) {
      if (flag) {
        this.storeTermsVersion = flag;
      }
      this.storeTermsDrawer = !this.storeTermsDrawer;
    },
  },
};
</script>
<style scoped></style>
