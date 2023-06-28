<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";

import NavBar from "./components/NavBar.vue";
import FooterBar from "./components/FooterBar.vue";
import LoginView from "./views/LoginView.vue";

</script>

<template>
  <div class="app">
    <NavBar />

    <RouterView />

    <FooterBar />
  </div>
</template>

<style scoped>
.app {
  background-color: rgb(253, 247, 240);
  min-height: 100vh;
  display: flex;
    flex-direction: column;
}
</style>
