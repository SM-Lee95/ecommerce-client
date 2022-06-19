import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Main from "../components/MainPage.vue";
import JoinForm from "../components/JoinForm.vue";
import JJim from "../components/JJimPage.vue";
import Basket from "../components/BasketPage.vue";
import Detail from "../components/DetailPage.vue";
import Order from "../components/OrderPage.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/Main",
    name: "Main",
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
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
