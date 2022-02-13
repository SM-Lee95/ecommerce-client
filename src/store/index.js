import Vue from "vue";
import Vuex from "vuex";
import http from "../util/http-commons";

Vue.use(Vuex);

export default new Vuex.Store({
  //상태값
  state: {
    Title: 'PlumGreenTea',
    userId: '',
    token: '',
  },
  //
  getters:{
    Title(state){
      return state.Title;
    },
    getToken(state){
      return state.token;
    }
  },
  mutations:{
    setUserId(state, payload){
      state.userId = payload;
    },
    setToken(state, payload){
      state.token = payload;
      console.log(payload);
      localStorage.setItem("user", JSON.stringify(payload));
      if(payload != ""){
      http.defaults.headers.common[
        "authorization"
        ] = 'Bearer '+payload;
      }else{
        http.defaults.headers.common[
          "authorization"
          ] = "";
      }
    },
  },
  actions:{
    login(context , data){
      console.log(data);
      return http.post("/login",data).then((resp) =>{
        JSON.stringify(resp);
        console.log(resp.headers.authorization+"<<<<");
        context.commit("setUserId", data.username);//유저 아이디를 저장해준다
        context.commit("setToken",resp.headers.authorization);// 토큰을 적용해준다
      }).catch((resp) =>{
        alert("login 실패"+ resp);
      });
    }
  },
  modules:{

  }
  // ...
});
