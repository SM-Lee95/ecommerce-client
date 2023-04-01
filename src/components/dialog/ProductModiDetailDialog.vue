<template>
  <v-container fluid class="white">
    <v-row no-gutters>
      <v-col>
        <v-row class="mt-1">
          <v-col class="mt-1 ml-1 text-h6">상품 상세 관리</v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row
          ><v-col class="text-right">
            <v-btn text @click="openInsertOptionDialog">옵션 추가</v-btn>
            <v-btn text @click="updateAllStatFlag">표기 여부 변경</v-btn>
            <v-btn text @click="updateAllStockCnt">재고 수량 변경</v-btn>
          </v-col>
        </v-row>
        <v-dialog v-model="insertOptionDialog" width="1200px">
          <insert-product-option-dialog
            v-on:close="openInsertOptionDialog"
          ></insert-product-option-dialog>
        </v-dialog>
        <v-divider></v-divider>
        <v-row>
          <v-col class="ml-2 mr-2">
            <v-data-table
              :headers="header"
              :items="EditProductDetail"
              class="elevation-0 mt-2"
              show-select
              hide-default-footer
              v-model="selected"
              item-key="productKey.listCd"
              :items-per-page="-1"
              no-data-text="상세 옵션이 존재하지 않습니다."
            >
              <template v-slot:item.listCd="{ item }">
                {{ item.productKey.listCd }}
              </template>
              <template v-slot:item.color="{ item }">
                {{ item.color.name }}
              </template>
              <template v-slot:item.size="{ item }">
                {{ item.size.name }}
              </template>
              <template v-slot:item.stockCnt="{ item }">
                <v-text-field
                  v-model="item.stockCnt"
                  label="재고량"
                  required
                ></v-text-field>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon class="ml-6 mr-6" @click="updateStockCnt(item)">
                  mdi-content-save-edit
                </v-icon>
                <v-icon
                  @click="updateStatFlag(item)"
                  v-text="item.statFlag == '001'? 'mdi-table-large-remove': 'mdi-table-large-plus'"
                >
                </v-icon>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
import InsertProductOptionDialog from "./InsertProductOptionDialog.vue";
export default {
  name: "ProductModiDetailDialog.vue",
  components: {
    InsertProductOptionDialog,
  },
  data: () => ({
    header: [
      { text: "순차", value: "listCd", align: "start" },
      { text: "색상", value: "color", align: "start" },
      { text: "사이즈", value: "size", align: "center" },
      { text: "재고", value: "stockCnt", align: "center" },
      { text: "재고수량/표기 변경", value: "actions", align: "start" },
    ],
    selected: [],
    insertOptionDialog: false,
  }),
  computed: {
    ...mapGetters("product", ["EditProductDetail"]),
    ...mapGetters("common", ["SizeList", "ColorList"]),
  },
  methods: {
    updateStatFlag(vo) {
      let body = new Array();
      body.push(vo.productKey);
      this.$dialog
        .confirm({
          title: "표기 변경 요청",
          text:
            vo.statFlag == "003"
              ? "해당 옵션이 고객 옵션에 표기<b>됩니다.</b>"
              : "해당 옵션이 고객 옵션에 표기되지 <b>않습니다.</b>",
          showClose: false,
        })
        .then((resp) => {
          if (resp) {
            this.$store
              .dispatch("product/updateProductDetailStatFlag", body)
              .then((resp) => {
                if (resp) {
                  this.$dialog.message.info("표기 여부가 변경되었습니다.");
                  this.refreshList(vo.productKey.prdCd);
                } else {
                  this.$dialog.message.error("표기 여부 변경에 실패했습니다.");
                }
              });
          }
        });
    },
    updateAllStatFlag() {
      if (!this.selected.length) {
        this.$dialog.message.error("옵션 선택 후에 진행해주세요.");
        return;
      }
      let body = this.selected.map((vo) => vo.productKey);
      this.$dialog
        .confirm({
          title: "표기 변경 요청",
          text: this.selected.length + "건의 옵션이 표기 변경됩니다.",
          showClose: false,
        })
        .then((resp) => {
          if (resp) {
            this.$store
              .dispatch("product/updateProductDetailStatFlag", body)
              .then((resp) => {
                if (resp) {
                  this.$dialog.message.info("표기 여부가 변경되었습니다.");
                  this.refreshList(this.EditProductDetail[0].productKey.prdCd);
                } else {
                  this.$dialog.message.error("표기 여부 변경에 실패했습니다.");
                }
              });
          }
        });
    },
    updateAllStockCnt() {
      if (!this.selected.length) {
        this.$dialog.message.error("옵션 선택 후에 진행해주세요.");
        return;
      }
      if (
        this.selected.filter((vo) => vo.stockCnt == "" || isNaN(vo.stockCnt))
          .length
      ) {
        this.$dialog.message.error("올바른 수량을 적어주세요.");
        return;
      }
      let body = this.selected.map((vo) => {
        let obj = new Object();
        obj.productKey = vo.productKey;
        obj.stockCnt = vo.stockCnt;
        return obj;
      });
      this.$dialog
        .confirm({
          title: "표기 변경 요청",
          text: this.selected.length + "건의 수량이 표기 변경됩니다.",
          showClose: false,
        })
        .then((resp) => {
          if (resp) {
            this.$store
              .dispatch("product/updateProductDetailStockCnt", body)
              .then((resp) => {
                if (resp) {
                  this.$dialog.message.info("표기 여부가 변경되었습니다.");
                  this.refreshList(this.EditProductDetail[0].productKey.prdCd);
                } else {
                  this.$dialog.message.error("표기 여부 변경에 실패했습니다.");
                }
              });
          }
        });
    },
    openInsertOptionDialog(searchFlag) {
      this.insertOptionDialog = !this.insertOptionDialog;
      if (searchFlag)
        this.refreshList(this.EditProductDetail[0].productKey.prdCd);
    },
    refreshList(prdCd) {
      this.$store.dispatch("product/selectProductDetailInfoForUpdate", prdCd);
    },
    updateStockCnt(vo) {
      if (vo.stockCnt == "" || isNaN(vo.stockCnt)) {
        this.$dialog.message.error("올바른 수량을 적어주세요.");
        return;
      }
      let list = new Array();
      let body = new Object();
      body.stockCnt = vo.stockCnt;
      body.productKey = vo.productKey;
      list.push(body);
      this.$dialog
        .confirm({
          title: "재고량 변경 요청",
          text: "재고 수량이 " + vo.stockCnt + "개로 변경됩니다.",
          showClose: false,
        })
        .then((resp) => {
          if (resp) {
            this.$store
              .dispatch("product/updateProductDetailStockCnt", list)
              .then((resp) => {
                if (resp) {
                  this.$dialog.message.info("재고 수량이 변경되었습니다.");
                  this.refreshList(this.EditProductDetail[0].productKey.prdCd);
                } else {
                  this.$dialog.message.error("재고 수량 변경에 실패했습니다.");
                }
              });
          }
        });
    },
  },
};
</script>
