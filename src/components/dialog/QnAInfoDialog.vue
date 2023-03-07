<template>
  <v-container fluid> </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("product", ["QnaDetailInfo"]),
  },
};
</script>

<style></style>
