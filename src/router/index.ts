import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "@auth0/auth0-vue";

import HomeView from "../views/HomeView.vue";
import DashboardView from "../views/DashboardView.vue";
import SettingsView from "../views/SettingsView.vue";
import CalendarView from "../views/CalendarView.vue";
import PaycheckView from "../views/PaycheckView.vue";
import DebtView from "../views/DebtView.vue";
import AccountView from "../views/AccountView.vue";
import SavingsView from "../views/SavingsView.vue";
import ConverterView from "../views/ConverterView.vue";
import ErrorView from "../views/ErrorView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      beforeEnter: authGuard,
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
      beforeEnter: authGuard,
    },
    {
      path: "/views/calendar",
      name: "calendar",
      component: CalendarView,
      beforeEnter: authGuard,
    },
    {
      path: "/views/paycheck",
      name: "paycheck",
      component: PaycheckView,
      beforeEnter: authGuard,
    },
    {
      path: "/views/account",
      name: "account",
      component: AccountView,
      beforeEnter: authGuard,
    },
    {
      path: "/views/debt",
      name: "debt",
      component: DebtView,
      beforeEnter: authGuard,
    },
    {
      path: "/views/savings",
      name: "savings",
      component: SavingsView,
    },
    {
      path: "/views/converter",
      name: "converter",
      component: ConverterView,
    },
    { path: "/404", component: ErrorView },
    { path: "/:catchAll(.*)", redirect: "/404" },
  ],
  scrollBehavior (to, from, savedPosition) {
    return { top: 0, behavior: 'instant'  }
  }
});

export default router;
