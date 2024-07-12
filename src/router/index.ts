import { createRouter, createWebHistory } from 'vue-router'
import MainView from "@/views/MainView.vue";
import HealthManagement from "@/views/subPages/HealthManagement.vue";
import FinanceManagement from "@/views/subPages/FinanceManagement.vue";
import ContactManagement from "@/views/subPages/ContactManagement.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/mainView',
    },
    {
      path: "/mainView",
      component: MainView,
      children: [
        {
          path: "healthManagement",
          component: HealthManagement,
        },
        {
          path: "financeManagement",
          component: FinanceManagement,
        },{
        path: "contactManagement",
          component: ContactManagement,
        }
      ]
    },

  ]
})

export default router
