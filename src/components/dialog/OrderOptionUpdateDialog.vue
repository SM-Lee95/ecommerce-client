<template>
  <v-container fluid class="white">
    <v-row no-gutters>
      <v-col>
        <v-row class="mt-1">
          <v-col class="mt-1 ml-1 text-h6">주문 옵션 변경 신청</v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="ml-2 mr-2">
            <v-card-text>
              변경 가능한 옵션
              <v-chip-group
                v-model="optionVal"
                active-class="black accent-4 white--text"
              >
                <v-chip
                  v-for="vo in OrderUpdateOptionInfo"
                  :key="vo.productKey.listCd"
                >
                  {{ vo.size.name }}-{{ vo.color.name }}
                </v-chip>
              </v-chip-group>
            </v-card-text>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="text-right">
            <v-btn @click="updateInfo" text>
              신청
              <v-icon color="gray darken-2">mdi-content-save-move</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "OrderOptionUpdateDialog.vue",
  data: () => ({
    optionVal: null,
  }),
  computed: {
    ...mapGetters("order", ["OrderUpdateOptionInfo"]),
  },
  methods: {
    updateInfo() {
      if (!this.optionVal && this.optionVal != "0") {
        this.$dialog.message.error("옵션을 선택한 후에 진행해주세요.");
        return;
      }
      this.$dialog
        .confirm({
          title: "옵션 변경 요청",
          text:
            this.OrderUpdateOptionInfo[this.optionVal].size.name +
            "-" +
            this.OrderUpdateOptionInfo[this.optionVal].color.name +
            " 상태로 선택된 품목의 옵션 상태가 수정됩니다.",
          showClose: false,
        })
        .then((resp) => {
          if (!resp) return;
          let reqData = this.OrderUpdateOptionInfo[this.optionVal];
          this.$store
            .dispatch("order/updateOrdsProductOption", reqData)
            .then((resp) => {
              if (resp) {
                this.$dialog.message.info("수정되었습니다.");
                this.$store.dispatch(
                  "order/getOrderDetailInfo",
                  this.OrderUpdateOptionInfo[this.optionVal].ordsCd
                );
                this.$emit("close");
              } else this.$dialog.message.error("수정에 실패하셨습니다.");
            });
        });
    },
  },
};
</script>
