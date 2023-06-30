<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";

import NavBar from "./components/NavBar.vue";
import FooterBar from "./components/FooterBar.vue";
import { useUserStore } from "./stores/UserStore";

const userStore = useUserStore()

</script>

<template>
  <div :class="userStore.darkMode === 'dark' ? 'app app-dark' : 'app app-light'">
    <NavBar />

    <RouterView />

    <FooterBar />
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app-dark {
  background-color: rgb(25, 24, 23);
  --nav-pic: var(--dark-bg);
  --green-bg: var(--dk-green);
  --white-black: black;
  --black-white: white;
  --text-color: white;
  --red: red;
  --btn-main: var(--dk-green);
  --btn-hover: #16784a;
}

.app-light {
  background-color: rgb(253, 247, 240);
  --nav-pic: var(--light-bg);
  --green-bg: var(--lt-green);
  --white-black: white;
  --text-color: black;
  --red: rgb(161, 8, 8);
  --black-white: black;
  --btn-main: var(--med-green);
  --btn-hover: #26c67b;
}

.page-header {
  color: var(--text-color);
}

</style>
