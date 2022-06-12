<template>
<v-container>
  <v-row >
    <v-col cols="6">
      <v-card
        elevation="1"
        max-width="444"
        class="mx-auto"
      >
        <v-sheet
          height="100%"
          tile
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <v-img
              :src="DetailInfo.thumbnail"
            >
            </v-img>
          </v-row>
        </v-sheet>
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card
        elevation="1">
        <v-card-title>{{DetailInfo.name}}</v-card-title>
        <v-card-text>
          <div class="my-4 text-subtitle-1">
            {{DetailInfo.description}}
          </div>
          <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-title>Tonight's availability</v-card-title>

        <v-card-text>
          <v-chip-group
            v-model="size"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip>5:30PM</v-chip>

            <v-chip>7:30PM</v-chip>

            <v-chip>8:00PM</v-chip>

            <v-chip>9:00PM</v-chip>
          </v-chip-group>
          <v-chip-group
            v-model="color"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip>5:30PM</v-chip>

            <v-chip>7:30PM</v-chip>

            <v-chip>8:00PM</v-chip>

            <v-chip>9:00PM</v-chip>
          </v-chip-group>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="deep-purple lighten-2"
            text
            @click="reserve"
          >
            Reserve
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
    <v-toolbar>
      <v-tabs
        dark
        background-color="grey"
        grow
      >
        <v-tab>
          <v-badge
            color="pink"
            dot
          >
            Item One
          </v-badge>
        </v-tab>

        <v-tab>
          <v-badge
            color="green"
            content="6"
          >
            Item Two
          </v-badge>
        </v-tab>

        <v-tab>
          <v-badge
            color="deep-purple accent-4"
            icon="mdi-vuetify"
          >
            Item Three
          </v-badge>
        </v-tab>
      </v-tabs>
    </v-toolbar>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "DetailPage.vue",
  components:{
  },
  data(){
    return {

    }
  },
  computed:{
    ...mapGetters(["DetailInfo"]),
  },
  methods:{
    like(index,cd,love){
      if(this.$store.getters.getUserInfo==null){
        alert("로그인후에 시도해주세요.");
        return;
      }
      this.$store.dispatch("putLike",cd).then(()=> {
        this.$store.state.Pagination.content[index].love = !love;
      })
    }
  }
};
</script>

<style scoped>

</style>