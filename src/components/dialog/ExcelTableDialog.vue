<template>
  <v-container fluid class="white">
    <v-row no-gutters>
      <v-col>
        <v-row class="mt-1">
          <v-col class="mt-1 ml-1 text-h6">
            <v-icon large>mdi-microsoft-excel</v-icon> 엑셀 데이터 등록</v-col
          >
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="ml-6 mt-6" cols="7">
            <v-file-input
              :rules="rules"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              placeholder="Excel 파일을 등록해주세요."
              prepend-icon="mdi-microsoft-excel"
              label="엑셀 파일"
              v-model="file"
            ></v-file-input>
          </v-col>
          <v-col class="ml-6 mt-8" cols="2">
            <v-btn outlined :href="exampleURL" download>
              예시 양식 다운로드
            </v-btn>
          </v-col>
          <v-col class="mt-8" cols="2">
            <v-btn @click="transInfoExcelToTable" text>
              변환
              <v-icon color="gray darken-2">mdi-transfer</v-icon>
            </v-btn>
            <v-btn @click="insertInfo" text>
              등록
              <v-icon color="gray darken-2">mdi-content-save-move</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              :headers="header"
              :items="productList"
              class="elevation-0 mt-2"
              hide-default-footer
              :items-per-page="-1"
              no-data-text="엑셀 파일을 변환해주세요."
            >
              <template v-slot:item.thumbnail="{ item }">
                <v-img
                  :src="item.thumbnail"
                  max-height="100%"
                  min-height="100%"
                  max-width="100"
                ></v-img>
              </template>
              <template v-slot:item.stockCnt="{ item }">
                {{ item.stockCnt + " 개" }}
              </template>
              <template v-slot:item.prdNm="{ item }">
                {{ item.prdNm }}
              </template>
              <template v-slot:item.salesPri="{ item }">
                {{ String(item.salesPri).comma() + " 원" }}
              </template>
              <template v-slot:item.deliPri="{ item }">
                {{ String(item.deliPri).comma() + " 원" }}
              </template>
              <template v-slot:item.discountRate="{ item }">
                {{ String(item.discountRate).comma() + "%" }}
              </template>
              <template v-slot:item.discountPri="{ item }">
                {{ String(item.discountPri).comma() + " 원" }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import * as XLSX from "xlsx";
import axios from "../../util/http-commons.js";

export default {
  name: "ExcelTableDialog.vue",
  data: () => ({
    header: [
      { text: "상품명", value: "name", align: "center" },
      { text: "재고수량", value: "stockCnt", align: "center" },
      { text: "판매가", value: "salesPri", align: "center" },
      { text: "할인가", value: "discountPri", align: "center" },
      { text: "할인율", value: "discountRate", align: "center" },
      { text: "기본배송비", value: "deliPri", align: "center" },
      { text: "소분류", value: "catalog", align: "center" },
      { text: "대표이미지", value: "thumbnail", align: "center" },
      { text: "", value: "actions", align: "center" },
    ],
    rules: [
      (value) =>
        !value ||
        value.size < 10000000 ||
        " 파일 사이즈는 10 MB 미만으로 제한합니다.",
    ],
    productList: [],
    file: null,
    exampleURL: axios.defaults.baseURL + "/util/Product_Example.xlsx",
  }),
  methods: {
    insertInfo() {
      this.$dialog
        .confirm({
          title: "상품 등록",
          text: "총 " + this.productList.length + "건을 등록하시겠습니까?",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          this.$store
            .dispatch("product/insertExcelProduct", this.productList)
            .then((resp) => {
              if (resp) this.$dialog.message.info("등록 되었습니다.");
              else this.$dialog.message.error("등록에 실패하셨습니다.");
            });
        });
    },
    deleteItem(item) {
      this.productList = this.productList.filter((vo) => vo != item);
    },
    transInfoExcelToTable() {
      if (!this.file) {
        this.$dialog.message.error("파일 입력 후 등록을 눌러주세요.");
        return;
      }
      const file = this.file;
      const reader = new FileReader();
      let tmpResult = {};
      reader.onload = (e) => {
        let data = e.target.result;
        data = new Uint8Array(data);
        let excelFile = XLSX.read(data, { type: "array" });
        excelFile.SheetNames.forEach(function (sheetName, index) {
          const roa = XLSX.utils.sheet_to_json(excelFile.Sheets[sheetName], {
            header: 0,
          });
          if (roa.length) tmpResult[index] = roa;
        });
        this.productList = tmpResult[0].map((vo) => {
          vo.discountRate = Math.round(
            ((vo.salesPri - vo.discountPri) / vo.salesPri) * 100
          );
          if (vo.name.length > 50) {
            vo.name = vo.name.substring(0, 49);
          }
          return vo;
        });
      };
      reader.readAsArrayBuffer(file);
    },
  },
};
</script>
