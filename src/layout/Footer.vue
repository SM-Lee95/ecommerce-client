<template>
  <v-container fluid>
    <v-btn
      fab
      dark
      fixed
      bottom
      right
      color="black"
      small
      @click="$vuetify.goTo(0)"
      style="margin-bottom: 50px"
    >
      <v-icon> mdi-menu-up </v-icon>
    </v-btn>
    <v-btn
      fab
      dark
      fixed
      bottom
      right
      color="black"
      small
      @click="$vuetify.goTo(9999)"
    >
      <v-icon> mdi-menu-down </v-icon>
    </v-btn>
    <v-footer padless>
      <v-card flat tile class="text-center flex">
        <v-divider></v-divider>
        <v-card-text class="grey--text pt-3">
          <dt>판매자정보</dt>
          <dd>
            로브아네 (lovane) (사업자 / 일반 사업자) - 대표자 : 김진현 <br />
            사업자등록번호 : 5310501959 <br />
            사업장소재지 : 충청북도 청주시 청원구 내수읍 국동길 115 (우 :
            28154)<br />
            문의 메일 : lovaneofficial@gmail.com<br />
            고객센터 : 010-2610-9255<br />
            통신판매업번호 : 2022-서울광진-1585
          </dd>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text class="grey--text"> <strong>Lovane</strong> </v-card-text>
      </v-card>
    </v-footer>
  </v-container>
</template>

<script>
export default {
  name: "Footer.vue",
};
</script>
