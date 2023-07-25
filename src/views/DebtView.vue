<template>
  <section class="page-content">
    <main class="debt-container" v-if="!userStore.loading">
      <header>
        <h1 class="page-header">Debts</h1>
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
    <div class="spinner-container" v-else>
      <div class="spinner-border text-success loading-spinner" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h1>Loading...</h1>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

import DebtList from "../components/DebtList.vue";
import DebtPayoff from "../components/DebtPayoff.vue";
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
  border-radius: 15px;
  margin: 70px 50px;
  text-align: center;
  border: 2px solid black;
  padding: 30px;
}

.debt-payoff-container {
  min-width: 400px;
  width: 40%;
  background-color: var(--white-black);
  color: var(--text-color);
  border-radius: 15px;
  margin: 70px 50px;
  text-align: center;
  border: 2px solid black;
}

@media (max-width: 1000px) {
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
}
</style>
