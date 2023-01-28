<template>
  <v-container fluid>
    <v-footer padless>
      <v-card flat tile class="grey text-center flex">
        <v-card-text class="white--text pt-0">
          <dt>판매자정보</dt>
          <dd>
            로브아네 (lovane) (사업자 / 일반 사업자) - 대표자 : 김진현 <br />
            사업자등록번호 : 5310501959 <br />
            사업장소재지 : 충청북도 청주시 청원구 내수읍 국동길 115 (우 :
            28154)<br />
            문의 메일 : lovaneofficial@gmail.com<br />
            고객센터 : 010-2610-9255
          </dd>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>Lovane</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-container>
</template>

<script>
export default {
  name: "Footer.vue",
};
</script>
