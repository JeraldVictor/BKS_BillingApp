import { createRouter, createWebHashHistory } from "vue-router";
import NotFound from "../views/404.vue";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Orders from "../views/Orders.vue";
import Category from "../views/Category.vue";
import Employee from "../views/Employee.vue";
import Products from "../views/Products.vue";
import About from "../views/About.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/Home",
    name: "Home",
    component: Home,
  },

  { path: "/Orders", component: Orders, to: "/Orders" },
  { path: "/Products", component: Products, to: "/Products" },
  { path: "/Category", component: Category, to: "/Category" },
  { path: "/Employee", component: Employee, to: "/Employee" },
  { path: "/About", component: About, to: "/about" },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition;
  //   } else {
  //     return { top: 0 };
  //   }
  // },
  // beforeRouteUpdate(to, from, next) {
  //   console.log(to);
  //   next();
  // },
});

export default router;
