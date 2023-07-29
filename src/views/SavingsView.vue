<template>
  <section class="page-content">
    <main class="savings-container" v-if="!userStore.loading">
      <header>
        <h1 class="page-header">Savings</h1>
      </header>

      <section class="savings-content">
        <div class="calculator-container">
          <SavingsCalculator />
        </div>

        <div class="accounts-container">
          <h2 class="subheader">High APY Savings Accounts</h2>

          <table class="save-account-table" v-if="savingsList?.length !== 0">
        <thead class="save-table-header">
          <tr>
            <td>Account Name</td>
            <td>Rate</td>
            <td>Min. To Earn</td>
            <td>Link</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(account, i) in savingsList"
            :key="i"
            :class="i % 2 === 0 ? 'save-row every-other' : 'save-row'"
          >
            <td class="name">{{ account.name }}</td>
            <td>{{ account.rate }}</td>
            <td>{{ account.min }}</td>
            <td><a :href="account.link">Learn More</a></td>
          </tr>
        </tbody>
      </table>

          <a href="https://www.nerdwallet.com/best/banking/savings-rates" class="source">Source</a>
        </div>
      </section>
    </main>
    <div class="spinner-container" v-else>
      <div class="spinner-border text-success loading-spinner" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h1 class="loading">Loading...</h1>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

import SavingsCalculator from "../components/SavingsCalculator.vue";
import { useUserStore } from "../stores/UserStore";
import { type SavingsAccount } from "../types";

export default defineComponent({
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  components: {
    SavingsCalculator,
  },
  data() {
    return {
      userStore: useUserStore(),
      savingsList: [] as SavingsAccount[],
    };
  },
  async mounted() {
    await this.userStore
      .getSavings()
      .then((res) => {
        console.log(res);
        this.savingsList = res.data;
        this.savingsList.sort((a: any = {} as SavingsAccount, b: any = {} as SavingsAccount) => {
        return b.percentage - a.percentage;
      });
        console.log(this.savingsList);
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

.calculator-container {
  min-width: 400px;
  width: 40%;
  background-color: var(--green-bg);
  color: var(--text-color);
  border-radius: 15px;
  margin: 70px 50px;
  text-align: center;
  border: 2px solid black;
  padding: 30px;
  height: fit-content;
}

.accounts-container {
  min-width: 400px;
  width: 40%;
  background-color: var(--white-black);
  color: var(--text-color);
  border-radius: 15px;
  margin: 70px 50px;
  text-align: center;
  border: 2px solid black;
  padding: 30px;
}

.save-account-table {
  width: 100%;
  margin: 20px auto;
  text-align: center;
  border: 2px solid var(--black-white);
  color: var(--text-color);
  
}

.save-table-header {
  font-weight: bold;
  border: 2px solid var(--black-white);
  background-color: var(--med-green);
  color: white;
}

td {
  padding: 5px;
}

.name {
  width: 50%;
  height: 3.5rem;
}

.every-other {
  background-color: var(--green-bg);
}

.source {
  font-size: larger;
}

@media (max-width: 1000px) {
  .page-header {
    font-size: 2.5rem;
  }

  .calculator-container {
    width: 90%;
    margin: 20px;
    padding: 10px;
    font-size: 1rem;
  }

  .accounts-container {
    width: 90%;
    margin: 20px;
    padding: 10px;
    font-size: 1.25rem;
  }
}
</style>
