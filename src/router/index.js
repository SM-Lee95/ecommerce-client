import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../components/MainPage.vue";
import JoinForm from "../components/JoinForm.vue";
import JJim from "../components/JJimPage.vue";
import Basket from "../components/BasketPage.vue";
import Detail from "../components/DetailPage.vue";
import Order from "../components/OrderPage.vue";
import MyPage from "../components/MyPage.vue";
import OrderDetailPage from "../components/OrderDetailPage.vue";
import Admin from "../components/AdminPage.vue";
import ProductMng from "../components/ProductMngPage.vue";
import OrderMng from "../components/OrderMngPage.vue";
import UserMng from "../components/UserMngPage.vue";
import CreatePrd from "../components/CreatePrdPage.vue";
import SelectPrd from "../components/SelectPrdPage.vue";
import CommonMngPage from "../components/CommonMngPage.vue";
import VueCookies from "vue-cookies";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Main,
  },
  {
    path: "/JoinForm",
    name: "JoinForm",
    component: JoinForm,
  },
  {
    path: "/JJim",
    name: "JJim",
    component: JJim,
  },
  {
    path: "/Basket",
    name: "Basket",
    component: Basket,
  },
  {
    path: "/Detail",
    name: "Detail",
    component: Detail,
  },
  {
    path: "/Order",
    name: "Order",
    component: Order,
  },
  {
    path: "/MyPage",
    name: "MyPage",
    component: MyPage,
  },
  {
    path: "/OrderDetailPage",
    name: "OrderDetailPage",
    component: OrderDetailPage,
  },
  {
    path: "/Admin",
    name: "Admin",
    component: Admin,
    children: [
      {
        path: "ProductMng",
        component: ProductMng,
        children: [
          {
            path: "CreatePrd",
            component: CreatePrd,
          },
          {
            path: "SelectPrd",
            component: SelectPrd,
          },
        ],
      },
      {
        path: "OrderMng",
        component: OrderMng,
      },
      {
        path: "UserMng",
        component: UserMng,
      },
      {
        path: "CommonMng",
        component: CommonMngPage,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
const validateList = [
  "JJim",
  "Basket",
  "Order",
  "MyPage",
  "OrderDetailPage",
  "Admin",
];
//네비게이션 가드((뷰 라우터로 URL 접근에 대해서 처리할 수 있음) 여기서 모든 라우팅이 대기 상태가 됨
router.beforeEach(async (to, from, next) => {
  /**
   * to: 이동할 url 정보가 담긴 라우터 객체
   * from: 현재 url 정보가 담긴 라우터 객체
   * next: to에서 지정한 url로 이동하기 위해 꼭 호출해야 하는 함수
   * next() 가 호출되기 전까지 화면 전환되지 않음
   */
  if (next.name in validateList) {
    if (
      VueCookies.get("accessToken") === null &&
      VueCookies.get("refreshToken") === null
    ) {
      return next({ name: "Main" }); //쿠키에 토큰 둘다 존재하지 않을시에 메인으로 보내버림
    }
  }
  return next();
});
export default router;
