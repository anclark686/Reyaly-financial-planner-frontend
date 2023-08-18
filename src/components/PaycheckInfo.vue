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
          <td>
            Est. Taxes:
            <button class="info-btn" @click.prevent="showTaxModal = true">ℹ️</button>
          </td>
          <td>
            ${{
              userStore.getFederalTaxWithholding(number) + userStore.getLocalTaxWithholding(number)
            }}
          </td>
        </tr>

        <tr class="info-row every-other">
          <td>Est. Take Home Pay:</td>
          <td>${{ userStore.getEstNet(number) }}</td>
        </tr>
        <tr class="info-row">
          <td>
            Expenses Total:
            <button class="info-btn" @click.prevent="showTotalModal = true">ℹ️</button>
          </td>
          <td>${{ total }}</td>
        </tr>
        <tr class="info-row every-other">
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
        <tr class="info-row">
          <td>Remaining Funds:</td>
          <td>${{ remaining }}</td>
        </tr>
      </tbody>
    </table>

    <div class="tax-modal" v-if="showTaxModal">
      <button id="x-out" @click="showTaxModal = false">x</button>
      <h4>Tax Information</h4>
      <table class="tax-info-table">
        <tbody>
          <tr class="tax-info bw">
            <td>Fed Tax Rate:</td>
            <td>{{ number === 1 ? userStore.fedTaxRate : userStore.fedTaxRate2 }}%</td>
          </tr>
          <tr class="tax-info every-other">
            <td>FICA*:</td>
            <td>7.65%</td>
          </tr>
          <tr class="tax-info bw">
            <td>Est. Fed Taxes:</td>
            <td>${{ userStore.getFederalTaxWithholding(number) }}</td>
          </tr>

          <tr class="tax-info every-other">
            <td>State Tax Rate:</td>
            <td>{{ number === 1 ? userStore.localTaxRate : userStore.localTaxRate2 }}%</td>
          </tr>
          <tr class="tax-info bw">
            <td>Est. State Taxes:</td>
            <td>${{ userStore.getLocalTaxWithholding(number) }}</td>
          </tr>

          <tr class="tax-info every-other">
            <td>Relationship Status:</td>
            <td>{{ userStore.relationship }}</td>
          </tr>
          <tr class="tax-info bw">
            <td>State of Residence:</td>
            <td>{{ userStore.residence }}</td>
          </tr>
        </tbody>
      </table>

      <p class="fica">
        <strong>*Fica:</strong> Taxes under the Federal Insurance Contributions Act (FICA) are
        composed of the old-age, survivors, and disability insurance taxes, also known as social
        security taxes (6.2%), and the hospital insurance tax, also known as Medicare taxes (1.45%).
      </p>
      <h5 class="additional-info">Additional Info</h5>
      <p>
        More information about US taxes can be found
        <a
          href="https://taxfoundation.org/data/all/federal/2023-tax-brackets/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>Here.</strong>
        </a>
      </p>
      <button class="btn-success btn" @click="showTaxModal = false">Close</button>
    </div>

    <div class="expense-modal" v-if="showTotalModal">
      <button id="x-out" @click="showTotalModal = false">x</button>
      <h4>Expense Information</h4>
      <table class="total-table">
        <tbody>
          <tr class="total-num bw">
            <td>Recurring Expenses Total:</td>
            <td>${{ userStore.getExpenseTotal(expenseList) }}</td>
          </tr>
          <tr class="total-num every-other">
            <td>One Time Expenses Total:</td>
            <td>${{ oteTotal }}</td>
          </tr>
          <tr class="total-num bw">
            <td>Combined Expenses Total:</td>
            <td>${{ total }}</td>
          </tr>
        </tbody>
      </table>

      <button class="btn-success btn" @click="showTotalModal = false">Close</button>
    </div>
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
    oteTotal: { type: Number, required: true },
  },
  data() {
    return {
      userStore: useUserStore(),
      additionalFunds: 0,
      paycheck: "",
      showTaxModal: false,
      showTotalModal: false,
      loading: false,
    };
  },
  computed: {
    total(): number {
      return this.userStore.getExpenseTotal(this.expenseList) + this.oteTotal;
    },
    remaining(): number {
      return this.additionalFunds + (this.userStore.getEstNet(this.number) - this.total);
    },
  },
});
</script>

<style scoped>
.main-card {
  background-color: var(--white-black);
  color: var(--text-color);
}

.expense-table,
.pay-info-table {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  box-shadow: 0 0 10px var(--box-shadow);
  color: var(--text-color);
  background-color: var(--white-black);
}

.expense-table-header,
.pay-info-table-header {
  font-weight: bold;
  box-shadow: 0 -1px 10px var(--box-shadow);
  background-color: var(--med-green);
  color: white;
}

.every-other {
  background-color: var(--row-bg);
}

.pay-info-table {
  margin-top: 20px;
}

.input-info {
  width: 100px;
  text-align: center;
  border-radius: 5px;
  border: 1px solid var(--input-info);
  padding: 0 5px;
}

.info-btn {
  border: none;
  background-color: inherit;
  padding: none;
}

.tax-modal,
.expense-modal {
  width: 50%;
  background-color: var(--green-bg);
  position: fixed;
  border-radius: 5px;
  top: 25%;
  left: 25%;
  text-align: center;
  padding: 20px;
  border-radius: var(--border-radius);
  overflow-y: auto;
  color: var(--black-white);
  z-index: 1;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.519);
}

.tax-modal {
  height: 500px;
}

.expense-modal {
  height: 270px;
}

.tax-info-table,
.total-table {
  width: 350px;
  margin: 20px auto;
  box-shadow: 0 0 10px var(--box-shadow);
}

.bw {
  background-color: var(--white-black);
}

#x-out {
  margin-right: 5px;
  border: none;
  background-color: inherit;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  font-size: 1.5rem;
}

.additional-info {
  margin: 5px;
}

.btn {
  margin-top: 10px;
}

.fica {
  font-size: smaller;
}

@media (max-width: 800px) {
  .tax-modal,
  .expense-modal {
    width: 75%;
    left: 12%;
  }
}

@media (max-width: 600px) {
  .tax-modal,
  .expense-modal {
    width: 90%;
    left: 5%;
  }

  .fica {
    font-size: medium;
  }
}
</style>
