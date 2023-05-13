<template>
  <v-container fluid>
    <v-toolbar flat>
      <v-row>
        <v-col cols="3">
          <v-select
            :items="MenuList"
            item-text="name"
            item-value="cd"
            v-model="cateCd"
            flat
            prepend-inner-icon="mdi-magnify"
            label="카테고리"
          ></v-select>
        </v-col>
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
        <v-col cols="2">
          <v-select
            :items="statFlagList"
            item-text="name"
            item-value="cd"
            v-model="statFlag"
            flat
            prepend-inner-icon="mdi-magnify"
            label="표기여부"
          ></v-select>
        </v-col>
        <v-col cols="3">
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
    <v-divider></v-divider>
    <v-row class="text-right mt-2">
      <v-col>
        <v-btn text @click="toggleStatFlag">표기 여부 변경</v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="header"
      :items="ProductList"
      class="elevation-0 mt-5"
      show-select
      hide-default-footer
      v-model="selected"
      item-key="cd"
      :items-per-page="-1"
      no-data-text="상품이 존재하지 않습니다."
    >
      <template v-slot:item.thumbnail="{ item }">
        <v-img
          :src="item.thumbnail"
          max-height="100%"
          min-height="100%"
          max-width="100"
        ></v-img>
      </template>
      <template v-slot:item.totStockCnt="{ item }">
        {{ item.totStockCnt + " 개" }}
      </template>
      <template v-slot:item.prdNm="{ item }">
        <v-row no-gutters>
          <v-col class="red--text text-caption" v-if="item.statFlag == '003'">
            *
          </v-col>
          <v-col>
            <v-btn small text @click="getDetailInfo(item.cd)">{{
              item.name
            }}</v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.buyPri="{ item }">
        <v-row no-gutters class="text-caption">
          <v-col>{{ item.buyPri.comma() + " 원" }}</v-col></v-row
        >
      </template>
      <template v-slot:item.deliPri="{ item }">
        <v-row no-gutters class="text-caption">
          <v-col> {{ item.deliPri.comma() + " 원" }}</v-col></v-row
        >
      </template>
      <template v-slot:item.salesPri="{ item }">
        <v-row no-gutters class="text-caption">
          <v-col>{{ item.salesPri.comma() + " 원" }}</v-col></v-row
        >
      </template>
      <template v-slot:item.discountPri="{ item }">
        <v-row no-gutters class="text-caption">
          <v-col>{{
            String(
              Number(item.salesPri) * ((100 - Number(item.discountRate)) / 100)
            ).comma() + " 원"
          }}</v-col></v-row
        >
      </template>
      <template v-slot:item.discountRate="{ item }">
        <v-row no-gutters class="text-caption">
          <v-col>{{ item.discountRate + " %" }}</v-col></v-row
        >
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editDialog(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-close </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="modiDialog" width="1000px" :retain-focus="false">
      <product-modi-info-dialog v-on:close="close"></product-modi-info-dialog>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import ProductModiInfoDialog from "./dialog/ProductModiInfoDialog.vue";

export default {
  name: "SelectPrdPage",
  components: {
    ProductModiInfoDialog,
  },
  data: () => ({
    header: [
      { value: "thumbnail", align: "center" },
      { text: "상품명( * 고객미표기)", value: "prdNm", align: "start" },
      { text: "공급사", value: "corpNm", align: "start" },
      { text: "매입금액", value: "buyPri", align: "start" },
      { text: "매출금액", value: "salesPri", align: "start" },
      { text: "할인율", value: "discountRate", align: "center" },
      { text: "할인금액", value: "discountPri", align: "start" },
      { text: "배송비", value: "deliPri", align: "start" },
      { text: "재고수량", value: "totStockCnt", align: "center" },
      { text: "수정/삭제", value: "actions", align: "start" },
    ],
    selected: [],
    OptionList: [
      { name: "품목명", cd: "prdNm" },
      { name: "공급사명", cd: "corpNm" },
    ],
    statFlagList: [
      { name: "전체", cd: "000" },
      { name: "표기", cd: "001" },
      { name: "미표기", cd: "003" },
    ],
    cateCd: 0,
    optionCd: "prdNm",
    searchValue: "",
    modiDialog: false,
    statFlag: "000",
  }),
  computed: {
    ...mapGetters("product", ["ProductList"]),
    ...mapGetters("common", ["MenuList"]),
  },
  mounted() {},
  methods: {
    editDialog(item) {
      this.$store.commit("product/setEditProduct", Object.assign({}, item));
      this.$store.commit("common/setEditorHTML", item.description);
      this.close();
    },
    deleteItem(obj) {
      this.$dialog
        .confirm({
          title: "상품 삭제",
          text: "해당 품목을 삭제하시겠습니까?",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          this.$store.dispatch("product/deletePrdInfo", obj.cd).then((resp) => {
            if (resp) {
              this.$dialog.message.info("삭제되었습니다.");
              this.$store.commit(
                "setProductList",
                this.ProductList.filter((value) => value != obj)
              );
            } else this.$dialog.message.error("삭제에 실패하셨습니다.");
          });
        });
    },
    searchList() {
      let reqData = {
        cateCd: this.cateCd,
        optionCd: this.optionCd,
        searchValue: this.searchValue,
        statFlag: this.statFlag,
      };
      this.$store.dispatch("product/selectPrdList", reqData).then((resp) => {
        if (!resp) this.$dialog.message.warning("조회 중 에러가 발생했습니다.");
      });
    },
    getDetailInfo(cd) {
      this.$store.dispatch("product/getDetailInfo", cd).then((resp) => {
        if (resp) {
          if (this.$route.path != "/Detail") this.$router.push("/Detail");
        } else
          this.$dialog.message.error(
            "상품 정보를 조회하는 중에 오류가 발생했습니다."
          );
      });
    },
    toggleStatFlag() {
      if (!this.selected.length) {
        this.$dialog.message.error("선택 후 진행해주세요.");
        return;
      }
      this.$dialog
        .confirm({
          title: "표기 여부 변경",
          text: ` 총 ${this.selected.length} 건의 고객 상품 표기 여부를 변경하시겠습니까?`,
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let paramList = this.selected.map((vo) => vo.cd);
          this.$store
            .dispatch("product/toggleStatFlag", paramList)
            .then((resp) => {
              if (resp) {
                this.$dialog.message.info("상품 표기 여부를 변경했습니다.");
                this.searchList();
              } else {
                this.$dialog.message.error(
                  "상품 표기 여부 변경에 실패했습니다."
                );
              }
            });
        });
    },
    close(search) {
      this.modiDialog = !this.modiDialog;
      if (search) this.searchList();
    },
  },
};
</script>

<style scoped></style>
