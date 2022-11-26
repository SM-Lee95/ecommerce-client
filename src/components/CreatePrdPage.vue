<template>
  <v-container fluid>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-row>
        <v-col class="text-left text-h5"> 상품 등록 </v-col>
      </v-row>
      <v-row>
        <v-col>
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
              v-model="cateCd"
              :error-messages="errors"
            ></v-select>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="상품명"
            rules="required|max:50"
          >
            <v-text-field
              v-model="name"
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
              v-model="corpNm"
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
              v-model="buyPri"
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
              v-model="salesPri"
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
              v-model="deliPri"
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
              v-model="discountRate"
              :counter="3"
              :error-messages="errors"
              label="할인율"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="재고량"
            rules="required|numeric"
          >
            <v-text-field
              v-model="stockCnt"
              :error-messages="errors"
              label="재고량"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="색상" rules="required">
            <v-select
              :items="ColorList"
              item-text="name"
              item-value="commonKey.commCd"
              v-model="colorCdList"
              label="색상"
              chips
              multiple
              :error-messages="errors"
            ></v-select>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="사이즈"
            rules="required"
          >
            <v-select
              :items="SizeList"
              item-text="name"
              item-value="commonKey.commCd"
              v-model="sizeCdList"
              chips
              multiple
              label="사이즈"
              :error-messages="errors"
            ></v-select>
          </validation-provider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <validation-provider
            v-slot="{ errors }"
            rules="required|fileSize"
            name="상품 대표 사진"
          >
            <v-file-input
              @change="imgPreview"
              label="상품 대표 사진"
              show-size
              :error-messages="errors"
              accept="image/png, image/jpeg,"
              placeholder="상품 대표 사진을 넣어주세요"
              filled
              prepend-icon="mdi-camera"
              v-model="thumbnailImg"
            ></v-file-input>
          </validation-provider>
        </v-col>
        <v-col cols="6">
          <v-img :src="previewImg"></v-img>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <CKEditor4></CKEditor4>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn :disabled="invalid || modiEditor" @click="insertPrd">
            등록
          </v-btn>
          <v-btn @click="clear(invalid)"> 초기화 </v-btn>
        </v-col>
      </v-row>
    </validation-observer>
  </v-container>
</template>

<script>
import CKEditor4 from "./CKEditor4";
import { mapGetters } from "vuex";
export default {
  name: "CreatePrdPage",
  components: {
    CKEditor4,
  },
  data: () => ({
    name: "",
    corpNm: "",
    buyPri: "",
    salesPri: "",
    deliPri: "2500",
    discountRate: "0",
    stockCnt: "1",
    thumbnailImg: null,
    previewImg: null,
    cateCd: null,
    colorCdList: null,
    sizeCdList: null,
    modiEditor: true,
  }),
  methods: {
    insertPrd() {
      if (this.cateCd == 1) {
        this.$dialog.message.warning("카테고리를 전체로 선택할 수 없습니다.");
        return;
      }
      let formData = new FormData();
      let prdObj = new Object();
      prdObj.name = this.name;
      prdObj.corpNm = this.corpNm;
      prdObj.buyPri = this.buyPri;
      prdObj.salesPri = this.salesPri;
      prdObj.deliPri = this.deliPri;
      prdObj.discountRate = this.discountRate;
      prdObj.stockCnt = this.stockCnt;
      prdObj.cateCd = this.cateCd;
      prdObj.colorCdList = this.colorCdList;
      prdObj.sizeCdList = this.sizeCdList;
      prdObj.description = this.EditorHTML;
      formData.append("thumbnailImg", this.thumbnailImg);
      formData.append(
        "prdRegiInfo",
        new Blob([JSON.stringify(prdObj)], { type: "application/json" })
      );
      this.$store.dispatch("insertPrdInfo", formData).then((resp) => {
        if (resp) {
          this.$dialog.message.success("상품 등록에 성공하셨습니다.");
          this.clear();
        } else {
          this.$dialog.message.error(
            "상품 등록에 실패하셨습니다. 다시 시도해주세요."
          );
        }
      });
    },
    clear(invalid) {
      if (invalid) {
        console.log(invalid);
        return;
      } else {
        console.log(invalid);
        if (!invalid) return;
      }
      this.name = "";
      this.corpNm = "";
      this.buyPri = "";
      this.salesPri = "";
      this.deliPri = "2500";
      this.discountRate = "0";
      this.stockCnt = "1";
      this.thumbnailImg = null;
      this.previewImg = null;
      this.cateCd = null;
      this.colorCdList = null;
      this.sizeCdList = null;
      this.$store.commit("setEditorHTML", "");
    },
    imgPreview() {
      if (this.thumbnailImg != null)
        this.previewImg = URL.createObjectURL(this.thumbnailImg);
    },
  },
  computed: {
    ...mapGetters(["EditorHTML", "SizeList", "ColorList", "CateList"]),
  },
  mounted() {
    this.$store.commit("setEditorHTML", "");
  },
  watch: {
    EditorHTML: function (val) {
      if (val) this.modiEditor = false;
      else this.modiEditor = true;
    },
  },
};
</script>

<style scoped>
</style>