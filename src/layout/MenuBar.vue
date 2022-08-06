<template>
  <v-container
    height="100%">
  <v-container height="100">
    <v-row>
      <v-col cols="3"></v-col>
      <v-col cols="6">
        <v-slide-group multiple align-self="center">
          <v-slide-item
            v-for="catalog in Catalogs"
            :key="catalog.cd"
            v-slot="{ active }"
          >
            <v-btn
              @click="updateList(catalog.cd)"
              v-text="catalog.name"
              :input-value="active"
              text
            >
            </v-btn>
          </v-slide-item>
        </v-slide-group>
      </v-col>
      <v-col cols="3"></v-col>
    </v-row>
  </v-container>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    Catalogs: null,
  }),
  mounted() {
    this.$store.dispatch("getMenuList").then((resp)=>{
      if(resp)
        this.Catalogs = resp;
      else
        this.$dialog.message.error("메뉴 조회시 오류가 발생했습니다.");
    })
  },
  methods:{
    updateList(param){
      this.$store.dispatch("getItemList",{param:param,page:0}).then((resp)=>{
        if(resp){
          if(this.$route.path !="/")
            this.$router.push("/");
        }else
          this.$dialog.message.error("상품 목록 조회에 실패했습니다.");
      });
    },
  },
}
</script>