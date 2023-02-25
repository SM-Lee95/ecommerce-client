<template>
  <v-container fluid class="white">
    <v-row class="mt-1">
      <v-col class="mt-1 ml-1 text-h6">상품 옵션 추가</v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col class="text-right"
        ><v-btn text @click="insertSelectedOption">선택 옵션 추가</v-btn></v-col
      >
    </v-row>
    <v-divider></v-divider>
    <v-row
      ><v-col cols="6">
        <v-data-table
          :headers="color.header"
          :items="ColorList"
          class="elevation-0 mt-2"
          show-select
          single-select
          item-key="commonKey.commCd"
          v-model="color.selected"
          hide-default-footer
          :items-per-page="-1"
          no-data-text="컬러가 존재하지 않습니다."
        >
          <template v-slot:item.name="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:item.commCd="{ item }">
            {{ item.commonKey.commCd }}
          </template>
          <template v-slot:item.extCode="{ item }">
            {{ item.extCode }}
            <v-color-picker
              disabled
              hide-canvas
              hide-inputs
              hide-mode-switch
              mode="hexa"
              v-model="item.extCode"
            ></v-color-picker>
          </template> </v-data-table
      ></v-col>
      <v-col cols="6">
        <v-data-table
          :headers="size.header"
          :items="SizeList"
          class="elevation-0 mt-2"
          show-select
          hide-default-footer
          item-key="commonKey.commCd"
          v-model="size.selected"
          :items-per-page="-1"
          no-data-text="사이즈가 존재하지 않습니다."
        >
          <template v-slot:item.name="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:item.commCd="{ item }">
            {{ item.commonKey.commCd }}
          </template>
          <template v-slot:item.stockCnt="{ item }">
            <v-text-field v-model="item.stockCnt"></v-text-field>
          </template>
        </v-data-table> </v-col
    ></v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "InsertProductOptionDialog.vue",
  data: () => ({
    size: {
      header: [
        { text: "사이즈명", value: "name", align: "center" },
        { text: "사이즈내부코드", value: "commCd", align: "center" },
        { text: "재고량", value: "stockCnt", align: "center" },
      ],
      selected: [],
    },
    color: {
      header: [
        { text: "색상명", value: "name", align: "center" },
        { text: "색상내부코드", value: "commCd", align: "center" },
        { text: "Hexa 코드", value: "extCode", align: "center" },
      ],
      selected: [],
    },
    selected: [],
  }),
  computed: {
    ...mapGetters("product", ["EditProductDetail"]),
    ...mapGetters("common", ["SizeList", "ColorList"]),
  },
  methods: {
    insertSelectedOption() {
      if (!this.size.selected.length || !this.color.selected.length) {
        this.$dialog.message.error(
          "컬러와 사이즈 모두 선택한 후 진행해주세요."
        );
        return;
      }
      if (
        this.size.selected.filter(
          (vo) => !vo.stockCnt || vo.stockCnt == 0 || isNaN(vo.stockCnt)
        ).length
      ) {
        this.$dialog.message.error(
          "선택한 사이즈의 재고량을 숫자로 기입 후 진행해주세요."
        );
        return;
      }
      let dupList = this.EditProductDetail.filter((vo) => {
        if (
          this.color.selected[0].commonKey.commCd == vo.color.commonKey.commCd
        ) {
          if (
            this.size.selected.filter((innerVo) => {
              return innerVo.commonKey.commCd == vo.size.commonKey.commCd;
            }).length
          )
            return true;
          return false;
        }
        return false;
      });
      if (dupList.length) {
        let msg = "";
        dupList.forEach((vo) => {
          msg += vo.size.name + " - " + vo.color.name + "<br>";
        });
        this.$dialog.message.error(
          "하기 이미 존재하는 조합이 포함되어 있습니다. 제외한 후 시도해주세요.<br>" +
            msg
        );
        return;
      }
      this.$dialog
        .confirm({
          title: "상품 옵션 추가",
          text: "선택한 조합으로 상품 옵션을 추가하시겠습니까?",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let body = new Object();
          body.colorList = this.color.selected;
          body.sizeList = this.size.selected;
          body.prdCd = this.EditProductDetail[0].productKey.prdCd;
          this.$store
            .dispatch("product/insertProductOption", body)
            .then((resp) => {
              if (resp) {
                this.$dialog.message.info("옵션 추가를 완료했습니다.");
                this.$emit("close", true);
              } else {
                this.$dialog.message.info("옵션 추가에 실패 했습니다.");
              }
            });
        });
    },
  },
};
</script>

<style></style>
