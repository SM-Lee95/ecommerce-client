<template>
  <v-container>
    <v-row class="text-h6 text-center"><v-col> 주문하기 </v-col></v-row>
    <v-row class="pa-5">
      <v-col>
        <v-data-table
          :headers="header"
          :items="OrderList"
          class="elevation-1"
          hide-default-footer
          disable-sort
        >
          <template v-slot:item.thumbnail="{ item }">
            <v-img
              :src="item.thumbnail"
              max-height="100%"
              min-height="100%"
              max-width="100"
            ></v-img>
          </template>
          <template v-slot:item.name="{ item }">
            <v-row no-gutters class="text-caption">
              <v-col>
                {{ item.name }}
              </v-col>
            </v-row>
            <v-row no-gutters class="text-caption">
              <v-col>
                <v-row
                  no-gutters
                  dense
                  v-for="(detail, index) in item.detail"
                  :key="index"
                >
                  <v-col cols="6">
                    {{ detail.color.name }} - {{ detail.size.name }} -
                    {{ detail.basketCnt }}개
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.deliPri="{ item }">
            <v-row no-gutters class="text-caption">
              <v-col>{{ String(item.deliPri).comma() }}원</v-col></v-row
            >
          </template>
          <template v-slot:item.midSum="{ item }">
            <v-row no-gutters class="text-caption">
              <v-col>{{ String(item.midSum).comma() }}원</v-col></v-row
            >
          </template>
          <template v-slot:item.midCnt="{ item }">
            <v-row no-gutters class="text-caption">
              <v-col>{{ item.midCnt }}개</v-col></v-row
            >
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="6">
        <v-row>
          <v-col cols="3" align-self="center"> 배송지 입력 </v-col>
          <v-col cols="6">
            <v-btn text small @click="inputDeli"> 기본 배송지 입력 </v-btn>
            <v-btn text small @click="daumPostCode"> 주소 검색 </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              dense
              label="우편번호"
              hide-details="auto"
              required
              v-model="postcode"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              dense
              label="주소"
              hide-details="auto"
              required
              readonly
              v-model="mainAddress"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              dense
              label="기타 주소"
              v-model="etcAddress"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col cols="5" align-self="center"> 주문자 정보 </v-col>
          <v-col cols="2">
            <v-btn text small @click="inputUserInfo"> 주문자 정보 입력 </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              dense
              hide-details="auto"
              label="성함"
              v-model="name"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              dense
              hide-details="auto"
              label="연락처"
              v-model="phone"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              dense
              label="요청사항"
              hide-details="auto"
              v-model="reqMemo"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="mt-5"></v-divider>
    <v-row class="pa-2">
      <v-col>
        <v-row class="mt-5">
          <v-col> 주문금액 </v-col>
          <v-col class="text-center">
            {{ String(this.OrderInfo.totPri).comma() }} 원
          </v-col>
        </v-row>
        <v-row>
          <v-col> 상품금액 </v-col>
          <v-col class="text-center">
            + {{ String(this.OrderInfo.totPrdPri).comma() }} 원
          </v-col>
        </v-row>
        <v-row>
          <v-col> 배송비 </v-col>
          <v-col class="text-center">
            + {{ String(this.OrderInfo.totDeliPri).comma() }} 원
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block text @click="doPay">주문하기</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "OrderPage.vue",
  data() {
    return {
      header: [
        {
          text: "",
          value: "thumbnail",
        },
        {
          text: "상품정보(옵션)",
          align: "start",
          value: "name",
        },
        { text: "배송비", value: "deliPri" },
        { text: "수량", value: "midCnt" },
        { text: "상품금액(할인포함)", value: "midSum" },
      ],
      postcode: null,
      mainAddress: null,
      etcAddress: null,
      reqMemo: "",
      phone: "",
      name: "",
    };
  },
  methods: {
    inputDeli() {
      this.postcode = this.UserInfo.postcode;
      this.mainAddress = this.UserInfo.mainAddress;
      this.etcAddress = this.UserInfo.etcAddress;
    },
    inputUserInfo() {
      this.name = this.UserInfo.name;
      this.phone = this.UserInfo.phone;
    },
    doPay() {
      if (!this.UserInfo) {
        this.$dialog.message.warning("로그인 후에 시도해주세요.");
        return;
      }
      if (!this.mainAddress || !this.postcode) {
        this.$dialog.message.warning("주소지 작성 후에 시도해주세요.");
        return;
      }
      if (!this.phone || !this.name) {
        this.$dialog.message.warning("수령자 정보를 작성한 후에 시도해주세요.");
        return;
      }
      let OrderDto = new Object();
      OrderDto.productInfoDto = this.OrderList;
      OrderDto.mainAddress = this.mainAddress;
      OrderDto.etcAddress = this.etcAddress;
      OrderDto.postcode = this.postcode;
      OrderDto.recvPhone = this.phone;
      OrderDto.recvNm = this.name;
      OrderDto.totPri = this.OrderInfo.totPrdPri;
      OrderDto.totDeliPri = this.OrderInfo.totDeliPri;
      OrderDto.totCnt = this.OrderInfo.totCnt;
      OrderDto.reqMemo = this.reqMemo;
      this.$store.dispatch("order/orderComplete", OrderDto).then((resp) => {
        if (resp)
          this.$dialog.message.success(
            "주문 완료되었습니다. 안내드린 계좌번호로 입금해주세요."
          );
        else
          this.$dialog.message.error(
            "주문에 실패하셨습니다. 확인 후 재시도 바랍니다."
          );
        this.$router.push("/");
      });
    },
    daumPostCode() {
      this.$daumPostCode();
    },
  },
  computed: {
    ...mapGetters("order", ["OrderList", "OrderInfo"]),
    ...mapGetters("user", ["UserInfo"]),
  },
};
</script>

<style scoped></style>
