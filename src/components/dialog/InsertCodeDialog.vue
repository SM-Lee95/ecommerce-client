<template>
  <v-container fluid class="white">
    <v-row no-gutters>
      <v-col>
        <v-row class="mt-1">
          <v-col class="mt-1 ml-1 text-h6">공통 코드 등록({{ version }})</v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="ml-2 mr-2" v-if="version == 'size'">
            <v-row>
              <v-col cols="8" class="center">
                <v-text-field
                  v-model="name"
                  :counter="10"
                  label="사이즈명"
                  required
                ></v-text-field
              ></v-col>
              <v-col cols="3" class="center mt-4">
                <v-btn @click="pushSize" text>
                  등록
                  <v-icon color="gray darken-2">mdi-content-save-move</v-icon>
                </v-btn></v-col
              >
            </v-row>
            <v-row>
              <v-col>
                <v-data-table
                  :headers="sizeHeader"
                  :items="sizeList"
                  class="elevation-0 mt-2"
                  hide-default-footer
                  :items-per-page="-1"
                  no-data-text="등록해주세요."
                  v-model="selected"
                  show-select
                  item-key="name"
                >
                </v-data-table>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="ml-2 mr-2" v-if="version == 'color'">
            <v-row>
              <v-col cols="6">
                <img-color-picker
                  ref="colorPicker"
                  :width="400"
                  :showColor="true"
                  @setColor="setColor"
                  :imagesrc="imageBase"
                  v-if="imageBase != ''"
                >
                </img-color-picker>
              </v-col>
              <v-col cols="6" class="center">
                <v-file-input
                  accept="image/png, image/jpeg,"
                  placeholder="이미지 파일을 등록해주세요."
                  prepend-icon="mdi-image-area"
                  label="이미지 파일"
                  v-model="image"
                  value="image"
                  @change="baseEncoding"
                ></v-file-input>
                <v-data-table
                  :headers="header"
                  :items="colorList"
                  class="elevation-0 mt-2"
                  hide-default-footer
                  :items-per-page="-1"
                  no-data-text="등록해주세요."
                  v-model="selected"
                  show-select
                  item-key="extCode"
                >
                  <template v-slot:item.name="{ item }">
                    <v-text-field
                      v-model="item.name"
                      :counter="10"
                      label="색상명"
                      required
                    ></v-text-field>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="text-right">
            <v-btn @click="insertInfo" text>
              완료
              <v-icon color="gray darken-2">mdi-content-save-move</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import ImgColorPicker from "vue-img-color-picker";
export default {
  name: "InsertCodeDialog.vue",
  components: {
    ImgColorPicker,
  },
  props: {
    version: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    optionVal: null,
    image: null,
    imageBase: "",
    header: [
      { text: "헥사코드", value: "extCode", align: "center" },
      { text: "색상명", value: "name", align: "center" },
    ],
    sizeHeader: [{ text: "사이즈명", value: "name", align: "center" }],
    colorList: [],
    sizeList: [],
    selected: [],
    name: "",
  }),
  methods: {
    setColor(color) {
      this.$dialog
        .confirm({
          title: "공통 코드 등록",
          text: ` 선택하신 색상의 헥사코드는 ${color} 입니다. 해당 코드를 등록하시겠습니까?`,
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          this.colorList.push({
            extCode: color,
            name: "",
            commonKey: { cdFlag: 1 },
          });
        });
    },
    pushSize() {
      if (!this.name) {
        this.$dialog.message.error("사이즈 명을 입력 후에 시도해주세요.");
        return;
      }
      this.$dialog
        .confirm({
          title: "공통 코드 등록",
          text: ` 입력하신 사이즈명은 ${this.name} 입니다. 해당 코드를 등록하시겠습니까?`,
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          this.sizeList.push({ name: this.name, commonKey: { cdFlag: 2 } });
        });
    },
    baseEncoding(file) {
      this.imageBase = "";
      const reader = new FileReader();
      const fileData = (data) => {
        this.imageBase = data;
      };
      reader.addEventListener(
        "load",
        function () {
          fileData(reader.result);
        },
        false
      );
      reader.readAsDataURL(file);
    },
    insertInfo() {
      if (!this.selected.length) {
        this.$dialog.message.error(
          "등록을 원하시는 코드를 선택 후 진행해주세요."
        );
        return;
      }
      if (this.selected.filter((vo) => !vo.name).length) {
        this.$dialog.message.error(
          "코드명이 입력되지 않은 건이 존재합니다. 입력 후 진행해주세요."
        );
        return;
      }
      this.$dialog
        .confirm({
          title: "공통 코드 등록",
          text: "총 " + this.selected.length + "건 등록 하시겠습니까?",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          this.$store
            .dispatch("common/insertCommonCode", this.selected)
            .then((resp) => {
              if (resp) {
                this.$dialog.message.info("저장되었습니다.");
                this.$emit("close");
              } else this.$dialog.message.error("저장에 실패하셨습니다.");
            });
        });
    },
  },
};
</script>
