<template>
  <div class="dropdown-menu">
    <ul class="dropdown">
      <li><RouterLink to="/dashboard">Dashboard</RouterLink></li>
      <li><RouterLink to="/views/calendar">Calendar View</RouterLink></li>
      <li><RouterLink to="/views/paycheck">Paycheck View</RouterLink></li>
      <li><RouterLink to="/settings">Settings</RouterLink></li>
      <div class="login-logout" v-if="isAuthenticated">
        goodbye
        <LogoutButton />
      </div>
      <div class="login-logout" v-else>
        hello
        <LoginButton />
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import { RouterLink } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";

import LoginButton from "./LoginButton.vue";
import LogoutButton from "./LogoutButton.vue";

export default {
  setup() {
    const { user, isAuthenticated } = useAuth0();

    return {
      user,
      isAuthenticated,
    };
  },

  components: {
    RouterLink,
    LoginButton,
    LogoutButton,
  },
  data() {
    return {
      showMenu: false,
    };
  },
  methods: {
    onShowMenu() {
      this.showMenu = !this.showMenu;
    },
  },
};
</script>
