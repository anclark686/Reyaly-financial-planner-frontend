<template>
  <div class="debt-payoff">
    <h3 class="subheader">Debt Payoff</h3>
    <section class="form-container">
      <form
        action="submit"
        class="payoff-form"
        @submit.prevent="onSubmit"
        @keydown.enter.prevent=""
      >
        <section class="inputs">
          <div class="input-row">
            <div class="type-row">
              <label for="debt-name">Type</label>

              <button id="info-btn" @click.prevent="showInfoModal = true">ℹ️</button>
            </div>
            <select name="rate" id="rate" class="input-info" v-model="type">
              <option value="">--Select One --</option>
              <option value="snowball">Debt Snowball</option>
              <option value="avalanche">Debt Avalanche</option>
            </select>
          </div>
          <div class="img-container" v-if="type === 'snowball'">
            <img src="./icons/snowball.png" alt="snowball" class="snow-img" />
          </div>
          <div class="img-container" v-else-if="type === 'avalanche'">
            <img src="./icons/snow-avalanche.png" alt="avalanche" class="snow-img" />
          </div>
          <div v-else>
            <div class="snow-img"></div>
          </div>

          <div class="input-row">
            <label for="extra-funds">Extra Funds</label>
            <input
              type="number"
              step="0.01"
              id="extra-funds"
              name="extra-funds"
              class="input-info num-input"
              v-model="funds"
              @keyup.enter="onSubmit"
            />
          </div>
        </section>

        <div class="btn-container">
          <input type="submit" id="submit-debt" class="btn btn-success" value="Calculate!" />
        </div>
      </form>
      <p v-if="invalid" id="warning">Please select a type</p>
    </section>

    <section class="payoff-container" v-if="showPayoff">
      <table class="debt-payoff-table">
        <thead>
          <tr class="table-header">
            <td>Creditor</td>
            <td>Payment Amount</td>
            <td>Remaining</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(debt, i) in sortedDebtList"
            :key="i"
            :class="i % 2 !== 0 ? 'debt-row every-other' : 'debt-row'"
          >
            <td>
              {{ debt.name }}
            </td>
            <td>
              {{ debt.payment }}
            </td>
            <td :class="debt.remaining === 'Paid Off!' ? 'success' : null">
              {{ debt.remaining }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="info-modal" v-if="showInfoModal">
      <button id="x-out" @click="showInfoModal = false">x</button>
      <h3 class="subheader">Debt Payoff Types</h3>
      <h4>Debt Snowball</h4>
      <p>
        The debt snowball method builds momentum as you start repaying creditors, like rolling a
        snowball across the ground. Begin by paying off debts from smallest to largest. List debts
        by balance and start with the smallest one. Make sure to pay minimums on all other bills and
        send extra cash to the debt with the smallest balance until it’s paid in full. Repeat this
        strategy with the other debts. As you pay off balances, you’ll free up more funds for other
        debts. Plus, it’s encouraging to see progress and can keep you on track to see debts
        vanishing.
      </p>
      <br />
      <h4>Debt Avalanche</h4>
      <p>
        The debt avalanche strategy takes a similar approach but instead orders debts by interest
        rate. First, you make a list of all your debts from the highest interest rate to the lowest.
        You then concentrate on paying off the highest-interest debt first while making minimum
        payments on all the other debt. This cuts back on the amount you’re paying in interest,
        which also frees up more cash to pay down other debt.
      </p>
      <br />
      <p>
        Source:
        <a
          href="https://www.bankrate.com/personal-finance/debt/how-to-pay-off-debt/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bankrate 2023
        </a>
      </p>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { type Debt } from "../types";

export default defineComponent({
  props: {
    debts: { type: Array, required: true },
  },
  data() {
    return {
      type: "",
      funds: 0,
      showInfoModal: false,
      showPayoff: false,
      invalid: false,
      sortedDebtList: [] as {
        name: string;
        payment: number;
        remaining: string;
      }[],
    };
  },
  methods: {
    snowball() {
      this.debts.sort((a: any = {}, b: any = {}) => {
        return a.owed - b.owed;
      });
    },
    avalanche() {
      this.debts.sort((a: any = {}, b: any = {}) => {
        return b.rate - a.rate;
      });
    },
    calculatePayoff() {
      this.sortedDebtList = [] as {
        name: string;
        payment: number;
        remaining: string;
      }[];

      let extraFunds = this.funds;

      if (this.type === "snowball") {
        this.snowball();
      } else if (this.type === "avalanche") {
        this.avalanche();
      }

      for (const debt of this.debts as Debt[]) {
        const diff = debt.owed - debt.payment;
        if (diff === 0) {
          this.sortedDebtList.push({
            name: debt.name,
            payment: debt.payment,
            remaining: "Paid Off!",
          });
        } else if (extraFunds >= debt.owed) {
          const newPayment = debt.owed;
          extraFunds = extraFunds - (debt.owed - debt.payment);
          this.sortedDebtList.push({
            name: debt.name,
            payment: newPayment,
            remaining: "Paid Off!",
          });
        } else {
          const newPayment = debt.payment + extraFunds;
          const remaining = debt.owed - newPayment;
          extraFunds = 0;
          this.sortedDebtList.push({
            name: debt.name,
            payment: newPayment,
            remaining: `$${remaining}`,
          });
        }
      }

      this.showPayoff = true;
    },
    onSubmit() {
      if (this.type) {
        this.invalid = false;
        this.calculatePayoff();
      } else {
        this.invalid = true;
      }
    },
  },
});
</script>

<style scoped>
.subheader {
  margin-bottom: 10px;
}

.inputs {
  display: flex;
  text-align: center;
  justify-content: space-around;
  flex-wrap: wrap;
}

.input-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.input-info {
  width: 150px;
  border-radius: 5px;
  border: 2px solid black;
}

#info-btn {
  border: none;
  background-color: inherit;
}

.num-input {
  text-align: right;
}

.img-container {
  align-self: center;
  border-radius: 5px;
  border: 2px solid black;
}

.snow-img {
  height: 60px;
  width: 60px;
  color: white;
}

.btn-container {
  margin: 10px;
}

.info-modal {
  width: 50%;
  height: 250px;
  background-color: var(--green-bg);
  position: fixed;
  border-radius: 5px;
  top: 25%;
  left: 25%;
  text-align: center;
  padding: 20px;
  border: solid 2px black;
  border-radius: 10px;
  overflow-y: auto;
  color: var(--black-white);
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

#x-out {
  margin-right: 0;
  border: none;
  background-color: inherit;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  font-size: 1.5rem;
}

.debt-payoff-table {
  width: 90%;
  margin: 20px auto;
  text-align: center;
  border: 2px solid var(--black-white);
  color: var(--text-color);
}

.table-header {
  font-weight: bold;
  border: 2px solid var(--black-white);
  background-color: var(--med-green);
  color: white;
}

.every-other {
  background-color: var(--green-bg);
}

.success {
  color: var(--med-green);
}

#warning {
  color: rgb(161, 8, 8);
  text-align: center;
  margin-top: 20px;
}
</style>
