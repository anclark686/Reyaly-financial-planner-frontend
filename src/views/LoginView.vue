<template>
  <div>
    <header>
      <h1 class="page-header">Reyaly Financial Planner</h1>
    </header>
    <h2>In order to get started, please login</h2>
    <button @click="login" class="main-login-btn">Log in</button>
  </div>
</template>

<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

export default {
  setup() {
    const { loginWithRedirect } = useAuth0();

    return {
      login: () => {
        loginWithRedirect();
      },
    };
  },
};

</script>

<style scoped>
.main-login-btn {
  background-color: aqua;
}
</style>
