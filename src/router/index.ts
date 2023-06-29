import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "@auth0/auth0-vue";

import HomeView from "../views/HomeView.vue";
import DashboardView from "../views/DashboardView.vue";
import SettingsView from "../views/SettingsView.vue";
import CalendarView from "../views/CalendarView.vue";
import PaycheckView from "../views/PaycheckView.vue";
import AccountView from "../views/AccountView.vue";
import AboutView from "../views/AboutView.vue";
import ContactView from "../views/ContactView.vue";

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
      path: "/views/account",
      name: "account",
      component: AccountView,
      beforeEnter: authGuard,
    },
    {
      path: "/views/paycheck",
      name: "paycheck",
      component: PaycheckView,
      beforeEnter: authGuard,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/contact",
      name: "contact",
      component: ContactView,
    },
  ],
});

export default router;
