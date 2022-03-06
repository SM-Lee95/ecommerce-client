import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Main from "../components/MainPage.vue";
import JoinForm from "../components/JoinForm.vue";


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
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
