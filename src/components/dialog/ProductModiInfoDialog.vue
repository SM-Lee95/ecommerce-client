<template>
  <v-container fluid white>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-card elevation="0">
        <v-card-title class="text-h6"> 상품 정보 수정 </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-row no-gutters>
            <v-col class="text-right">
              <v-btn text @click="openDetailOptionDialog"
                >상품 상세 관리</v-btn
              ></v-col
            >
          </v-row>
        </v-card-actions>
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
              v-model="EditProduct.cateCd"
              :error-messages="errors"
            ></v-select>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="상품명"
            rules="required|max:50"
          >
            <v-text-field
              v-model="EditProduct.name"
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
              v-model="EditProduct.corpNm"
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
              v-model="EditProduct.buyPri"
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
              v-model="EditProduct.salesPri"
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
              v-model="EditProduct.deliPri"
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
              v-model="EditProduct.discountRate"
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
    <v-dialog v-model="detailOptionDialog">
      <product-modi-detail-dialog on:close="close"></product-modi-detail-dialog>
    </v-dialog>
  </v-container>
</template>

<script>
import CKEditor4 from "../editor/CKEditor4";
import { mapGetters } from "vuex";
import ProductModiDetailDialog from "./ProductModiDetailDialog.vue";

export default {
  name: "ProductModiInfoDialog",
  components: {
    CKEditor4,
    ProductModiDetailDialog,
  },
  data: () => ({
    modiEditor: false,
    detailOptionDialog: false,
  }),
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
          if (this.modiEditor) this.EditProduct.description = this.EditorHTML;
          this.$store
            .dispatch("product/updatePrdInfo", this.EditProduct)
            .then((resp) => {
              if (resp) this.$dialog.message.info("수정되었습니다.");
              else this.$dialog.message.error("수정에 실패하셨습니다.");
              this.$emit("close", true);
            });
        });
    },
    openDetailOptionDialog() {
      this.$store
        .dispatch(
          "product/selectProductDetailInfoForUpdate",
          this.EditProduct.cd
        )
        .then((resp) => {
          if (resp) this.detailOptionDialog = !this.detailOptionDialog;
          else
            this.$dialog.message.error(
              "상품 상세 정보를 가져오는데 실패했습니다."
            );
        });
    },
  },
  computed: {
    ...mapGetters("product", ["EditProduct"]),
    ...mapGetters("common", ["EditorHTML", "CateList"]),
  },
  watch: {
    EditorHTML: function (val) {
      if (val == this.EditProduct.description) this.modiEditor = false;
      else this.modiEditor = true;
    },
  },
};
</script>

<style></style>
