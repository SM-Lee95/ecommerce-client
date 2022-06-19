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
    Pagination: null, //Item List
    selectMenuCd: 1, //처음 All
    JJimList: null, //JJim List
    DetailInfo: null, //상세 내역
    BasketList: null, //장바구니
    OrderList: null, //주문목록
    OrderInfo: null, //주문정보
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
    Pagination(state){
      return state.Pagination;
    },
    selectMenuCd(state){
      return state.selectMenuCd;
    },
    JJimList(state){
      return state.JJimList;
    },
    BasketList(state){
      return state.BasketList;
    },
    DetailInfo(state){
      return state.DetailInfo;
    },
    OrderList(state){
      return state.OrderList;
    },
    OrderInfo(state){
      return state.OrderInfo;
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
      state.userInfo = payload;
    },
    setPagination(state, payload){
      state.Pagination = payload;
      state.Pagination.number += 1;
    },
    setSelectMenuCd(state, payload){
      state.selectMenuCd = payload;
    },
    setJJimList(state, payload){
      state.JJimList = payload;
    },
    setBasketList(state, payload){
      var midSum = 0;
      var endSum = 0;
      payload.forEach(function(node){
        midSum = 0;
        node.isSelected = true;
        node.detail.forEach(function(detail){
          midSum += detail.salesPri * detail.basketCnt;
        });
        node.midSum = midSum;
        endSum += midSum;
        }
      );
      payload.endSum = endSum;
      state.BasketList = payload;
    },
    setDetailInfo(state, payload){
      state.DetailInfo = payload;
    },
    setOrderList(state, payload){
      var midCnt = 0;
      var deliPri = 200000;
      var totPri = 0;
      var totDeliPri = 200000;
      var OrderInfo = new Object();
      payload.forEach(function(item){
        midCnt = 0;
        deliPri = 200000;
        if(item.isSelected){
          item.detail.forEach(function(detail){
            midCnt += detail.basketCnt;
            deliPri = Math.min(deliPri,detail.deliPri);
          })
          item.midCnt = midCnt;
          item.deliPri = deliPri;
          totPri += item.midSum+deliPri;
          totDeliPri = Math.min(totDeliPri,deliPri);
        }
      });
      OrderInfo.totPrdPri = totPri;
      OrderInfo.totDeliPri = totDeliPri;
      OrderInfo.totPri = totPri+totDeliPri;
      state.OrderList = payload;
      state.OrderInfo = OrderInfo;
    },
  },
  actions:{
    login(context , data){
      return http.post("/login",data).then((resp) =>{
        JSON.stringify(resp);
        context.commit("setToken",resp.headers.authorization);// 토큰을 적용해준다
        return context.dispatch("getUserInfo",data.id).then(()=>{
          return true;
        });
      }).catch(() =>{
          alert("입력하신 로그인 정보가 일치하지 않습니다.")
          return false;
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
      var user_cd = context.state.userInfo?"&user_cd="+context.state.userInfo.cd:"";
      return http.get("/prd/list/"+context.state.selectMenuCd+"?page="+data.page+"&size=16"+user_cd).then((resp)=>{
        context.commit("setPagination",resp.data);
        console.log(resp.data);
      }).catch((resp)=>{
        alert("잘못된 접근입니다. "+ resp);
      })
    },
    getDetailInfo(context, data){
      var user_cd = "";
      if(context.state.userInfo)
        user_cd = "?user_cd="+context.state.userInfo.cd;
      return http.get("/prd/detail/"+data+user_cd).then((resp)=>{
        context.commit("setDetailInfo",resp.data);
        console.log(resp);
      }).catch((resp)=>{
        alert("잘못된 접근입니다. "+ resp);
      })
    },
    putLike(context, data){
      return http.get("/prd/like/"+data+"/"+context.state.userInfo.cd).then((resp)=>{
        if(resp.data.statusCode =="200")alert("Success");
        return true;
      }).catch((resp)=>{
        alert("잘못된 접근입니다. "+ resp);
      })
    },
    getJJimList(context){
      if(!context.state.userInfo){
        alert("로그인 후에 시도해주세요.")
        return;
      }
      return http.get("/prd/jjim/list/"+context.state.userInfo.cd).then((resp)=>{
        if(resp.data){
          console.log(resp.data);
          context.commit("setJJimList",resp.data);
          return true;
        }
        else
          alert("찜 목록에 상품이 존재하지 않습니다.");
        return false;
      });
    },
    postBasket(context, data){
      return http.post("/prd/basket/"+context.state.userInfo.cd,data).then((resp)=>{
        console.log(resp);
        if(resp.data.statusCode =="200")alert("장바구니에 추가하셨습니다.");
        return true;
      });
    },
    getBasketList(context){
      if(!context.state.userInfo){
        alert("로그인 후에 시도해주세요.")
        return;
      }
      return http.get("/prd/basket/list/"+context.state.userInfo.cd).then((resp)=>{
        if(resp.data){
          console.log(resp.data);
          context.commit("setBasketList",resp.data);
          return true;
        }
        else
          alert("장바구니에 상품이 존재하지 않습니다.");
        return false;
      })
    },
    delBasketInfo(context,data){
      if(!context.state.userInfo){
        alert("로그인 후에 시도해주세요.");
        return;
      }
      return http.delete("/prd/basket/"+context.state.userInfo.cd+"/"+data.prdCd+"/"+data.listCd).then((resp)=>{
        console.log(resp);
        if(resp.data.statusCode =="200"){
          alert("삭제되었습니다.");
          context.dispatch("getBasketList");
        }
      })
    }
  },
  modules:{

  }
});
