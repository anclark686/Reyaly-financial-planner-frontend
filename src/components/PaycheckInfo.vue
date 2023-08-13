<template>
  <main class="main-card">
    <table class="pay-info-table">
      <thead class="pay-info-table-header">
        <tr>
          <td colspan="2">
            {{ userStore.income === 2 ? `Paycheck ${number} Info` : "Paycheck Info" }}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr class="info-row every-other">
          <td>Pay Frequency:</td>
          <td>{{ number === 1 ? userStore.payFreq : userStore.payFreq2 }}</td>
        </tr>
        <tr class="info-row">
          <td>Hours per Paycheck:</td>
          <td>{{ number === 1 ? userStore.hours : userStore.hours2 }}</td>
        </tr>
        <tr class="info-row every-other">
          <td>Pay Rate:</td>
          <td>
            ${{ number === 1 ? userStore.pay : userStore.pay2 }} per
            {{
              (number === 1 ? userStore.payRate : userStore.payRate2) === "hourly" ? "hour" : "year"
            }}
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
import { defineComponent, type PropType } from "vue";

import { useUserStore } from "../stores/UserStore";
import { type Expense } from "../types";

export default defineComponent({
  props: {
    number: { type: Number, required: true },
    expenseList: {
      type: Array as PropType<Expense[]>,
      required: true,
    },
  },
  data() {
    return {
      userStore: useUserStore(),
      additionalFunds: 0,
      paycheck: "",
      loading: false,
    };
  },
  computed: {
    total() {
      return this.userStore.getExpenseTotal(this.expenseList);
    },
    remaining() {
      return this.additionalFunds + (this.userStore.getEstNet(this.number) - this.total);
    },
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

.main-card {
  background-color: var(--white-black);
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
  padding: 0 5px;
}
</style>
