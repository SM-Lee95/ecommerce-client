<template>
  <v-card
    max-width="600px"
    class="mx-auto"
  >
    <validation-observer
      ref="observer"
    >
    <v-list two-line>
        <v-img
          max-height="300px"
          dark
          :src="preview"
        >
            <v-card-text class="align-self-end">
              <button>
                <v-icon @click="saveInfo">mdi-content-save-move</v-icon>
              </button>
            </v-card-text>
        </v-img>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">
            mdi-account
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="this.userInfo.name"></v-list-item-title>
          <v-list-item-subtitle>Name</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <validation-provider
            v-slot="{ errors }"
            rules="fileSize"
          >
            <v-file-input
              @change="imgPreview"
              :error-messages="errors"
              accept="image/png, image/jpeg, image/bmp"
              prepend-icon="mdi-camera-plus-outline"
              v-model="profile_photo"
              hide-input
              truncate-length="15"
            ></v-file-input>
          </validation-provider>
        </v-list-item-icon>
      </v-list-item>
      <v-divider inset></v-divider>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">
            mdi-phone
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content v-show="!isModi">
          <v-list-item-title v-text="this.userInfo.phone"></v-list-item-title>
          <v-list-item-subtitle>Mobile</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-content v-show="isModi">
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
            :error-messages="errors"
            :counter="13"
            label="Phone"
          ></v-text-field>
          </validation-provider>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon @click="transForm">mdi-lead-pencil</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-divider inset></v-divider>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">
            mdi-email
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content v-show="!isModi">
          <v-list-item-title v-text="this.userInfo.email"></v-list-item-title>
          <v-list-item-subtitle>Mail</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-content v-show="isModi">
          <validation-provider
            v-slot="{ errors }"
            name="email"
            rules="required|email"
          >
          <v-text-field
            v-model="email"
            :error-messages="errors"
            label="Email"
          ></v-text-field>
          </validation-provider>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon>mdi-lead-pencil</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-divider inset></v-divider>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">
            mdi-map-marker
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content v-show="!isModi">
          <v-list-item-title v-text="this.userInfo.postcode"></v-list-item-title>
          <v-list-item-subtitle v-text="this.userInfo.main_address"></v-list-item-subtitle>
          <v-list-item-subtitle v-text="this.userInfo.etc_address"></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-content v-show="isModi">
        <v-container>
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
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon @click="daumPostCode">mdi-lead-pencil</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-divider inset></v-divider>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">
            mdi-message-processing
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>SMS 수신 여부</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-checkbox v-model="sms_yn"></v-checkbox>
        </v-list-item-action>
      </v-list-item>
      <v-divider inset></v-divider>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">
            mdi-email-receive
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Email 수신 여부</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-checkbox v-model="email_yn"></v-checkbox>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    </validation-observer>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    isModi:false,
    email:"",
    phone:"",
    postcode:"",
    mainAddress:"",
    etcAddress:"",
    sms_yn: true,
    email_yn: true,
    profile_photo: null,
    preview: null,
  }),
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    imgPreview(){
      this.preview = URL.createObjectURL(this.profile_photo);
      this.isModi=true;
    },
    saveInfo(){
      if(!this.isModi){
       alert("변경 후 저장을 시도해주세요.");
       return;
      }
      if(this.preview.size >= 5000000){
        alert("파일 크기는 5MB 이하로 등록해주세요.");
        return;
      }
      this.$refs.observer.validate().then((resp)=>{
        if(resp == false){
          alert("입력값을 확인해주세요.");
          return;
        }else{
          this.$store.dispatch("updateInfo", {
            name: this.name,
            id: this.id,
            pwd: this.pwd,
            phone: this.phone,
            email: this.email,
            sms_yn: this.phoneYn,
            email_yn: this.emailYn,
            postcode: this.postcode,
            main_address: this.mainAddress,
            etc_address: this.etcAddress,
            birth: this.birth
          }).then((resp) => {
            if (resp == "200")
              this.isModi = false;
          });
        }
      });
    },
    transForm() {
      this.isModi = !this.isModi;
    },
    daumPostCode() {
      this.isModi = true;
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
        }
      }).open();
    }
  },
  mounted() {
    this.email = this.userInfo.email;
    this.phone = this.userInfo.phone;
    this.postcode = this.userInfo.postcode;
    this.mainAddress = this.userInfo.main_address;
    this.etcAddress = this.userInfo.etc_address;
    this.email_yn = this.userInfo.email_yn;
    this.sms_yn = this.userInfo.sms_yn;
    this.preview = this.userInfo.profile_url;
  }
};
</script>
<style scoped>

</style>