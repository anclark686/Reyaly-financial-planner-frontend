<template>
  <main class="main-card">
    <table class="expense-table">
      <thead class="expense-table-header">
        <tr>
          <td>Expense Name</td>
          <td>Amount</td>
          <td>Due Date</td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(expense, i) in expenseList"
          :key="expense.id"
          :class="i % 2 !== 0 ? 'expense-row every-other' : 'expense-row'"
        >
          <td>{{ expense.name }}</td>
          <td>${{ expense.amount }}</td>
          <td>{{ expense.dateStr }}</td>
        </tr>
      </tbody>
    </table>
    <table class="pay-info-table">
      <thead class="pay-info-table-header">
        <tr>
          <td colspan="2">Paycheck Info</td>
        </tr>
      </thead>
      <tbody>
        <tr class="info-row">
          <td>Hours per Paycheck:</td>
          <td>{{ userStore.hours }}</td>
        </tr>
        <tr class="info-row every-other">
          <td>Pay Rate:</td>
          <td>
            ${{ userStore.pay }} per
            {{ userStore.payRate === "hourly" ? "hour" : "year" }}
          </td>
        </tr>
        <tr class="info-row">
          <td>Est. Gross Pay:</td>
          <td>${{ userStore.estGross }}</td>
        </tr>
        <tr class="info-row every-other">
          <td>Total Deductions</td>
          <td>${{ userStore.deductions }}</td>
        </tr>
        <tr class="info-row">
          <td>Est. Fed Taxes:</td>
          <td>${{ userStore.estFedTaxes }}</td>
        </tr>
        <tr class="info-row every-other">
          <td>Est. State Taxes:</td>
          <td>${{ userStore.estLocalTaxes }}</td>
        </tr>
        <tr class="info-row">
          <td>Est. Take Home Pay:</td>
          <td>${{ userStore.estNet }}</td>
        </tr>
        <tr class="info-row every-other">
          <td>Expenses Total:</td>
          <td>${{ total }}</td>
        </tr>
        <tr class="info-row">
          <td>Additional Funds:</td>
          <td>
            <input
              type="number"
              step="0.01"
              id="funds-amount"
              name="funds-amount"
              class="input-info num-input"
              v-model="additionalFunds"
            />
          </td>
        </tr>
        <tr class="info-row every-other">
          <td>Remaining Funds:</td>
          <td>${{ remaining }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useUserStore } from "../stores/UserStore";
import { type Expense } from "../types";

export default defineComponent({
  props: {
    date: { type: String, required: true },
    frequency: { type: String, required: true },
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseList: [] as Expense[],
      additionalFunds: 0,
    };
  },
  watch: {
    date: function () {
      this.getPaychecks();
    },
  },
  computed: {
    total() {
      const total = this.userStore.getExpenseTotal(this.expenseList);
      return total;
    },
    remaining() {
      return this.additionalFunds + (this.userStore.estNet - this.total);
    },
  },
  methods: {
    async getPaychecks() {
      const params = `date=${this.date};frequency=${this.frequency}`;
      await this.userStore
        .getPaychecks(params)
        .then((res) => {
          this.expenseList = res.data;
          this.userStore.addConvertedDates(this.expenseList, this.date);
          this.userStore.sortExpenseDateList(this.expenseList);
        })
        .catch((err) => console.log(err));
    },
  },
  mounted() {
    this.getPaychecks();
  },
});
</script>

<style scoped>
.expense-table,
.pay-info-table {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  border: 2px solid var(--black-white);
  color: var(--text-color);
  background-color: var(--white-black);
}

.expense-table-header,
.pay-info-table-header {
  font-weight: bold;
  border: 2px solid var(--black-white);
  background-color: var(--med-green);
  color: white;
}

.every-other {
  background-color: var(--green-bg);
}

.pay-info-table {
  margin-top: 20px;
}

.input-info {
  width: 150px;
  border-radius: 5px;
  border: 2px solid black;
}

.num-input {
  text-align: right;
}
</style>
