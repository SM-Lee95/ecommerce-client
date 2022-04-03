<template>
  <v-card
    class="mx-auto"
    width="100%"
    height="100%"
  >
    <v-container fluid>
      <v-row dense>
        <v-col
          v-for="product in Pagination.content"
          :key="product.cd"
          :cols="2"
        >
          <v-card>
            <v-img
              :src="product.thumbnail"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
              @click="getDetailInfo(product.cd)"
            >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon @click="like(product.cd)">
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </v-card-actions>
            </v-img>
            <v-card-title class="col-12 text-body-1 text-truncate" v-text="product.name" @click="getDetailInfo(product.cd)"></v-card-title>
           <v-card-text  class="col-12 text-body-2 text-truncate" v-text="product.description" @click="getDetailInfo(product.cd)"></v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "MainPage.vue",
  data(){
    return {
      products: [

      ],
    }
  },
  computed:{
    ...mapGetters(["Pagination"]),
  },
  methods:{
    getDetailInfo(cd){
      this.$store.dispatch("getDetailInfo",cd)
    },
    like(cd){
      this.$store.dispatch("putLike",cd)
    }
  }
}
</script>

<style scoped>

</style>