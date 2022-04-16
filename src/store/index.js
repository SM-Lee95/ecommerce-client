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
    userInfo: null,
    Key: {
      MyPageKey: 0,
      MainPageKey: 0,
      JoinFormKey: 0,
    },
    Pagination: null,
    selectMenuCd: 1, //처음 All
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
    },
    getKey(state){
      return state.Key;
    },
    Pagination(state){
      return state.Pagination;
    },
    selectMenuCd(state){
      return state.setSelectMenuCd;
    },
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
      state.userInfo = payload;
    },
    setKey(state, payload){
      if(payload == "MyPage")
        state.Key.MyPageKey += 1;
      if(payload == "MainPage")
        state.Key.MainPageKey += 1;
      if(payload == "JoinForm")
        state.Key.JoinFormKey += 1;
    },
    setPagination(state, payload){
      state.Pagination = payload;
      state.Pagination.number += 1;
    },
    setSelectMenuCd(state, payload){
      state.selectMenuCd = payload;
    },
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
        return context.dispatch("getUserInfo",data.id).then(()=>{
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
        console.log(resp.data);
        context.commit("setUserInfo",resp.data);
      }).catch((resp)=>{
        alert("잘못된 접근입니다. "+ resp);
      })
    },
    updateInfo(context, data){
      return http.post("/user/info/"+context.state.userInfo.cd,data).then((resp)=>{
        if(resp.data.statusCode =="200" )alert("정보 변경에 성공하셨습니다.");
        if(resp.data.statusCode =="400" )alert("정보 변경에 실패하셨습니다. 다시 시도해주세요.");
        return resp.data.statusCode;
      }).catch((resp)=>{
        alert("잘못된 접근입니다. " + resp);
      })
    },
    updatePass(context, data){
      return http.put("/user/pass",data).then((resp)=>{
        if(resp.data.statusCode =="200" )alert("비밀번호 변경에 성공하셨습니다.");
        if(resp.data.statusCode =="400" )alert("비밀번호 변경에 실패하셨습니다. 기존 비밀번호를 확인해주세요.");
        return resp.data.statusCode;
      }).catch((resp)=>{
        alert("잘못된 접근입니다. " + resp);
      })
    },
    getMenuList(){
      return http.get("/cate/list").then((resp)=>{
        return resp.data;
      })
    },
    getItemList(context, data){
      // page -> 요청 페이지 번호
      // param -> 메뉴 코드
      if(data.param)
        context.commit("setSelectMenuCd",data.param);
      return http.get("/prd/list/"+context.state.selectMenuCd+"?page="+data.page+"&size=18").then((resp)=>{
        console.log(resp.data);
        context.commit("setPagination",resp.data);
      }).catch((resp)=>{
        alert("잘못된 접근입니다. "+ resp);
      })
    },
    getDetailInfo(context, data){
      return http.get("/prd/detail/"+data).then((resp)=>{
        context.commit("setPagination",resp.data);
      }).catch((resp)=>{
        alert("잘못된 접근입니다. "+ resp);
      })
    },
    putLike(context, data){
      return http.get("/prd/like/"+data.param,data).then((resp)=>{
        context.commit("setPagination",resp.data);
      }).catch((resp)=>{
        alert("잘못된 접근입니다. "+ resp);
      })
    }
  },
  modules:{

  }
});
