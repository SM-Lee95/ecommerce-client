<template>
  <v-container fluid>
    <v-toolbar flat>
      <v-row>
        <v-col cols="3">
          <v-select
            :items="CateList"
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
        <v-col cols="5">
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
    <v-data-table
      :headers="header"
      :items="ProductList"
      class="elevation-0 mt-2"
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
        <v-btn text @click="getDetailInfo(item.cd)">{{ item.name }}</v-btn>
      </template>
      <template v-slot:item.buyPri="{ item }">
        {{ item.buyPri.comma() + " 원" }}
      </template>
      <template v-slot:item.deliPri="{ item }">
        {{ item.deliPri.comma() + " 원" }}
      </template>
      <template v-slot:item.salesPri="{ item }">
        {{ item.salesPri.comma() + " 원" }}
      </template>
      <template v-slot:item.discountPri="{ item }">
        {{
          String(
            Number(item.salesPri) * ((100 - Number(item.discountRate)) / 100)
          ).comma() + " 원"
        }}
      </template>
      <template v-slot:item.discountRate="{ item }">
        {{ item.discountRate + " %" }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editDialog(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="modiDialog" width="1000" :retain-focus="false">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-card>
          <v-card-title class="text-h6"> 상품 정보 수정 </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <validation-provider
              v-slot="{ errors }"
              name="카테고리"
              rules="required"
            >
              <v-select
                :items="CateList"
                item-text="name"
                item-value="cd"
                label="카테고리"
                v-model="editObj.cateCd"
                :error-messages="errors"
              ></v-select>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="상품명"
              rules="required|max:50"
            >
              <v-text-field
                v-model="editObj.name"
                :counter="50"
                :error-messages="errors"
                label="상품명"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="공급사명"
              rules="required|max:50"
            >
              <v-text-field
                v-model="editObj.corpNm"
                :counter="50"
                :error-messages="errors"
                label="공급사명"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="매입가"
              rules="required|max:20|numeric"
            >
              <v-text-field
                v-model="editObj.buyPri"
                :counter="20"
                :error-messages="errors"
                label="매입가"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="매출가"
              rules="required|max:20|numeric"
            >
              <v-text-field
                v-model="editObj.salesPri"
                :counter="20"
                :error-messages="errors"
                label="매출가"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="배송비"
              rules="required|max:20|numeric"
            >
              <v-text-field
                v-model="editObj.deliPri"
                :counter="20"
                :error-messages="errors"
                label="배송비"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="할인율"
              rules="required|max:3|numeric"
            >
              <v-text-field
                v-model="editObj.discountRate"
                :counter="3"
                :error-messages="errors"
                label="할인율"
                required
              ></v-text-field>
            </validation-provider>
            <CKEditor4></CKEditor4>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="saveInfo" :disabled="invalid"> 수정 </v-btn>
          </v-card-actions>
        </v-card>
      </validation-observer>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import CKEditor4 from "./editor/CKEditor4";

export default {
  name: "SelectPrdPage",
  components: {
    CKEditor4,
  },
  data: () => ({
    header: [
      { value: "thumbnail", align: "center" },
      { text: "상품명", value: "prdNm", align: "start" },
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
    cateCd: 1,
    optionCd: "prdNm",
    searchValue: "",
    modiDialog: false,
    editObj: null,
    modiEditor: false,
  }),
  computed: {
    ...mapGetters("product", ["ProductList"]),
    ...mapGetters("common", ["CateList", "EditorHTML"]),
  },
  mounted() {},
  methods: {
    saveInfo() {
      this.$dialog
        .confirm({
          title: "상품 수정",
          text: "해당 품목을 수정하시겠습니까?",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          if (this.modiEditor) this.editObj.description = this.EditorHTML;
          this.$store
            .dispatch("product/updatePrdInfo", this.editObj)
            .then((resp) => {
              if (resp) this.$dialog.message.info("수정되었습니다.");
              else this.$dialog.message.error("수정에 실패하셨습니다.");
              this.modiDialog = false;
              this.searchList();
            });
        });
    },
    editDialog(item) {
      this.editObj = Object.assign({}, item);
      this.$store.commit("common/setEditorHTML", this.editObj.description);
      this.modiDialog = !this.modiDialog;
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
  },
  watch: {
    EditorHTML: function (val) {
      if (val == this.editObj.description) this.modiEditor = false;
      else this.modiEditor = true;
    },
  },
};
</script>

<style scoped>
</style>