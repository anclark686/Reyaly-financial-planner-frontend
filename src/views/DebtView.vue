<template>
  <section class="page-content">
    <main class="debt-container" v-if="!userStore.loading && !userStore.error">
      <header>
        <h1 class="page-header">Debt View</h1>
      </header>
      <section class="debt-content">
        <div class="debt-list-container">
          <DebtList :debts="userStore.debts" />
        </div>
        <div class="debt-payoff-container">
          <DebtPayoff :debts="userStore.debts" />
        </div>
      </section>
    </main>
    <div class="spinner-container" v-if="userStore.loading">
      <div class="spinner-border text-success loading-spinner" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h1 class="loading">Loading...</h1>
    </div>
    <div class="error-container" v-if="userStore.error">
      <ErrorComponent />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

import DebtList from "../components/DebtList.vue";
import DebtPayoff from "../components/DebtPayoff.vue";
import ErrorComponent from "../components/ErrorComponent.vue";
import { useUserStore } from "../stores/UserStore";

export default defineComponent({
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  components: {
    DebtList,
    DebtPayoff,
    ErrorComponent,
  },
  data() {
    return {
      userStore: useUserStore(),
    };
  },
  async mounted() {
    await this.userStore.fill(this.user.sub);
  },
});
</script>

<style scoped>
.debt-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.debt-list-container {
  min-width: 400px;
  width: 40%;
  background-color: var(--green-bg);
  color: var(--text-color);
  border-radius: var(--border-radius);
  margin: 70px 50px;
  text-align: center;
  box-shadow: 0 0 10px var(--box-shadow);
  padding: 30px;
}

.debt-payoff-container {
  min-width: 400px;
  width: 40%;
  background-color: var(--white-black);
  color: var(--text-color);
  border-radius: var(--border-radius);
  margin: 70px 50px;
  text-align: center;
  box-shadow: 0 0 10px var(--box-shadow);
}

.loading {
  color: var(--text-color);
}

@media (max-width: 1024px) {
  .debt-list-container {
    width: 90%;
    margin: 20px;
    padding: 10px;
  }

  .debt-payoff-container {
    width: 90%;
    margin: 20px;
    padding: 10px;
  }

  .page-header {
    font-size: 2.5rem;
  }

  .debt-list-container {
    width: 95%;
    font-size: 1rem;
  }

  .debt-payoff-container {
    width: 95%;
    font-size: 1rem;
  }
}
</style>
