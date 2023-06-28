<template>
  <div>
    <div class="pic-header"></div>
    <nav class="navbar">
      <p class="brand">Reyaly Financial Planner</p>

      <section class="menu-dropdown">
        <div class="dropdown">
          <button class="btn btn-success btn-lg dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Menu
          </button>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
            <RouterLink class="dropdown-item" to="/dashboard">Dashboard</RouterLink>
            <RouterLink class="dropdown-item" to="/views/calendar">Calendar View</RouterLink>
            <RouterLink class="dropdown-item" to="/views/paycheck">Paycheck View</RouterLink>
            <RouterLink class="dropdown-item" to="/views/paycheck">Account View</RouterLink>
            <RouterLink class="dropdown-item" to="/settings">Settings</RouterLink>
            <div class="dropdown-divider"></div>
            <div class="login-logout dropdown-item" v-if="isAuthenticated">
              <LogoutButton />
            </div>
            <div class="login-logout dropdown-item" v-else>
              <LoginButton />
            </div>
          </div>
        </div>
      </section>
    </nav>
  </div>
</template>

<script lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useAuth0 } from '@auth0/auth0-vue';

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
    LoginButton,
    LogoutButton,
  },
  data() {
    return {
      showMenu: false
    }
  },
  methods: {
    onShowMenu() {
      this.showMenu = !this.showMenu;
    }
  }
};

</script>

<style scoped="">
.pic-header {
  min-height: 200px;
  background: linear-gradient(var(--dark-bg), rgba(0, 0, 0, 0.2)),
    url("../assets/money.jpg") center calc(50% - 20%) / cover;
}

.navbar {
  background-color: var(--dk-green);
  width: 100%;
  padding: 10px 20px;
    /* display: flex;
    flex-wrap: wrap;
    justify-content: space-between; */
}

.brand {
  color: white;
  font-size: 24px;
  padding: 10px;
  font-family: "Lobster", cursive;
}

.dropdown-menu-right {
    right: 0;
    left: auto;
}

.dropdown-item:active {
  background-color: var(--med-green);
}

.btn-success {
  background-color: var(--med-green);
  border: 2px solid black;
}
</style>
