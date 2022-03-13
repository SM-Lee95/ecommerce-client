<template>
  <v-container class="grey lighten-5">
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
      >
        <form @submit.prevent="submit">
          <validation-provider
            v-slot="{ errors }"
            name="name"
            rules="required|max:15"
          >
            <v-text-field
              v-model="name"
              :counter="15"
              :error-messages="errors"
              label="Full Name"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="id"
            rules="required|max:20|existId"
          >
            <v-text-field
              v-model="id"
              :counter="20"
              :error-messages="errors"
              label="ID"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="pwd"
            rules="required|max:20|min:8"
          >
            <v-text-field
              v-model="pwd"
              :counter="20"
              :error-messages="errors"
              label="Password"
              :type="'password'"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="confirm"
            rules="required|max:20|min:8|confirmed:pwd"
          >
            <v-text-field
              v-model="confirm"
              :counter="20"
              :error-messages="errors"
              label="Confirm Input Password"
              :type="'password'"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="phone"
            :rules="{
          required: true,
          regex: [/^\d{2,3}-\d{3,4}-\d{4}$/]
        }"
          >
            <v-text-field
              v-model="phone"
              :counter="13"
              :error-messages="errors"
              label="Phone Number"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="email"
            rules="required|email"
          >
            <v-text-field
              v-model="email"
              :error-messages="errors"
              label="E-mail"
              required
            ></v-text-field>
          </validation-provider>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-row  justify="start">
                <v-chip
                  class="ma-2"
                  label
                >
                  Profile
                </v-chip>
                  <v-img :src="preview" max-width="290px" max-height="388px" alt="프로필 사진을 등록해주세요."></v-img>
                </v-row>
            </v-col>
            <v-col cols="6">
              <v-row justify="start">
                <v-chip
                  class="ma-2"
                  label
                >
                  Birth Day
                </v-chip>
                <v-date-picker
                  v-model="birth"
                  year-icon="mdi-calendar-blank"
                  prev-icon="mdi-skip-previous"
                  next-icon="mdi-skip-next"
                ></v-date-picker>
              </v-row>
            </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  rules="fileSize"
                  name="Profile Input"
                >
                  <v-file-input
                    @change="imgPreview"
                    label="Profile Input"
                    show-size
                    :error-messages="errors"
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Pick an your picture"
                    filled
                    prepend-icon="mdi-camera"
                    v-model="profile_photo"
                  ></v-file-input>
                </validation-provider>
              </v-col>
            </v-row>
            </v-container>
          <v-container>
            <label>Address</label>
            <v-row>
              <v-col
                cols="6"
              >
                <v-text-field dense
                              label="Postcode"
                              hide-details="auto"
                              required
                              v-model="postcode"
                              readonly
                              @click="daumPostCode"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
              >
                <v-text-field dense
                              label="Main Address"
                              hide-details="auto"
                              required
                              readonly
                              v-model="mainAddress"
                              @click="daumPostCode"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
              >
                <v-text-field dense label="ETC Address" v-model="etcAddress"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
            <validation-provider
            v-slot="{ errors }"
            rules="required"
            name="checkbox"
          >
            <v-checkbox
              v-model="emailYn"
              :error-messages="errors"
              label="Email 수신 동의"
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
              label="SMS 수신 동의"
              type="checkbox"
            ></v-checkbox>
          </validation-provider>
          <v-btn
            class="mr-4"
            type="submit"
            :disabled="invalid"
          >
            회원가입
          </v-btn>
          <v-btn @click="clear">
            초기화
          </v-btn>
        </form>
      </validation-observer>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    name: '',
    id: '',
    pwd: '',
    confirm: null,
    phone: null,
    email: null,
    phoneYn: 1,
    emailYn: 1,
    postcode: "",
    mainAddress: "",
    etcAddress: "",
    birth: null,
    profile_photo: null,
    preview: null,
  }),
  methods: {
    submit () {
      const formData = new FormData();
      const userInfoDto = { name:this.name,
        id:this.id,
        pwd:this.pwd,
        phone:this.phone,
        email:this.email,
        sms_yn:this.phoneYn,
        email_yn:this.emailYn,
        postcode:this.postcode,
        main_address:this.mainAddress,
        etc_address:this.etcAddress,
        birth:this.birth};
      formData.append("file",this.profile_photo);
      formData.append("userInfoDto",new Blob([JSON.stringify(userInfoDto)],{type:"application/json"}));
      this.$store.dispatch("signUp",formData).then((resp) => {
          if(resp == "200")
            this.$store.dispatch("login",{
              id:this.id,
              pwd:this.pwd,
            }).then(() => {
              this.$router.push("/");
            })
      })
    },
    imgPreview(){
      console.log(">>"+this.profile_photo);
      this.preview = URL.createObjectURL(this.profile_photo);
    },
    clear () {
      this.name = ''
      this.id = ''
      this.pwd = ''
      this.confirm = null
      this.phone = null
      this.email = ''
      this.mainAddress = ''
      this.etcAddress = ''
      this.birth=null
      this.$refs.observer.reset();
    },
    daumPostCode(){
      new window.daum.Postcode({
        oncomplete: (data) => {
          if (this.etcAddress !== "") {
            this.etcAddress = "";
          }
          if (data.userSelectedType === "R") {
            // 사용자가 도로명 주소를 선택했을 경우
            this.mainAddress = data.roadAddress;
          } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            this.mainAddress = data.jibunAddress;
          }

          // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
          if (data.userSelectedType === "R") {
            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
              this.etcAddress += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if (data.buildingName !== "" && data.apartment === "Y") {
              this.etcAddress +=
                this.etcAddress !== ""
                  ? `, ${data.buildingName}`
                  : data.buildingName;
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if (this.etcAddress !== "") {
              this.etcAddress = `(${this.etcAddress})`;
            }
          } else {
            this.etcAddress = "";
          }
          // 우편번호를 입력한다.
          this.postcode = data.zonecode;
        },
      }).open();
    },
  },
}
</script>
<style scoped>

</style>