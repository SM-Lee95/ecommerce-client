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
          v-show="!isModi"
          :src="this.userInfo.profileUrl"
        >
        </v-img>
      <v-img
        max-height="300px"
        dark
        :src="preview"
        v-show="isModi"
      >
      </v-img>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="green darken-2">
            mdi-account
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="this.userInfo.id+' ( '+this.userInfo.name+' )'"></v-list-item-title>
          <v-list-item-subtitle>ID (이름)</v-list-item-subtitle>
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
          <v-icon color="green darken-2">
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
          <v-icon color="green darken-2">
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
          <v-icon @click="transForm">mdi-lead-pencil</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-divider inset></v-divider>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="green darken-2">
            mdi-map-marker
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content v-show="!isModi">
          <v-list-item-title v-text="this.userInfo.postcode"></v-list-item-title>
          <v-list-item-subtitle v-text="this.userInfo.mainAddress"></v-list-item-subtitle>
          <v-list-item-subtitle v-text="this.userInfo.etcAddress"></v-list-item-subtitle>
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
          <v-icon color="green darken-2">
            mdi-message-processing
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>SMS 수신 여부</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-checkbox @change="transForm" v-model="sms_yn"></v-checkbox>
        </v-list-item-action>
      </v-list-item>
      <v-divider inset></v-divider>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="green darken-2">
            mdi-email-receive
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Email 수신 여부</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-checkbox @change="transForm" v-model="email_yn"></v-checkbox>
        </v-list-item-action>
      </v-list-item>
      <v-divider inset></v-divider>
      <v-container>
        <v-row>
          <v-col cols="6"></v-col>
          <v-col cols="2">
            <v-btn @click="saveInfo">
              저장
              <v-icon color="green darken-2">mdi-content-save-move</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn @click.stop="passModiDrawer = !passModiDrawer">
              비밀번호변경
              <v-icon color="green darken-2" >mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-list>
      <v-dialog
        v-model="passModiDrawer"
        persistent
        width="600px"
        height="500px"
      >
        <v-container class="white">
          <v-row>
            <v-col cols="3" align-self="center">
              비밀번호변경
            </v-col>
            <v-col cols="8"></v-col>
            <v-col cols="1">
              <v-btn
                small
                icon
                @click.stop="passModiDrawer = !passModiDrawer"
              >
                <v-icon color="green darken-2" >mdi-close-box</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="12">
              <validation-provider
                v-slot="{ errors }"
                name="curPwd"
                rules="required|max:20|min:8"
              >
                <v-text-field
                  v-model="currentPwd"
                  :counter="20"
                  :error-messages="errors"
                  label="기존 비밀번호"
                  :type="'password'"
                  required
                ></v-text-field>
              </validation-provider>
            </v-col>
           </v-row>
            <v-divider></v-divider>
          <v-row>
            <v-col cols="12">
              <validation-provider
                v-slot="{ errors }"
                name="newPassword"
                rules="required|max:20|min:8"
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
            </v-col>
          </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="12">
              <validation-provider
                v-slot="{ errors }"
                name="confirm"
                rules="required|max:20|min:8|confirmed:newPassword"
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
            <v-col cols="3">
            </v-col>
            <v-col cols="7"></v-col>
            <v-col cols="2">
              <v-btn
                @click="savePass"
                icon
              >
                저장
                <v-icon color="green darken-2" >mdi-content-save-move</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-dialog>
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
    sms_yn: null,
    email_yn: null,
    profile_photo: null,
    preview: null,
    passModiDrawer:false,
    currentPwd: null,
    newPwd: null,
    confirmPwd: null,
  }),
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    imgPreview(){
      this.preview = URL.createObjectURL(this.profile_photo);
      this.isModi=true;
    },
    savePass(){
      this.$refs.observer.validate().then((resp)=>{
        if(resp == false){
          alert("입력값을 확인해주세요.");
          return;
        }else{
          console.log(this.userInfo.id);
          this.$store.dispatch("updatePass", {
            id: this.userInfo.id,
            pwd: this.currentPwd,
            newPwd: this.newPwd,
          }).then((resp) => {
            if (resp == "200"){
              this.passModiDrawer = false;
            }
          });
        }
      });
    },
    saveInfo(){
      if(!this.isModi){
       alert("변경 후 저장을 시도해주세요.");
       return;
      }
      this.$refs.observer.validate().then((resp)=>{
        if(resp == false){
          alert("입력값을 확인해주세요. ex) 파일크기 5MB 제한");
          return;
        }else{
          const userInfoDto = {
            phone: this.phone,
            email: this.email,
            smsYn: this.phoneYn?1:0,
            emailYn: this.emailYn?1:0,
            postcode: this.postcode,
            mainAddress: this.mainAddress,
            etcAddress: this.etcAddress,
          };
          const formData = new FormData();
          if(this.preview != null)
            formData.append("file",this.profile_photo);
          formData.append("userInfoDto",new Blob([JSON.stringify(userInfoDto)],{type:"application/json"}));
          this.$store.dispatch("updateInfo", formData).then((resp) => {
            this.isModi = false;
            if (resp == "200"){
              this.$store.dispatch("getUserInfo",this.userInfo.id);
            }
          });
        }
      });
    },
    transForm() {
      this.isModi = true;
      this.setLocalData();
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
    },
    setLocalData(){
      this.email = this.userInfo.email;
      this.phone = this.userInfo.phone;
      this.postcode = this.userInfo.postcode;
      this.mainAddress = this.userInfo.mainAddress;
      this.etcAddress = this.userInfo.etcAddress;
      this.email_yn = this.userInfo.emailYn==1?true:false;
      this.sms_yn = this.userInfo.smsYn==1?true:false;
      this.preview = this.userInfo.profileUrl;
    },
  },
  mounted() {
    this.setLocalData();
  }
};
</script>
<style scoped>

</style>