<template>
  <v-container fluid>
    <v-row>
      <v-col class="text-right">
        <v-btn text @click="goProductMng">
          상품 관리
        </v-btn>
        <v-btn text @click="goOrderMng">
          주문 관리
        </v-btn>
        <v-btn text @click="goUserMng">
          회원 관리
        </v-btn>
        <v-btn text @click="goPayMng">
          정산 관리
        </v-btn>
      </v-col>
    </v-row>
    <v-divider inset></v-divider>
    <v-row>
      <v-col>
        <router-view></router-view>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AdminPage.vue",
  methods: {
    goProductMng(){
       if(this.$route.path !="/Admin/ProductMng/SelectPrd")
         this.$router.push("/Admin/ProductMng/SelectPrd");
    },
    goOrderMng(){
      if(this.$route.path !="/Admin/OrderMng")
        this.$router.push("/Admin/OrderMng");
    },
    goUserMng(){
      if(this.$route.path !="/Admin/UserMng")
        this.$router.push("/Admin/UserMng");
    },
    goPayMng(){
      if(this.$route.path !="/Admin/PayMng")
        this.$router.push("/Admin/PayMng");
    }
  }
};
</script>

<style scoped>

</style>