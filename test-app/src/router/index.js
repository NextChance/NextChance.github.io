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
      path: "/review-list-by-establishment-id",
      name: "reviewListByEstablishmentId",
      component: () => import("../views/ReviewListByEstablishmentId.vue"),
      beforeEnter: () => {
        document.title = "Review List By Establishment Id";
      },
      props: (route) => ({ establishmentId: route.query.establishmentId }),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
