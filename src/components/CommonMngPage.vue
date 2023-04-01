<template>
  <v-container fluid>
    <v-row>
      <v-col class="text-right">
        <v-btn text @click="insertColorCode"> 색상 코드 등록 </v-btn>
        <v-btn text @click="selectColorCode"> 색상 코드 조회 </v-btn>
        <v-btn text @click="insertSizeCode"> 사이즈 코드 등록 </v-btn>
        <v-btn text @click="selectSizeCode"> 사이즈 코드 조회 </v-btn>
      </v-col>
    </v-row>
    <v-divider inset></v-divider>
    <v-row>
      <v-col>
        <v-data-table
          :headers="header"
          :items="items"
          class="elevation-0 mt-2"
          hide-default-footer
          :items-per-page="-1"
          no-data-text="조회해주세요."
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
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="insertCodeDialog" width="1000px"
      ><insert-code-dialog
        :version="dialogVersion"
        v-on:close="close"
      ></insert-code-dialog
    ></v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import InsertCodeDialog from "./dialog/InsertCodeDialog.vue";
export default {
  name: "ProductMngPage",
  data: () => ({
    colorHeader: [
      { text: "색상명", value: "name", align: "center" },
      { text: "색상내부코드", value: "commCd", align: "center" },
      { text: "Hexa 코드", value: "extCode", align: "center" },
    ],
    sizeHeader: [
      { text: "사이즈명", value: "name", align: "center" },
      { text: "사이즈내부코드", value: "commCd", align: "center" },
      { text: "", value: "actions", align: "center" },
    ],
    items: [],
    header: [],
    insertCodeDialog: false,
    dialogVersion: "color",
  }),
  components: {
    InsertCodeDialog,
  },
  computed: {
    ...mapGetters("common", ["SizeList", "ColorList"]),
  },
  methods: {
    selectSizeCode() {
      this.$store
        .dispatch("common/selectCommonCode", {
          params: {
            cdFlag: 2,
          },
        })
        .then((resp) => {
          if (!resp) {
            this.$dialog.message.error("조회 중 오류가 발생했습니다.");
          } else {
            if (this.header != this.sizeHeader) {
              this.header = this.sizeHeader;
            }
            this.items = this.SizeList;
          }
        });
    },
    selectColorCode() {
      this.$store
        .dispatch("common/selectCommonCode", {
          params: {
            cdFlag: 1,
          },
        })
        .then((resp) => {
          if (!resp) {
            this.$dialog.message.error("조회 중 오류가 발생했습니다.");
          } else {
            if (this.header != this.colorHeader) {
              this.header = this.colorHeader;
            }
            this.items = this.ColorList;
          }
        });
    },
    insertSizeCode() {
      this.dialogVersion = "size";
      this.insertCodeDialog = true;
    },
    insertColorCode() {
      this.dialogVersion = "color";
      this.insertCodeDialog = true;
    },
    close() {
      this.insertCodeDialog = false;
    },
  },
};
</script>

<style scoped></style>
