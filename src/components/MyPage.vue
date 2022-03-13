<template>
  <v-card
    max-width="375"
    height="400"
    class="mx-auto"
  >
    <v-list two-line>
        <v-img
          max-height="300px"
          dark
          :src="this.userInfo.profile_url"
        ></v-img>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">
            mdi-account
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ this.userInfo.name }}</v-list-item-title>
          <v-list-item-subtitle>Name</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon @click="saveInfo">mdi-content-save-check</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-divider inset></v-divider>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">
            mdi-phone
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ this.userInfo.phone }}</v-list-item-title>
          <v-list-item-subtitle>Mobile</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon>mdi-lead-pencil</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-divider inset></v-divider>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">
            mdi-email
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ this.userInfo.email }}</v-list-item-title>
          <v-list-item-subtitle>Mail</v-list-item-subtitle>
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
        <v-list-item-content>
          <v-list-item-title v-model="this.userInfo.postcode"></v-list-item-title>
          <v-list-item-subtitle v-model="this.userInfo.main_address"></v-list-item-subtitle>
          <v-list-item-subtitle v-model="this.userInfo.etc_address"></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon @click="daumPostCode">mdi-lead-pencil</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-divider inset></v-divider>
      <v-list-item>
        <v-list-item-action>
          <v-checkbox v-model="this.userInfo.sms_yn" readonly></v-checkbox>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>SMS 수신 여부</v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon>mdi-lead-pencil</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-divider inset></v-divider>
      <v-list-item>
        <v-list-item-action>
          <v-checkbox v-model="this.userInfo.email_yn" readonly></v-checkbox>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Email 수신 여부</v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon @click="transForm">
          <v-icon>mdi-lead-pencil</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({}),
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    saveInfo(){
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
          this.$store.dispatch("login", {
            id: this.id,
            pwd: this.pwd
          }).then(() => {
            this.$router.push("/");
          });
      });
    },
    transForm() {

    },
    daumPostCode() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          if (this.userInfo.etcAddress !== "") {
            this.userInfo.etcAddress = "";
          }
          if (data.userSelectedType === "R") {
            // 사용자가 도로명 주소를 선택했을 경우
            this.userInfo.mainAddress = data.roadAddress;
          } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            this.userInfo.mainAddress = data.jibunAddress;
          }

          // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
          if (data.userSelectedType === "R") {
            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
              this.userInfo.etcAddress += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if (data.buildingName !== "" && data.apartment === "Y") {
              this.userInfo.etcAddress +=
                this.userInfo.etcAddress !== ""
                  ? `, ${data.buildingName}`
                  : data.buildingName;
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if (this.userInfo.etcAddress !== "") {
              this.userInfo.etcAddress = `(${this.userInfo.etcAddress})`;
            }
          } else {
            this.userInfo.etcAddress = "";
          }
          // 우편번호를 입력한다.
          this.userInfo.postcode = data.zonecode;
        }
      }).open();
    }
  }
};
</script>
<style scoped>

</style>