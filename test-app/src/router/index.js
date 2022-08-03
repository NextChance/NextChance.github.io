import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      beforeEnter: () => {
        document.title = "NoFakes Core Features";
      },
    },
    {
      path: "/simple-review-list",
      name: "simpleReviewList",
      component: () => import("../views/SimpleReviewList.vue"),
      beforeEnter: () => {
        document.title = "Simple Review List";
      },
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
