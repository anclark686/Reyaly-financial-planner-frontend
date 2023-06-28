<template>
  <div>
    <button @click="logout" id="logout">Log out</button>
  </div>
</template>
<script lang="ts">
  import { useAuth0 } from '@auth0/auth0-vue';

  export default {
    setup() {
      const { logout } = useAuth0();

      return {
        logout: () => {
          logout({ logoutParams: { returnTo: window.location.origin } });
        }
      };
    }
  };
</script>

<style scoped>
  #logout {
    background-color: white;
    border: none;
  }
  #logout:hover {
    background-color: var(--bs-dropdown-link-hover-bg);
  }
</style>