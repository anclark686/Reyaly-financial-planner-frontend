<template>
  <div>
    <button @click="login" id="login">Log in</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
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
});
</script>

<style scoped>
#login {
  background-color: inherit;
  border: none;
}
</style>
