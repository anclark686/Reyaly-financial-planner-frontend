<template>
  <div>
    <button @click="logout" id="logout">Log out</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineComponent({
  setup() {
    const { logout } = useAuth0();

    return {
      logout: () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
      },
    };
  },
});
</script>

<style scoped>
#logout {
  background-color: inherit;
  border: none;
  color: var(--text-color);
}
</style>
