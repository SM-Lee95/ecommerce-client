<template>
  <v-container fluid class="white">
      <validation-observer
        ref="observer"
      >
        <v-list two-line>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="gray darken-2">
                mdi-account
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="this.getUserInfo.id+' ( '+this.getUserInfo.name+' )'"></v-list-item-title>
              <v-list-item-subtitle>ID (이름)</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="gray darken-2">
                mdi-phone
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content v-show="!isModi">
              <v-list-item-title v-text="this.getUserInfo.phone"></v-list-item-title>
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
                  label="Phone(010-****-****)"
                ></v-text-field>
              </validation-provider>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon @click="transForm">mdi-lead-pencil</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="gray darken-2">
                mdi-email
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content v-show="!isModi">
              <v-list-item-title v-text="this.getUserInfo.email"></v-list-item-title>
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
                  label="Email(****@****.com)"
                ></v-text-field>
              </validation-provider>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon @click="transForm">mdi-lead-pencil</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="gray darken-2">
                mdi-map-marker
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content v-show="!isModi">
              <v-list-item-title v-text="this.getUserInfo.postcode"></v-list-item-title>
              <v-list-item-subtitle v-text="this.getUserInfo.mainAddress"></v-list-item-subtitle>
              <v-list-item-subtitle v-text="this.getUserInfo.etcAddress"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content v-show="isModi">
              <v-row>
                <v-col cols="6">
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
                <v-col>
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
                <v-col>
                  <v-text-field dense label="ETC Address" v-model="etcAddress"></v-text-field>
                </v-col>
              </v-row>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon @click="daumPostCode">mdi-lead-pencil</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="gray darken-2">
                mdi-message-processing
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>SMS 수신 여부</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-checkbox @change="transForm(true)" v-model="smsYn"></v-checkbox>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="gray darken-2">
                mdi-email
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Email 수신 여부</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-checkbox @change="transForm(true)" v-model="emailYn"></v-checkbox>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
          <v-row class="text-right">
            <v-col>
              <v-btn @click="saveInfo" text>
                저장
                <v-icon color="gray darken-2">mdi-content-save-move</v-icon>
              </v-btn>
              <v-btn @click.stop="passModiDrawer = !passModiDrawer" text>
                비밀번호변경
                <v-icon color="gray darken-2">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-list>
        <v-dialog
          v-model="passModiDrawer"
          width="600px"
          height="100%"
          scrollable
        >
          <v-row class="white" no-gutters>
            <v-col>
              <v-row class="mt-1">
                <v-col class="mt-1 ml-1 text-h6">
                  비밀번호변경
                </v-col>
                <v-col></v-col>
                <v-col class="text-right">
                  <v-btn
                    small
                    icon
                    @click.stop="passModiDrawer = !passModiDrawer"
                  >
                    <v-icon color="gray darken-2">mdi-close-box</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row>
                <v-col class="ml-2 mr-2">
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
                <v-col class="text-right">
                  <v-btn @click="savePass" text>
                    저장
                    <v-icon color="gray darken-2">mdi-content-save-move</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-dialog>
      </validation-observer>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    isModi: false,
    email: "",
    phone: "",
    postcode: "",
    mainAddress: "",
    etcAddress: "",
    smsYn: true,
    emailYn: true,
    passModiDrawer: false,
    currentPwd: null,
    newPwd: null,
    confirmPwd: null
  }),
  computed: {
    ...mapGetters(["getUserInfo"])
  },
  methods: {
    savePass() {
      this.$refs.observer.validate().then((resp) => {
        if (resp == false) {
          this.$dialog.message.warning("입력값을 확인해주세요.");
          return;
        } else {
          this.$store.dispatch("updatePass", {
            id: this.getUserInfo.id,
            pwd: this.currentPwd,
            newPwd: this.newPwd
          }).then((resp) => {
            if (resp) {
              this.$dialog.message.success("비밀번호 변경에 성공하셨습니다.");
              this.passModiDrawer = false;
            } else {
              this.$dialog.message.warning("비밀번호 변경에 실패하셨습니다. 기존 비밀번호를 확인해주세요.");
            }
          });
        }
      });
    },
    saveInfo() {
      if (!this.isModi) {
        this.$dialog.message.warning("변경 후 저장을 시도해주세요.");
        return;
      }
      this.$refs.observer.validate().then((resp) => {
        if (resp == false) {
          this.$dialog.message.warning("입력값을 확인해주세요.");
          return;
        } else {
          const userInfoDto = {
            phone: this.phone,
            email: this.email,
            smsYn: this.smsYn ? 1 : 0,
            emailYn: this.emailYn ? 1 : 0,
            postcode: this.postcode,
            mainAddress: this.mainAddress,
            etcAddress: this.etcAddress
          };
          const formData = new FormData();
          formData.append("userInfoDto", new Blob([JSON.stringify(userInfoDto)], { type: "application/json" }));
          this.$store.dispatch("updateInfo", formData).then((resp) => {
            this.isModi = false;
            if (resp) {
              this.$dialog.message.success("정보 변경에 성공하셨습니다.");
              this.$store.dispatch("getUserInfo", this.getUserInfo.id);
            } else {
              this.$dialog.message.warning("정보 변경에 실패하셨습니다. 다시 시도해주세요.");
            }
          });
        }
      });
    },
    transForm(chkFlag) {
      if (!this.isModi) this.setLocalData(chkFlag);
      this.isModi = true;
    },
    daumPostCode() {
      this.$daumPostCode();
    },
    setLocalData(chkFlag) {
      this.email = this.getUserInfo.email;
      this.phone = this.getUserInfo.phone;
      this.postcode = this.getUserInfo.postcode;
      this.mainAddress = this.getUserInfo.mainAddress;
      this.etcAddress = this.getUserInfo.etcAddress;
      if (!chkFlag) {
        this.emailYn = this.getUserInfo.emailYn == 1;
        this.smsYn = this.getUserInfo.smsYn == 1;
      }
    }
  },
  mounted() {
    this.setLocalData();
  }
};
</script>
<style scoped>

</style>