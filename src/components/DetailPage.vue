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
      <v-row>
          <v-col cols="9"></v-col>
          <v-col cols="3">
            <v-btn text @click="getList(DetailInfo.catalog.cd)" small>> {{DetailInfo.catalog.name}}</v-btn>
          </v-col>
      </v-row>
      <v-card
        elevation="1">
        <v-card-title>{{DetailInfo.name}}</v-card-title>
        <v-card-text>
          <div class="my-4 text-subtitle-1">
            {{DetailInfo.description}}
          </div>
          <div align="right">{{DetailInfo.depoPri}} 원</div>
          <div align="right">제조사 - {{DetailInfo.corpNm}}</div>
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
        <v-card-title>옵션 선택</v-card-title>
        <v-card-text>
          Option
          <v-chip-group
            v-model="option"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              v-for="(tag,i) in DetailInfo.detail"
              :key="i"
            >{{ tag.size.name }}-{{ tag.color.name }}</v-chip>
          </v-chip-group>
          <v-divider class="mx-4"></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-row>
          <v-col cols="9"></v-col>
          <v-col cols="2">
          <v-btn
            text
            color="deep-purple lighten-2"
            @click="addOption"
          >
            Add
          </v-btn>
          </v-col>
          </v-row>
        </v-card-actions>
        <v-divider class="mx-4"></v-divider>
        <v-card-text>
          <v-list-item
            v-for="(item, i) in selectOptions"
            :key="i">
            <v-list-item-title>
              <v-row>
                <v-col cols="4" align-self="center">
                  {{item.size+'-'+item.color}}
                </v-col>
                <v-col cols="2"></v-col>
                <v-col cols="3">
                  <v-select
                    v-model="item.cnt"
                    :items="items"
                  ></v-select>
                </v-col>
                <v-col cols="1" align-self="center">
                  <v-btn
                    x-small
                    text
                    @click="deleteOption(i)"
                  >
                    <v-icon>
                      mdi-close-outline
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </v-list-item-title>
          </v-list-item>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col cols="5"></v-col>
            <v-col cols="3">
              <v-btn
                text
                color="deep-purple lighten-2"
                @click="postOrder"
              >
                주문하기
              </v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn
                text
                color="deep-purple lighten-2"
                @click="postBasket"
              >
                장바구니
              </v-btn>
            </v-col>
          </v-row>
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
      option: null,
      cnt: 1,
      selectOptions: [],
      items: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
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
    },
    getList(param){
      this.$store.dispatch("getItemList",{param:param,page:0}).then(()=>{
        if(this.$route.path !="/")
          this.$router.push("/");
      });
    },
    addOption(){
      if(this.option==null) {
        alert("옵션을 선택 후 시도해주세요.");
        return;
      }
      var option = new Object();
      option.size = this.DetailInfo.detail[this.option].size.name;
      option.color = this.DetailInfo.detail[this.option].color.name;
      option.basketKey = this.DetailInfo.detail[this.option].productKey;
      option.cnt = 1;
      if(this.selectOptions.find(value =>
        value.basketKey == option.basketKey))
      {
        alert("선택된 옵션과 같은 추가된 옵션이 존재합니다.");
        return;
      }
      this.selectOptions.push(option);
    },
    postOrder(){
      if(this.selectOptions.length==0){
        alert("옵션을 추가하고 시도해주세요.");
        return;
      }
       this.$store.dispatch("postOrder",this.selectOptions).then(()=> {
         this.$router.go("/");
       })
    },
    postBasket(){
      if(this.selectOptions.length==0){
        alert("옵션을 추가하고 시도해주세요.");
        return;
      }
      this.$store.dispatch("postBasket",this.selectOptions).then((resp)=> {
        if(resp){
          this.$router.push("/Basket");
        }
      })
    },
    deleteOption(index){
      this.selectOptions.splice(index,1);
    }
  }
};
</script>

<style scoped>

</style>