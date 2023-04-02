<template>
  <v-container class="white">
    <v-row no-gutters>
      <v-col>
        <v-data-table
          :headers="header"
          :items="TransactionInfo"
          class="mt-3"
          hide-default-footer
          disable-sort
          calculate-widths
          :items-per-page="-1"
          no-data-text="배송 건이 존재하지 않습니다."
        >
          <template v-slot:item.parcelCd="{ item }"
            ><v-row no-gutters
              ><v-col class="text-caption">{{ getDeliName(item.parcelCd) }}</v-col></v-row
            >
          </template>
          <template v-slot:item.traCd="{ item }"
            ><v-row no-gutters
              ><v-col class="text-caption"
                ><v-btn
                  text
                  @click="getDeliInfo(item.transactionKey.traCd)"
                  small
                  >{{ item.transactionKey.traCd }}</v-btn
                ></v-col
              ></v-row
            >
          </template>
          <template v-slot:item.cnt="{ item }"
            ><v-row no-gutters
              ><v-col class="text-caption">{{ item.cnt + "개" }}</v-col></v-row
            >
          </template>
          <template v-slot:item.compDati="{ item }"
            ><v-row no-gutters
              ><v-col class="text-caption">{{ item.compDati }}</v-col></v-row
            >
          </template>
        </v-data-table></v-col
      >
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => ({
    header: [
      { text: "택배사", value: "parcelCd", align: "start", width: "150px" },
      { text: "운송번호", value: "traCd", align: "center" },
      { text: "상품갯수", value: "cnt", align: "start" },
      { text: "완료일자", value: "compDati", align: "start" },
    ],
  }),
  computed: {
    ...mapGetters("order", ["TransactionInfo"]),
    ...mapGetters("common", ["DeliList"]),
  },
  methods: {
    getDeliInfo(traCd) {
      this.$deliInfoPopup(traCd);
    },
    getDeliName(parcelCd) {
      return this.DeliList.filter((vo) => vo.commonKey.commCd == parcelCd)[0]
        .name;
    },
  },
};
</script>
