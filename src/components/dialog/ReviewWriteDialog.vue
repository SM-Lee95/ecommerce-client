<template>
  <v-container class="white">
    <v-row class="mt-1 mb-1">
      <v-col class="ml-1 text-h6">상품 리뷰 작성</v-col>
      <v-col class="text-right mr-1">
        <v-btn text @click="insertReviewInfo"> 저장하기 </v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="mt-5"
      ><v-col>
        <v-simple-table dense>
          <template v-slot:default>
            <colgroup>
              <col width="30%" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <td rowspan="2">
                  <v-img
                    :src="ReviewWriteItemInfo.thumbnail"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    aspect-ratio="0.75"
                    contain
                  ></v-img>
                </td>
              </tr>
              <tr>
                <td class="text-caption" colspan="1">
                  {{ ReviewWriteItemInfo.name }}<br />
                  {{
                    ReviewWriteItemInfo.color + " - " + ReviewWriteItemInfo.size
                  }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col></v-row
    >
    <v-row class="pa-3 mt-1">
      <v-col cols="6">
        <validation-provider
          v-slot="{ errors }"
          rules="required|fileSize"
          name="사진"
          ><v-file-input
            @change="imgPreview"
            :error-messages="errors"
            accept="image/png, image/jpeg,"
            placeholder="상품 사진을 넣어주세요"
            prepend-icon="mdi-camera"
            v-model="reviewImg"
            dense
          ></v-file-input>
        </validation-provider>
      </v-col>
      <v-col cols="6">
        <v-img
          v-if="previewImg != null"
          :src="previewImg"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          aspect-ratio="0.75"
          contain
          max-height="200px"
        ></v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-textarea
          outlined
          v-model="description"
          label="Review 작성"
          rows="10"
          auto-grow
          rounded
          counter
        ></v-textarea>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      description: "",
      previewImg: null,
      reviewImg: null,
    };
  },
  computed: {
    ...mapGetters("order", ["ReviewWriteItemInfo"]),
  },
  methods: {
    insertReviewInfo() {
      if (!this.description || this.description.length < 20) {
        this.$dialog.message.warning("후기는 20자 이상으로 작성해주세요.");
        return;
      }
      if (!this.reviewImg) {
        this.$dialog.message.warning("리뷰 사진을 등록하고 진행해주세요.");
        return;
      }
      this.$dialog
        .confirm({
          title: "리뷰 작성",
          text: "리뷰를 작성하시겠습니까?",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let formData = new FormData();
          let reviewObj = new Object();
          formData.append("reviewImg", this.reviewImg);
          reviewObj.description = this.description;
          reviewObj.ordsCd = this.ReviewWriteItemInfo.ordsCd;
          reviewObj.listCd = this.ReviewWriteItemInfo.listCd;
          formData.append(
            "reviewVO",
            new Blob([JSON.stringify(reviewObj)], { type: "application/json" })
          );
          this.$store
            .dispatch("order/insertReviewInfo", formData)
            .then((resp) => {
              if (resp) {
                this.$dialog.message.info("리뷰 작성이 완료되었습니다.");
                this.$store.dispatch(
                  "order/getOrderDetailInfo",
                  this.ReviewWriteItemInfo.ordsCd
                );
                this.$emit("close");
              } else {
                this.$dialog.message.error("리뷰 작성에 실패하였습니다.");
              }
            });
        });
    },
    imgPreview() {
      if (this.reviewImg != null)
        this.previewImg = URL.createObjectURL(this.reviewImg);
    },
  },
};
</script>

<style></style>
