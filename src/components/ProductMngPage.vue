<template>
  <v-container fluid>
    <v-row>
      <v-col class="text-right">
        <v-btn text @click="goCreatePrdPage"> 상품 등록 </v-btn>
        <v-btn text @click="openExcelDialog"> 상품 엑셀 등록 </v-btn>
        <v-btn text @click="goSelectPrdPage"> 상품 조회 </v-btn>
      </v-col>
    </v-row>
    <v-divider inset></v-divider>
    <v-row class="mt-3">
      <v-col>
        <router-view></router-view>
      </v-col>
    </v-row>
    <v-dialog v-model="excelTableDialog"
      ><excel-table-dialog></excel-table-dialog
    ></v-dialog>
  </v-container>
</template>

<script>
import ExcelTableDialog from "./dialog/ExcelTableDialog.vue";
export default {
  name: "ProductMngPage",
  data: () => ({
    excelTableDialog: false,
  }),
  components: {
    ExcelTableDialog,
  },
  methods: {
    goSelectPrdPage() {
      if (this.$route.path != "/Admin/ProductMng/SelectPrd")
        this.$router.push("/Admin/ProductMng/SelectPrd");
    },
    goCreatePrdPage() {
      if (this.$route.path != "/Admin/ProductMng/CreatePrd")
        this.$router.push("/Admin/ProductMng/CreatePrd");
    },
    openExcelDialog() {
      this.excelTableDialog = true;
    },
  },
};
</script>

<style scoped></style>
