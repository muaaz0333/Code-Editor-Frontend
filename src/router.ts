import { createMemoryHistory, createRouter } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("./views/home.vue"),
    },
  ]
});

export default router;