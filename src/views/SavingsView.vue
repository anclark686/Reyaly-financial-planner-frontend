<template>
  <section class="page-content">
    <main class="savings-container" v-if="!userStore.loading && !userStore.error">
      <header>
        <h1 class="page-header">Savings View</h1>
      </header>

      <section class="savings-content">
        <div class="calc-container">
          <SavingsCalculator />
        </div>

        <div class="sa-container">
          <SavingsAccounts :savingsAccountList="savingsList" :date="dateFetched" />
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

import SavingsCalculator from "../components/SavingsCalculator.vue";
import SavingsAccounts from "../components/SavingsAccounts.vue";
import ErrorComponent from "../components/ErrorComponent.vue";
import { useUserStore } from "../stores/UserStore";
import { type SavingsAccount } from "../types";

export default defineComponent({
  components: {
    SavingsCalculator,
    SavingsAccounts,
    ErrorComponent,
  },
  data() {
    return {
      userStore: useUserStore(),
      savingsList: [] as SavingsAccount[],
      dateFetched: "",
    };
  },
  async mounted() {
    await this.userStore
      .getSavings()
      .then((res) => {
        this.savingsList = res.data;
        this.savingsList.sort((a: any = {} as SavingsAccount, b: any = {} as SavingsAccount) => {
          return b.percentage - a.percentage;
        });
        this.dateFetched = res.fetched;
      })
      .catch((err) => console.log(err));
  },
});
</script>

<style scoped>
.savings-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.calc-container {
  min-width: 400px;
  width: 40%;
  background-color: var(--green-bg);
  color: var(--text-color);
  border-radius: var(--border-radius);
  margin: 70px 50px;
  text-align: center;
  box-shadow: 0 0 10px var(--box-shadow);
  padding: 30px;
  height: fit-content;
}

.sa-container {
  min-width: 400px;
  width: 40%;
  background-color: var(--white-black);
  color: var(--text-color);
  border-radius: var(--border-radius);
  margin: 70px 50px;
  text-align: center;
  box-shadow: 0 0 10px var(--box-shadow);
  padding: 30px;
}

@media (max-width: 1024px) {
  .page-header {
    font-size: 2.5rem;
  }

  .calc-container {
    width: 90%;
    margin: 20px;
    padding: 10px;
    font-size: 1rem;
  }

  .sa-container {
    width: 90%;
    margin: 20px;
    padding: 10px;
    font-size: 1.15rem;
  }
}
</style>
