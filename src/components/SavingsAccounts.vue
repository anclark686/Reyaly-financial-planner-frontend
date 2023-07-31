<template>
  <section class="account-container">
    <h2 class="subheader">High APY Savings Accounts</h2>
    <p>Date Fetched: {{ date }}</p>
    <table class="save-account-table" v-if="savingsAccountList?.length !== 0">
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
          v-for="(account, i) in savingsAccountList"
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

    <a href="https://www.nerdwallet.com/best/banking/savings-rates" class="source" target="_blank" rel="noopener noreferrer">Source</a>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import { type SavingsAccount } from "../types";

export default defineComponent({
  props: {
    savingsAccountList: {
      type: Array as PropType<SavingsAccount[]>,
      required: true,
    },
    date: { type: String, required: true },
  },
});
</script>

<style scoped>

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
</style>
