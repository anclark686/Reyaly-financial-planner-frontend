<template>
  <section class="calculator-container">
    <header>
      <h2 class="subheader">Savings Calculator</h2>
      <p>Use this calculator to forecast interest earned after one year.</p>
    </header>

    <main class="form-container">
      <form
        action="submit"
        @submit.prevent="onSubmit"
        @keydown.enter.prevent=""
        class="calculator-form"
      >
        <table class="calc-table">
          <tbody>
            <tr class="table-row">
              <td class="calc-label">
                <strong><label for="start">Starting Balance:</label></strong>
              </td>
              <td class="calc-input">
                <input
                  type="number"
                  step="0.01"
                  id="start"
                  name="start"
                  class="input-info"
                  v-model="start"
                />
              </td>
            </tr>
            <tr class="table-row">
              <td class="calc-label">
                <strong><label for="rate">Interest Rate:</label></strong>
              </td>
              <td class="calc-input">
                <input
                  type="number"
                  step="0.01"
                  id="rate"
                  name="rate"
                  class="input-info"
                  v-model="rate"
                />
              </td>
            </tr>
            <tr class="table-row">
              <td class="calc-label">
                <strong><label for="time">Number of Years:</label></strong>
              </td>
              <td class="calc-input">
                <input type="number" id="time" name="time" class="input-info" v-model="time" />
              </td>
            </tr>
            <tr class="table-row">
              <td class="calc-label">
                <strong><label for="deposits">Monthly Deposits:</label></strong>
              </td>
              <td class="calc-input">
                <input
                  type="number"
                  step="0.01"
                  id="deposits"
                  name="deposits"
                  class="input-info"
                  v-model="deposits"
                />
              </td>
            </tr>
            <tr class="table-row">
              <td class="pay-label">
                <strong><label for="compunding">Compunding Frequency:</label></strong>
              </td>
              <td class="calc-input">
                <select name="compunding" id="compunding" class="input-info" v-model="compunding">
                  <option value="annually">Annually</option>
                  <option value="monthly">Monthly</option>
                </select>
              </td>
            </tr>

            <tr class="table-row">
              <td colspan="2">
                <div class="submit-btn">
                  <input class="btn btn-success" type="submit" id="submit-btn" value="Calculate!" />
                </div>
              </td>
            </tr>

            <tr class="table-row">
              <td class="calc-label">
                <strong>Interest Accrued:</strong>
              </td>
              <td class="calc-input">
                <div class="output-info">
                  <p class="interest">${{ interest }}</p>
                </div>
              </td>
            </tr>
            <tr class="table-row">
              <td class="calc-label">
                <strong>New Balance:</strong>
              </td>
              <td class="calc-input">
                <div class="output-info">
                  <p class="newbal">${{ newbal }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </main>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      start: 0,
      rate: 0.0,
      time: 1,
      deposits: 0,
      compunding: "monthly",
      interest: 0,
      newbal: 0,
    };
  },
  methods: {
    clearInfo() {},
    calculateSavings() {
      const percentage = this.rate / 100;
      let yearsRate: number;

      if (this.compunding === "monthly") {
        yearsRate = Math.pow(1 + percentage / 12, 12 * this.time);
      } else {
        yearsRate = Math.pow(1 + percentage * 1, this.time);
      }
      const baseTotal = this.start * yearsRate;
      const baseInterest = baseTotal - this.start;

      const additionalBase = this.deposits * (this.time * 12);
      const additionalTotal = (this.deposits * 12 * (yearsRate - 1)) / percentage;
      const additionalInterest = additionalTotal - additionalBase;

      this.interest = Math.round((baseInterest + additionalInterest) * 100) / 100;
      this.newbal = Math.round((baseTotal + additionalTotal) * 100) / 100;
    },
    onSubmit() {
      this.calculateSavings();
      this.clearInfo();
    },
  },
  async mounted() {},
});
</script>

<style scoped>
.calc-table {
  margin: 50px auto;
}

label {
  margin-bottom: 0;
  margin-right: 5px;
}

.input-info,
.output-info {
  width: 150px;
  border-radius: 5px;
  border: 2px solid black;
  text-align: right;
  margin: 5px;
}

.output-info {
  background-color: white;
}

.submit-btn {
  margin: 50px;
  text-align: center;
  margin: 0px auto;
}
@media (max-width: 1000px) {
}
</style>
