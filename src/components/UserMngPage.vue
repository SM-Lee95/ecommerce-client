<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-toolbar flat>
          <v-row>
            <v-col cols="3">
              <v-select
                :items="OptionList"
                item-text="name"
                item-value="cd"
                v-model="optionCd"
                flat
                prepend-inner-icon="mdi-magnify"
                label="검색조건"
              ></v-select>
            </v-col>
            <v-col cols="8">
              <v-text-field
                clearable
                flat
                v-model="searchValue"
                prepend-inner-icon="mdi-magnify"
                label="검색어"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-btn text @click="searchList"> 검색 </v-btn>
            </v-col>
          </v-row>
        </v-toolbar>
        <v-row>
          <v-col class="text-right">
            <v-btn text @click="passwordReset">패스워드 초기화</v-btn>
          </v-col></v-row
        >
        <v-data-table
          :headers="header"
          :items="UserList"
          class="elevation- mt-3"
          hide-default-footer
          no-data-text="회원정보가 존재하지 않습니다."
          :items-per-page="-1"
          v-model="selected"
          show-select
        >
          <template v-slot:item.address="{ item }">
            ({{ item.postcode }})
            {{ item.mainAddress }}
            {{ item.etcAddress }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small @click="editDialog(item)"> mdi-pencil </v-icon>
          </template>
          <template v-slot:item.statFlag="{ item }">
            {{ item.statFlag == "001" ? "사용" : "중지" }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "UserMngPage",
  methods: {
    editDialog(item) {
      this.$store.commit("user/setUserEditObjList", Object.assign({}, item));
      this.modiDialog = !this.modiDialog;
    },
    searchList() {
      if (
        this.searchValue != "" &&
        this.optionCd == "cd" &&
        isNaN(this.searchValue)
      ) {
        this.$dialog.message.error(
          "회원번호 검색시에는 숫자만 입력 가능합니다."
        );
        return;
      }
      let reqData = {
        optionCd: this.optionCd,
        searchValue: this.searchValue,
      };
      this.$store
        .dispatch("user/selectUserList", { params: reqData })
        .then((resp) => {
          if (!resp)
            this.$dialog.message.warning("조회 중 에러가 발생했습니다.");
        });
    },
    passwordReset() {
      if (this.selected.length != 1) {
        this.$dialog.message.error("단일 유저 선택 후 진행해주세요.");
        return;
      }
      this.$dialog
        .confirm({
          title: "고객 패스워드 초기화",
          text: "초기 비밀번호로 초기화 하시겠습니까?<br/>초기 비밀번호 : lovaneinit",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let obj = this.selected[0];
          this.$store
            .dispatch("user/updatePassToInit", {
              id: obj.id,
              newPwd: "lovaneinit",
            })
            .then((resp) => {
              if (resp) {
                this.$dialog.message.success("비밀번호 초기화 완료되었습니다.");
              } else {
                this.$dialog.message.warning(
                  "비밀번호 초기화에 실패하셨습니다."
                );
              }
            });
        });
    },
  },
  data: () => ({
    header: [
      { text: "회원번호", value: "cd", align: "center" },
      { text: "회원명", value: "name", align: "center" },
      { text: "아이디", value: "id", align: "center" },
      { text: "주소", value: "address", align: "center" },
      { text: "연락처", value: "phone", align: "center" },
      { text: "문자수신여부", value: "smsYn", align: "center" },
      { text: "이메일", value: "email", align: "center" },
      { text: "이메일수신여부", value: "emailYn", align: "center" },
      { text: "계정상태", value: "statFlag", align: "center" },
      { text: "권한", value: "auth", align: "center" },
    ],
    OptionList: [
      { name: "회원번호", cd: "cd" },
      { name: "회원명", cd: "name" },
      { name: "아이디", cd: "id" },
      { name: "연락처", cd: "phone" },
    ],
    optionCd: "name",
    searchValue: "",
    selected: [],
    editObjList: [],
    modiDialog: false,
  }),
  computed: {
    ...mapGetters("common", ["ProcList", "OrderProcList", "DeliList"]),
    ...mapGetters("user", ["UserList"]),
  },
};
</script>

<style scoped></style>
