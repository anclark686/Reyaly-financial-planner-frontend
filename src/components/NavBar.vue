<template>
  <div>
    <div class="pic-header"></div>
    <nav class="navbar">
      <div class="brand">
        <RouterLink v-if="isAuthenticated" class="brand-header" to="/dashboard">
          <p>Reyaly Financial Planner</p>
        </RouterLink>
        <RouterLink v-else class="brand-header" to="/">
          <p>Reyaly Financial Planner</p>
        </RouterLink>
      </div>

      <div class="right">
        <div class="btn-container">
          <button class="dark-light-btn btn btn-light" @click="adjDarkLight('light')">
            <img src="./icons/bright.png" alt="sun" class="dark-light-img" />
          </button>
          <button class="dark-light-btn btn btn-dark" @click="adjDarkLight('dark')">
            <img src="./icons/moon.png" alt="sun" class="dark-light-img" />
          </button>
        </div>
        <section class="menu-dropdown">
          <div class="dropdown">
            <button
              class="btn btn-success btn-lg dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Menu
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
              <RouterLink class="dropdown-item" to="/" v-if="!isAuthenticated"> Home </RouterLink>
              <RouterLink class="dropdown-item" to="/dashboard" v-if="isAuthenticated">
                Dashboard
              </RouterLink>
              <RouterLink class="dropdown-item" to="/views/calendar" v-if="isAuthenticated">
                Calendar View
              </RouterLink>
              <RouterLink class="dropdown-item" to="/views/paycheck" v-if="isAuthenticated">
                Paycheck View
              </RouterLink>
              <RouterLink class="dropdown-item" to="/views/account" v-if="isAuthenticated">
                Account View
              </RouterLink>
              <RouterLink class="dropdown-item" to="/views/debt" v-if="isAuthenticated">
                Debt View
              </RouterLink>
              <RouterLink class="dropdown-item" to="/views/savings"> Savings View </RouterLink>
              <RouterLink class="dropdown-item" to="/views/converter">
                Currency Converter
              </RouterLink>
              <RouterLink class="dropdown-item" to="/settings" v-if="isAuthenticated">
                Settings
              </RouterLink>
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
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";

import LoginButton from "./LoginButton.vue";
import LogoutButton from "./LogoutButton.vue";
import { useUserStore } from "../stores/UserStore";

export default defineComponent({
  setup() {
    const { isAuthenticated } = useAuth0();

    return {
      isAuthenticated,
    };
  },
  components: {
    LoginButton,
    LogoutButton,
    RouterLink,
  },
  data() {
    return {
      showMenu: false,
      userStore: useUserStore(),
    };
  },
  methods: {
    onShowMenu() {
      this.showMenu = !this.showMenu;
    },
    adjDarkLight(color: string) {
      document.cookie = `darkmode=${color}; max-age=31536000;`;
      this.userStore.darkMode = color;
    },
  },
});
</script>

<style scoped>
.pic-header {
  min-height: 200px;
  background:
    linear-gradient(var(--nav-pic), rgba(0, 0, 0, 0.2)),
    url("../assets/money.jpg") center calc(50% - 20%) / cover;
}

.navbar {
  background-color: var(--dk-green);
  width: 100%;
  padding: 10px 20px;
}

.brand {
  color: white;
  font-size: 24px;
  padding: 10px;
  font-family: "Lobster", cursive;
}

.brand-header {
  color: white;
  text-decoration: none;
}

.right {
  display: flex;
}

.btn-container {
  margin: 0 5px;
}

.dark-light-btn {
  height: 50px;
  width: 50px;
  margin: 0 5px;
  color: white;
  padding: 0px;
}

.dark-light-img {
  height: 35px;
  width: 35px;
  color: white;
}

.dropdown-menu {
  background-color: var(--white-black);
}

.dropdown-menu a {
  color: var(--text-color);
}

.dropdown-menu-right {
  right: 0;
  left: auto;
}

.dropdown-item:active {
  background-color: var(--med-green);
}

.dropdown-item:hover {
  background-color: var(--green-bg);
}

.btn-success {
  background-color: var(--med-green);
  border: 2px solid black;
}
@media (max-width: 1000px) {
  .brand {
    margin: auto;
  }

  .brand-header {
    font-size: 2rem;
    text-align: center;
  }

  .btn {
    font-size: 1rem;
  }

  .right {
    margin: auto;
  }

  .dark-light-btn {
    width: 45px;
    height: 45px;
  }

  .dark-light-img {
    height: 35px;
    width: 35px;
  }
  .dropdown-item {
    font-size: 1.5rem;
  }
}
</style>
