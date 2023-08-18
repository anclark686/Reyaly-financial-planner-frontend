<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";

import NavBar from "./components/NavBar.vue";
import FooterBar from "./components/FooterBar.vue";
import { useUserStore } from "./stores/UserStore";

const userStore = useUserStore();
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
  background-color: rgb(14, 14, 14);
  --nav-pic: var(--dark-bg);
  --green-bg: var(--dk-green);
  --row-bg: var(--dk-green);
  --white-black: rgb(34, 34, 34);
  --black-white: white;
  --text-color: white;
  --btn-main: var(--dk-green);
  --btn-hover: #16784a;
  --box-shadow: black;
  --dk-box-shadow: black;
  --link-hover: var(--lt-green);
}

.app-light {
  background-color: rgb(250 250 250);
  --nav-pic: var(--light-bg);
  --green-bg: var(--lt-green-bg);
  --row-bg: var(--lt-green);
  --white-black: white;
  --text-color: black;
  --black-white: black;
  --btn-main: var(--med-green);
  --btn-hover: #26c67b;
  --box-shadow: lightgray;
  --input-info: lightgray;
  --dk-box-shadow: gray;
  --link-hover: var(--dk-green);
}

.page-header {
  color: var(--text-color);
  font-size: 3rem;
}

.spinner-container {
  margin: 10% auto 10% auto;
  text-align: center;
  height: 100%;
  font-size: large;
  color: var(--text-color);
}

.spinner-border {
  width: 3rem !important;
  height: 3rem !important;
}

a:hover {
  color: var(--link-hover);
}
</style>
