import Vue from "vue";
import Vuex from "vuex";
import http from "../util/http-commons";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()]
  ,
  //상태값
  state: {
    Title: 'PlumGreenTea',
    token: '',
    userInfo: {
      id: '',
      name: '',
      postcode: '',
      main_address: '',
      etc_address: '',
      phone: '',
      email: '',
      sms_yn: '',
      email_yn: '',
      auth: ''
    }
  },
  //
  getters:{
    Title(state){
      return state.Title;
    },
    getToken(state){
      return state.token;
    },
    getUserInfo(state){
      return state.userInfo;
    }
  },
  mutations:{
    setToken(state, payload){
      state.token = payload;
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
    setUserInfo(state, payload){
        state.userInfo.id=payload.id;
        state.userInfo.name=payload.name
        state.userInfo.postcode=payload.postcode;
        state.userInfo.main_address=payload.main_address;
        state.userInfo.etc_address=payload.etc_address;
        state.userInfo.phone=payload.phone;
        state.userInfo.email=payload.email;
        state.userInfo.sms_yn=payload.sms_yn;
        state.userInfo.email_yn=payload.email_yn;
        state.userInfo.auth=payload.auth;
    }
  },
  actions:{
    login(context , data){
      return http.post("/login",data).then((resp) =>{
        if(!resp.headers.authorization){
          alert("입력하신 로그인 정보가 일치하지 않습니다.")
          return false;
        }
        JSON.stringify(resp);
        context.commit("setToken",resp.headers.authorization);// 토큰을 적용해준다
        context.dispatch("getUserInfo",data.id).then(()=>{
          return true;
        });
      }).catch((resp) =>{
        alert("알수없는 이유로 오류 발생"+ resp);
      });
    },
    signUp(context , data){
      return http.post("/user/signUp",data).then((resp) =>{
        if(resp.data.statusCode =="200" )alert("회원가입에 성공하셨습니다.");
        if(resp.data.statusCode =="400" )alert("회원가입에 실패하셨습니다. 다시 시도해주세요.");
        return resp.data.statusCode;
      }).catch((resp) =>{
        alert("회원가입 실패"+ resp);
      });
    },
    existId(context , data){
      return http.post("/user/existId/"+data).then((resp) =>{
        return resp;
      }).catch((resp) =>{
        alert("잘못된 접근입니다. "+ resp);
      });
    },
    getUserInfo(context, data){
      return http.get("/user/info/"+data).then((resp)=>{
        context.commit("setUserInfo",resp.data);
      }).catch((resp)=>{
        alert("잘못된 접근입니다. "+ resp);
      })
    }
  },
  modules:{

  }
  // ...
});
