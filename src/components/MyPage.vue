<template>
  <v-container>
    <!-- 개인정보 수정 다이얼로그 -->
    <v-dialog
      transition="dialog-bottom-transition"
      v-model="userInfoDrawer"
      persistent
      max-width="600px"
      height="1000px"
    >
      <v-container class="white">
        <v-row>
          <v-col cols="3" align-self="center">
            개인정보수정
          </v-col>
          <v-col cols="8"></v-col>
          <v-col cols="1">
            <v-btn
              icon
              @click.stop="setUserInfoDrawer"
              right
            >
              <v-icon>mdi-close-box</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <modi-info-page />
    </v-dialog>
    <v-container>
      <v-row>
        <v-col class="text-h4">
          MyPage
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2"></v-col>
        <v-col align-self="center" cols="7">
          <v-row>
            <v-col cols="3" class="text-h5">{{getUserInfo.name}}</v-col>
            <v-col cols="6" class="text-h6">
            ({{getUserInfo.id}})
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3">
          <v-btn
            class="mx-2"
            text
            @click.stop="setUserInfoDrawer"
          >
            회원정보 확인/변경
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <!--요약 화면-->
    <v-container>
      <v-row dense style="min-height: 100%">
        <v-col>
          <v-btn
          v-for="(process, index) in OrderHisSummary"
          :key="index"
          text
          @click="getHisList(index)"
          >
            {{index + " : " + process}}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <v-container>
      <v-row>
        <v-col class="mb-3">
          주문목록 / 배송조회 내역 총 {{this.OrderHisList.length}} 건
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-data-table
        :headers="header"
        :items="this.OrderHisList"
        class="elevation-1"
        hide-default-footer
        disable-sort
      >
        <template v-slot:item.date="{ item }">
          {{item.regDati[0]+"/"+item.regDati[1]+"/"+item.regDati[2]}}
        </template>
        <template v-slot:item.cd="{item}">
          {{item.cd}}
        </template>
        <template v-slot:item.info="{item}">
          {{item.ordsDoc}}
        </template>
        <template v-slot:item.pri="{item}">
          {{item.totPri.comma()+" 원"}}
        </template>
        <template v-slot:item.proc="{item}">
          {{OrderProc[item.procTy]}}
        </template>
      </v-data-table>
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import modiInfoPage from "../components/ModiInfoPage.vue";

export default {
  components: {
    modiInfoPage,
  },
  data: () => ({
    userInfoDrawer: false,
    header: [
      { text: '주문일자', value: 'date', align: 'center'},
      { text: '주문번호', value: 'cd', align: 'center'},
      { text: '주문정보', value: 'info', align: 'center' },
      { text: '결제금액', value: 'pri' , align: 'center'},
      { text: '주문상태', value: 'proc', align: 'center' },
    ],
  }),
  computed: {
    ...mapGetters(["getUserInfo","OrderHisList","OrderHisSummary","OrderProc"]),
  },
  methods: {
    setUserInfoDrawer(){
      this.userInfoDrawer = !this.userInfoDrawer;
    },
    getHisList(flag){
      var code = new Array();
      for(var codeVal in this.OrderProc){
        if(flag.includes(this.OrderProc[codeVal]))
            code.push(codeVal);
      }
      this.$store.dispatch("getMyPageInfo",)
    }
  },
  mounted() {

  }
};
</script>
<style scoped>

</style>