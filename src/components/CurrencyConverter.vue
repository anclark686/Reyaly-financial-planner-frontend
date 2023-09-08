<template>
  <section class="currency-container">
    <form class="currency-form" @submit.prevent="onSubmit" @keydown.enter.prevent="">
      <div class="input-row">
        <label for="og-currency"><strong>Original Currency</strong></label>
        <select
          name="og-currency"
          id="og-currency"
          class="input-info"
          v-model="ogCurrency"
          @keyup.enter="onSubmit"
        >
          <option value="">-Select One-</option>
          <option v-for="(curr, i) in currencies" v-bind:key="i" :value="curr">
            {{ curr }}
          </option>
        </select>
      </div>
      <div class="input-row">
        <label for="new-currency"><strong>New Currency</strong></label>
        <select
          name="new-currency"
          id="new-currency"
          class="input-info"
          v-model="newCurrency"
          @keyup.enter="onSubmit"
        >
          <option value="">-Select One-</option>
          <option v-for="(curr, i) in currencies" v-bind:key="i" :value="curr">
            {{ curr }}
          </option>
        </select>
      </div>
      <div class="input-row">
        <label for="amount"><strong>Amount</strong></label>
        <input
          type="number"
          step="0.01"
          id="amount"
          name="amount"
          class="input-info"
          v-model="amount"
        />
      </div>
    </form>
    <div class="btn-container">
      <p v-if="invalid" id="warning">Please ensure all fields are filled.</p>
      <button @click="onSubmit" id="convert-currency" class="btn btn-success">Calculate</button>
      <button @click.prevent="clearInfo" class="btn btn-success">Clear</button>
    </div>
    <table class="output-table">
      <tbody>
        <tr class="output-row">
          <td>
            <div class="label">
              <strong>Old Currency:</strong>
            </div>
          </td>
          <td>
            <div class="output-info">{{ newConversionData.old_currency }}</div>
          </td>
        </tr>
        <tr class="output-row">
          <td>
            <div class="label">
              <strong>Old Amount:</strong>
            </div>
          </td>
          <td>
            <div class="output-info">${{ newConversionData.old_amount }}</div>
          </td>
        </tr>
        <tr class="output-row">
          <td>
            <div class="label">
              <strong>New Currency:</strong>
            </div>
          </td>
          <td>
            <div class="output-info">{{ newConversionData.new_currency }}</div>
          </td>
        </tr>
        <tr class="output-row">
          <td>
            <div class="label">
              <strong>New Amount:</strong>
            </div>
          </td>
          <td>
            <div class="output-info">${{ newConversionData.new_amount }}</div>
          </td>
        </tr>
        <tr class="output-row">
          <td>
            <div class="label">
              <strong>Exchange Rate:</strong>
            </div>
          </td>
          <td>
            <div class="output-info">{{ newExchangeData.exchange_rate }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import { type ConversionData } from "../types";
import { type ExchangeData } from "../types";

export default defineComponent({
  props: {
    currencies: Array,
    conversionData: {
      type: Object as PropType<ConversionData>,
      required: true,
    },
    exchangeData: {
      type: Object as PropType<ExchangeData>,
      required: true,
    },
  },
  data() {
    return {
      ogCurrency: "",
      newCurrency: "",
      amount: 0,
      newConversionData: this.conversionData,
      newExchangeData: this.exchangeData,
      invalid: false,
    };
  },
  watch: {
    conversionData: function () {
      this.newConversionData = this.conversionData;
    },
    exchangeData: function () {
      this.newExchangeData = this.exchangeData;
    },
  },
  computed: {
    data(): { want: string; have: string; amount: number } {
      const data = {
        want: this.newCurrency,
        have: this.ogCurrency,
        amount: this.amount,
      };
      return data;
    },
  },
  methods: {
    clearInfo(): void {
      this.ogCurrency = "";
      this.newCurrency = "";
      this.amount = 0;
      this.newConversionData = {
        new_amount: 0,
        new_currency: "-",
        old_amount: 0,
        old_currency: "-",
      };
      this.newExchangeData = { currency_pair: "", exchange_rate: 0 };
    },
    onSubmit(): void {
      if (this.ogCurrency && this.newCurrency && this.amount) {
        this.invalid = false;
        this.$emit("convert", this.data);
        // this.clearInfo();
      } else {
        this.invalid = true;
      }
    },
  },
});
</script>

<style scoped>
.currency-container {
  font-size: 1.25rem;
}

.currency-form {
  display: flex;
  text-align: center;
  justify-content: space-around;
  flex-wrap: wrap;
}

.input-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.input-info,
.output-info {
  width: 200px;
  border-radius: 5px;
  border: 1px solid var(--input-info);
  padding: 0 5px;
}

.btn-container {
  margin: 20px;
}

.btn {
  margin: 5px;
}

.output-table {
  margin: 10px auto;
}
.label {
  margin-right: 10px;
  margin-top: 5px;
}

.output-info {
  background-color: white;
  margin-top: 5px;
}

#warning {
  color: var(--red);
  text-align: center;
}

@media (max-width: 600px) {
  .btn {
    font-size: 1.15rem;
  }
}
</style>
