<template>
  <main class="login-container">
    <header>
      <h1 class="page-header">Reyaly Financial Planner</h1>
    </header>
    <h2>In order to get started, please login</h2>
    <button @click="login" class="main-login-btn">Log in</button>
  </main>
</template>

<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const { loginWithRedirect } = useAuth0();

    return {
      login: () => {
        loginWithRedirect();
      },
    };
  },
});

</script>

<style scoped>
.main-login-btn {
  background-color: aqua;
}
</style>
