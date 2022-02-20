 <template>
    <v-card
      max-width="375"
      class="mx-auto"
    >
      <v-img
        :src="profileImg"
        height="300px"
        dark
        alt="https://cdn.vuetifyjs.com/images/lists/ali.png"
      >
        <v-row class="fill-height">
          <v-card-title>
            <v-btn
              dark
              icon
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
              dark
              icon
              class="mr-4"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              dark
              icon
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-card-title>

          <v-spacer></v-spacer>

          <v-card-title class="white--text pl-12 pt-12">
            <div class="text-h4 pl-12 pt-12">
              {{this.userInfo.id}}
            </div>
          </v-card-title>
        </v-row>
      </v-img>

      <v-list two-line>
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="indigo">
              mdi-account
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{this.userInfo.name}}</v-list-item-title>
            <v-list-item-subtitle>Name</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider inset></v-divider>
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="indigo">
              mdi-phone
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{this.userInfo.phone}}</v-list-item-title>
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
            <v-list-item-title>{{this.userInfo.email}}</v-list-item-title>
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
            <v-list-item-title>{{this.userInfo.postcode}}</v-list-item-title>
            <v-list-item-subtitle>{{this.userInfo.main_address}}</v-list-item-subtitle>
            <v-list-item-subtitle>{{this.userInfo.etc_address}}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-lead-pencil</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-divider inset></v-divider>
        <v-list-item>
          <v-list-item-action>
            <v-checkbox v-model="userInfo.sms_yn" readonly></v-checkbox>
          </v-list-item-action>
          <v-list-item-content >
            <v-list-item-title>SMS 수신 여부</v-list-item-title>

          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-lead-pencil</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-divider inset></v-divider>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="userInfo.email_yn" readonly></v-checkbox>
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
  data: () => ({
  }),
  computed:{
    ...mapState(["userInfo"])
  },
  methods: {
    transForm(){

    },
    submit () {
      this.$store.dispatch("signUp",{
        name:this.name,
        id:this.id,
        pwd:this.pwd,
        phone:this.phone,
        email:this.email,
        sms_yn:this.phoneYn,
        email_yn:this.emailYn,
        postcode:this.postcode,
        main_address:this.mainAddress,
        etc_address:this.etcAddress,
        birth:this.birth,
      }).then((resp) => {
        if(resp == "200")
          this.$store.dispatch("login",{
            id:this.id,
            pwd:this.pwd,
          }).then(() => {
            this.$router.push("/");
          })
      })
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