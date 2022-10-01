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


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Main
  },
  {
    path: "/Main",
    name: "Main",
    component: Main
  },
  {
    path: "/JoinForm",
    name: "JoinForm",
    component: JoinForm
  },
  {
    path: "/JJim",
    name: "JJim",
    component: JJim
  },
  {
    path: "/Basket",
    name: "Basket",
    component: Basket
  },
  {
    path: "/Detail",
    name: "Detail",
    component: Detail
  },
  {
    path: "/Order",
    name: "Order",
    component: Order
  },
  {
    path: "/MyPage",
    name: "MyPage",
    component: MyPage
  },
  {
    path: "/OrderDetailPage",
    name: "OrderDetailPage",
    component: OrderDetailPage
  },
  {
    path: "/Admin",
    name: "Admin",
    component: Admin,
    children: [
      {
        path: 'ProductMng',
        component: ProductMng,
        children: [
          {
            path: 'CreatePrd',
            component: CreatePrd
          },
          {
            path: 'SelectPrd',
            component: SelectPrd
          },
        ]
      },
      {
        path: 'OrderMng',
        component: OrderMng,
      },
      {
        path: 'UserMng',
        component: UserMng,
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
