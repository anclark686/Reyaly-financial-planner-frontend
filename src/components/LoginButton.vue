<template>
  <div>
    <button @click="login" id="login">Log in</button>
  </div>
</template>

<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

export default {
  setup() {
    const { loginWithRedirect } = useAuth0();

    return {
      login: () => {
        loginWithRedirect({
          appState: {
            target: "/dashboard",
          },
        });
      },
    };
  },
};
</script>

<style scoped>
#login {
  background-color: white;
  border: none;
}
#login:hover {
  background-color: var(--bs-dropdown-link-hover-bg);
}
</style>
