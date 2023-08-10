<template>
  <main class="main-card">
    <div class="card-header">
      <button class="arrow-btn btn" @click="changeDate('previous')">
        <img src="../components/icons/arrow-left.png" alt="left-arrow" class="arrow-img" />
      </button>
      <div v-if="loading" class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h2 class="subheader" v-else>{{ paycheck }}</h2>
      <button class="arrow-btn btn" @click="changeDate('next')">
        <img src="../components/icons/arrow-right.png" alt="right-arrow" class="arrow-img" />
      </button>
    </div>

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
          <td>{{ number === 1 ? userStore.hours : userStore.hours2 }}</td>
        </tr>
        <tr class="info-row every-other">
          <td>Pay Rate:</td>
          <td>
            ${{ number === 1 ? userStore.pay : userStore.pay2 }} per
            {{ (number === 1 ? userStore.payRate : userStore.payRate2 ) === "hourly" ? "hour" : "year" }}
          </td>
        </tr>
        <tr class="info-row">
          <td>Est. Gross Pay:</td>
          <td>${{ userStore.getEstGross(number) }}</td>
        </tr>
        <tr class="info-row every-other">
          <td>Total Deductions</td>
          <td>${{ number === 1 ? userStore.deductions : userStore.deductions2 }}</td>
        </tr>
        <tr class="info-row">
          <td>Est. Fed Taxes:</td>
          <td>${{ userStore.getFederalTaxWithholding(number) }}</td>
        </tr>
        <tr class="info-row every-other">
          <td>Est. State Taxes:</td>
          <td>${{ userStore.getLocalTaxWithholding(number) }}</td>
        </tr>
        <tr class="info-row">
          <td>Est. Take Home Pay:</td>
          <td>${{ userStore.getEstNet(number) }}</td>
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
    number: { type: Number, required: true },
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseList: [] as Expense[],
      additionalFunds: 0,
      paycheck: "",
      loading: false,
    };
  },
  watch: {
    paycheck: function () {
      this.getPaychecks();
    },
  },
  computed: {
    total() {
      const total = this.userStore.getExpenseTotal(this.expenseList);
      return total;
    },
    remaining() {
      return this.additionalFunds + (this.userStore.getEstNet(this.number) - this.total);
    },
  },
  methods: {
    changeDate(direction: string) {
      let pIndex = this.number === 1 ? this.userStore.pIndex : this.userStore.pIndex2

      if (direction === "next") {
        if (pIndex < this.userStore.paychecks.length - 1) {
          pIndex++;
          const badDateStr = this.userStore.paychecks[pIndex].date;
          const rawDate = new Date(badDateStr);
          this.paycheck = this.userStore.formatDays(rawDate);
        }
      } else {
        if (pIndex > 0) {
          pIndex--;
          const badDateStr = this.userStore.paychecks[pIndex].date;
          const rawDate = new Date(badDateStr);
          this.paycheck = this.userStore.formatDays(rawDate);
        }
      }

      if (this.number === 1) {
        this.userStore.pIndex = pIndex
      } else if (this.number === 2) {
        this.userStore.pIndex2 = pIndex
      }
    },
    async getPaychecks() {
      const payFreq = this.number === 1 ? this.userStore.payFreq : this.userStore.payFreq2
      const params = `date=${this.paycheck};frequency=${payFreq}`;
      await this.userStore
        .getPaychecks(params)
        .then((res) => {
          this.expenseList = res.data;
          this.userStore.addConvertedDates(this.expenseList, this.paycheck);
          this.userStore.sortExpenseDateList(this.expenseList);
        })
        .catch((err) => console.log(err));
    },
  },
  mounted() {
    let pIndex = this.number === 1 ? this.userStore.pIndex : this.userStore.pIndex2
    this.loading = true;
    const badDateStr = this.userStore.paychecks[pIndex].date;
    const rawDate = new Date(badDateStr);
    this.paycheck = this.userStore.formatDays(rawDate);
    this.getPaychecks();
    this.loading = false;
  },
});
</script>

<style scoped>
.card-header {
  text-align: center;
  display: flex;
  justify-content: center;
  background-color: white;
}

.arrow-btn {
  height: 35px;
  width: 35px;
  margin: 0 5px;
  color: white;
  padding: 0px;
  background-color: white;
}

.arrow-img {
  height: 25px;
  width: 25px;
  color: white;
}

.loading {
  color: var(--text-color);
}

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
