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
          <td>{{ expense.amount }}</td>
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
        <tr class="info-row every-other">
          <td>Est. Take Home Pay:</td>
          <td>${{ userStore.estNet }}</td>
        </tr>
        <tr class="info-row">
          <td>Expenses Total:</td>
          <td>${{ total }}</td>
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
import Axios from "axios";
import { defineComponent } from "vue";

import { useUserStore } from "../stores/UserStore";
import { type Expense } from "../types";

export default defineComponent({
  props: {
    date: String,
    frequency: String,
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseList: [] as Expense[],
    };
  },
  watch: {
    date: function (newVal, oldVal) {
      this.getPaychecks();
      this.addDates();
    },
  },
  computed: {
    total() {
      const total = this.expenseList.reduce(
        (a: any = {}, b: any = {}) => a + b.amount,
        0
      );
      return total;
    },
    remaining() {
      return this.userStore.estNet - this.total;
    },
  },
  methods: {
    sortExpenseList() {
      console.log(this.expenseList);
      this.expenseList.sort(
        (a: any = {} as Expense, b: any = {} as Expense) => {
          return a.dateObj - b.dateObj;
        }
      );
    },
    addDates() {
      const dateArr: string[] = this.date?.split("/")!;

      for (const expense of this.expenseList) {
        let month = Number(dateArr[0]);
        let year = Number(dateArr[2]);
        if (expense.date < Number(dateArr[1])) {
          if (month < 12) {
            month++;
          } else {
            month = 1;
            year++;
          }
        }

        const newDateObj = new Date(`${month}/${expense.date}/${year}`);
        expense.dateObj = newDateObj;
        expense.dateStr = newDateObj.toDateString();
      }
    },
    getPaychecks() {
      const params = `date=${this.date};frequency=${this.frequency}`;
      Axios.get(
        `${this.userStore.baseUrl}/users/${this.userStore.dbUserId}/expenses?${params}`
      )
        .then((res) => {
          console.log(res.data);
          this.expenseList = res.data.data;
          this.sortExpenseList();
          this.addDates();
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
</style>
