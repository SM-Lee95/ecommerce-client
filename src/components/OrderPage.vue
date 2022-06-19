<template>
  <v-container>
    <v-row>
      <v-col cols="12">
    <v-data-table
      :headers="header"
      :items="OrderList"
      class="elevation-1"
      hide-default-footer
      disable-sort
    >
      <template v-slot:item.thumbnail="{item}">
        <v-img :src="item.thumbnail" max-height="100" max-width="100" contain></v-img>
      </template>
      <template v-slot:item.name="{ item }">
        <v-row>
          <v-col>
          {{item.name}}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-row  dense
                    v-for="(detail,index) in item.detail"
                    :key="index">
              <v-col cols="6">
                {{detail.color.name}} - {{detail.size.name}} - {{detail.basketCnt}}개
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.deliPri="{item}">
        {{item.deliPri}}원
      </template>
      <template v-slot:item.midSum="{item}">
        {{item.midSum}}원
      </template>
      <template v-slot:item.midCnt="{item}">
        {{item.midCnt}}개
      </template>
    </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-container>
          <v-row no-gutters>
            <v-col cols="3" align-self="center">
              배송지 입력
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="2">
              <v-btn text x-small @click="inputDeli">
                  기본 배송지 입력
              </v-btn>
            </v-col>
            <v-col cols="1"></v-col>
            <v-col cols="2">
              <v-btn text x-small @click="daumPostCode">
                  주소 검색
              </v-btn>
            </v-col>
            <v-col cols="2"></v-col>
          </v-row>
          <v-row>
            <v-col
              cols="6"
            >
              <v-text-field dense
                            label="우편번호"
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
                            label="주소"
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
              <v-text-field dense label="기타 주소" v-model="etcAddress"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="6">
        <v-container>
          <v-row no-gutters>
            <v-col cols="5" align-self="center">
              주문자 정보
            </v-col>
          </v-row>
          <v-row>
            <v-col>
            {{this.getUserInfo.name}} ({{this.getUserInfo.phone}})
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
            >
              <v-text-field dense label="요청사항" v-model="reqMemo"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-row>
          <v-col>
            결제상세
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            주문금액
          </v-col>
          <v-col cols="6"></v-col>
          <v-col cols="3">
            {{this.OrderList.totPri}} 원
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            > 상품금액
          </v-col>
          <v-col cols="6"></v-col>
          <v-col cols="3">
           + {{this.OrderList.totPrdPri}} 원
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            > 배송비
          </v-col>
          <v-col cols="6"></v-col>
          <v-col cols="3">
           + {{this.OrderList.totDeliPri}} 원
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block @click="doPay">결제하기</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "OrderPage.vue",
  data(){
    return {
      header: [
        {
          text: '',
          value: 'thumbnail',
        },
        {
          text: '상품정보(옵션)',
          align: 'start',
          value: 'name',
        },
        { text: '공급사', value: 'corpNm' },
        { text: '배송비', value: 'deliPri' },
        { text: '수량', value: 'midCnt' },
        { text: '상품금액(할인포함)', value: 'midSum' },
      ],
      payPri: 0,
      postcode: null,
      mainAddress: null,
      etcAddress: null,
      reqMemo: "",
    }
  },
  methods:{
    inputDeli(){
      this.postcode = this.getUserInfo.postcode;
      this.mainAddress = this.getUserInfo.mainAddress;
      this.etcAddress = this.getUserInfo.etcAddress;
    },
    doPay(){

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
  },
  computed:{
    ...mapGetters(["OrderList","getUserInfo"]),
  },
};
</script>

<style scoped>

</style>