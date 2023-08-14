<template>
  <main class="combined-component">
    <h2 class="header">Combined Info</h2>
    <div class="expense-info">
      <div class="card-header">
        <button class="arrow-btn btn" @click="changeDate('previous')">
          <img src="../components/icons/arrow-left.png" alt="left-arrow" class="arrow-img" />
        </button>
        <div v-if="loading" class="spinner-border text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <h3 class="subheader" v-else>{{ `${paycheck1} - ${paycheck2}` }}</h3>
        <button class="arrow-btn btn" @click="changeDate('next')">
          <img src="../components/icons/arrow-right.png" alt="right-arrow" class="arrow-img" />
        </button>
      </div>
      <div class="expense-list">
        <MasterList pageType="paycheckList-noML-dateStr" :expenses="expenseList" />
      </div>
    </div>
    <div class="combined-double">
      <table class="pay-table">
        <thead class="pay-table-header">
          <tr>
            <td colspan="2">Paycheck 1 Info</td>
          </tr>
        </thead>
        <tbody>
          <tr class="info-row every-other">
            <td>Pay Frequency:</td>
            <td>{{ userStore.payFreq }}</td>
          </tr>
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
            <td>${{ estGross.gross1 }}</td>
          </tr>
          <tr class="info-row every-other">
            <td>Total Deductions</td>
            <td>${{ deductions.deductions1 }}</td>
          </tr>
          <tr class="info-row">
            <td>Est. Fed Taxes:</td>
            <td>${{ estFedTax.estFedTax1 }}</td>
          </tr>
          <tr class="info-row every-other">
            <td>Est. State Taxes:</td>
            <td>${{ estLocalTax.estLocalTax1 }}</td>
          </tr>
          <tr class="info-row">
            <td>Est. Take Home Pay:</td>
            <td>${{ estNet.estNet1 }}</td>
          </tr>
        </tbody>
      </table>

      <table class="pay-table">
        <thead class="pay-table-header">
          <tr>
            <td colspan="2">Paycheck 2 Info</td>
          </tr>
        </thead>
        <tbody>
          <tr class="info-row every-other">
            <td>Pay Frequency:</td>
            <td>{{ userStore.payFreq2 }}</td>
          </tr>
          <tr class="info-row">
            <td>Hours per Paycheck:</td>
            <td>{{ userStore.hours2 }}</td>
          </tr>
          <tr class="info-row every-other">
            <td>Pay Rate:</td>
            <td>
              ${{ userStore.pay2 }} per
              {{ userStore.payRate2 === "hourly" ? "hour" : "year" }}
            </td>
          </tr>
          <tr class="info-row">
            <td>Est. Gross Pay:</td>
            <td>${{ estGross.gross2 }}</td>
          </tr>
          <tr class="info-row every-other">
            <td>Total Deductions</td>
            <td>${{ deductions.deductions2 }}</td>
          </tr>
          <tr class="info-row">
            <td>Est. Fed Taxes:</td>
            <td>${{ estFedTax.estFedTax2 }}</td>
          </tr>
          <tr class="info-row every-other">
            <td>Est. State Taxes:</td>
            <td>${{ estLocalTax.estLocalTax2 }}</td>
          </tr>
          <tr class="info-row">
            <td>Est. Take Home Pay:</td>
            <td>${{ estNet.estNet2 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="combined-pay">
      <table class="funds-table">
        <thead class="funds-table-header">
          <td colspan="2">Combined Pay Info</td>
        </thead>
        <tbody>
          <tr class="info-row">
            <td>Total Take Home Pay:</td>
            <td>${{ estNet.estNet1 + estNet.estNet2 }}</td>
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
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useUserStore } from "../stores/UserStore";
import PaycheckInfo from "../components/PaycheckInfo.vue";
import MasterList from "./MasterList.vue";
import { type Expense } from "../types";
import { type Paycheck } from "../types";

export default defineComponent({
  components: {
    PaycheckInfo,
    MasterList,
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseList: [] as Expense[],
      paycheck1: "",
      paycheck2: "",
      ogPaycheckStr: "",
      loading: false,
      paychecks: [] as Paycheck[],
      pIndex: 0,
      additionalFunds: 0,
      number: 0,
    };
  },
  watch: {
    paycheck1: function () {
      this.getExpenses();
    },
  },
  computed: {
    total(): number {
      return this.userStore.getExpenseTotal(this.expenseList);
    },
    whichPaycheck(): string {
      const dateExistsInPaychecks1 = (value: string) =>
        this.userStore.paychecks.some((paycheck) => {
          return paycheck.date.includes(value);
        });

      const dateExistsInPaychecks2 = (value: string) =>
        this.userStore.paychecks2.some((paycheck) => {
          return paycheck.date.includes(value);
        });

      if (
        dateExistsInPaychecks1(this.ogPaycheckStr) &&
        dateExistsInPaychecks2(this.ogPaycheckStr)
      ) {
        return "both";
      } else if (dateExistsInPaychecks1(this.ogPaycheckStr)) {
        return "one";
      } else if (dateExistsInPaychecks2(this.ogPaycheckStr)) {
        return "two";
      }
      return "none";
    },
    remaining(): number {
      let one: number;
      let two: number;

      if (this.whichPaycheck === "one") {
        one = this.userStore.getEstNet(1);
        two = 0;
      } else if (this.whichPaycheck === "two") {
        one = 0;
        two = this.userStore.getEstNet(2);
      } else {
        one = this.userStore.getEstNet(1);
        two = this.userStore.getEstNet(2);
      }

      return this.additionalFunds + one + two - this.total;
    },
    estGross(): { gross1: number; gross2: number } {
      let gross1: number;
      let gross2: number;
      if (this.whichPaycheck === "one") {
        gross1 = this.userStore.getEstGross(1);
        return { gross1: gross1, gross2: 0 };
      } else if (this.whichPaycheck === "two") {
        gross2 = this.userStore.getEstGross(2);
        return { gross1: 0, gross2: gross2 };
      } else {
        gross1 = this.userStore.getEstGross(1);
        gross2 = this.userStore.getEstGross(2);
        return { gross1: gross1, gross2: gross2 };
      }
    },
    deductions(): { deductions1: number; deductions2: number } {
      let deductions1: number;
      let deductions2: number;
      if (this.whichPaycheck === "one") {
        deductions1 = this.userStore.deductions;
        return { deductions1: deductions1, deductions2: 0 };
      } else if (this.whichPaycheck === "two") {
        deductions2 = this.userStore.deductions2;
        return { deductions1: 0, deductions2: deductions2 };
      } else {
        deductions1 = this.userStore.deductions;
        deductions2 = this.userStore.deductions2;
        return { deductions1: deductions1, deductions2: deductions2 };
      }
    },
    estFedTax(): { estFedTax1: number; estFedTax2: number } {
      let estFedTax1: number;
      let estFedTax2: number;
      if (this.whichPaycheck === "one") {
        estFedTax1 = this.userStore.getFederalTaxWithholding(1);
        return { estFedTax1: estFedTax1, estFedTax2: 0 };
      } else if (this.whichPaycheck === "two") {
        estFedTax2 = this.userStore.getFederalTaxWithholding(2);
        return { estFedTax1: 0, estFedTax2: estFedTax2 };
      } else {
        estFedTax1 = this.userStore.getFederalTaxWithholding(1);
        estFedTax2 = this.userStore.getFederalTaxWithholding(2);
        return { estFedTax1: estFedTax1, estFedTax2: estFedTax2 };
      }
    },
    estLocalTax(): { estLocalTax1: number; estLocalTax2: number } {
      let estLocalTax1: number;
      let estLocalTax2: number;
      if (this.whichPaycheck === "one") {
        estLocalTax1 = this.userStore.getLocalTaxWithholding(1);
        return { estLocalTax1: estLocalTax1, estLocalTax2: 0 };
      } else if (this.whichPaycheck === "two") {
        estLocalTax2 = this.userStore.getLocalTaxWithholding(2);
        return { estLocalTax1: 0, estLocalTax2: estLocalTax2 };
      } else {
        estLocalTax1 = this.userStore.getLocalTaxWithholding(1);
        estLocalTax2 = this.userStore.getLocalTaxWithholding(2);
        return { estLocalTax1: estLocalTax1, estLocalTax2: estLocalTax2 };
      }
    },
    estNet(): { estNet1: number; estNet2: number } {
      let estNet1: number;
      let estNet2: number;
      if (this.whichPaycheck === "one") {
        estNet1 = this.userStore.getEstNet(1);
        return { estNet1: estNet1, estNet2: 0 };
      } else if (this.whichPaycheck === "two") {
        estNet2 = this.userStore.getEstNet(2);
        return { estNet1: 0, estNet2: estNet2 };
      } else {
        estNet1 = this.userStore.getEstNet(1);
        estNet2 = this.userStore.getEstNet(2);
        return { estNet1: estNet1, estNet2: estNet2 };
      }
    },
  },
  methods: {
    formatDate(dateStr: string): string {
      return this.userStore.formatDays(new Date(dateStr));
    },
    changeDate(direction: string): void {
      if (direction === "next") {
        if (this.pIndex < this.userStore.paychecks.length - 1) {
          this.pIndex++;
          this.paycheck1 = this.formatDate(this.paychecks[this.pIndex].date);
          this.ogPaycheckStr = this.paychecks[this.pIndex].date;
          this.paycheck2 = this.formatDate(this.paychecks[this.pIndex + 1].date);
        }
      } else {
        if (this.pIndex > 0) {
          this.pIndex--;
          this.paycheck1 = this.formatDate(this.paychecks[this.pIndex].date);
          this.ogPaycheckStr = this.paychecks[this.pIndex].date;
          this.paycheck2 = this.formatDate(this.paychecks[this.pIndex + 1].date);
        }
      }
    },
    async getExpenses(): Promise<any> {
      const params = `date1=${this.paycheck1};date2=${this.paycheck2}`;

      await this.userStore
        .getExpenses(params)
        .then((res) => {
          this.expenseList = res.data;
          this.userStore.addConvertedDates(this.expenseList, this.paycheck1);
          this.userStore.sortExpenseDateList(this.expenseList);
        })
        .catch((err) => console.log(err));
    },
  },
  mounted() {
    this.paychecks = this.userStore.combinePaychecks();
    this.loading = true;
    this.paycheck1 = this.formatDate(this.paychecks[this.pIndex].date);
    this.ogPaycheckStr = this.paychecks[this.pIndex].date;
    this.paycheck2 = this.formatDate(this.paychecks[this.pIndex + 1].date);
    this.getExpenses();
    this.loading = false;
  },
});
</script>

<style scoped>
.combined-component {
  background-color: var(--white-black);
  color: var(--text-color);
}

.header {
  text-align: center;
}

.subheader {
  text-align: center;
  width: 350px;
}

.card-header {
  text-align: center;
  display: flex;
  justify-content: center;
  background-color: var(--white-black);
}

.arrow-btn {
  height: 35px;
  width: 35px;
  margin: 0 5px;
  color: white;
  padding: 0px;
  background-color: white;
}

.arrow-btn:hover {
  background-color: rgb(204, 206, 204);
  outline: 2px solid var(--med-green);
}

.arrow-img {
  height: 25px;
  width: 25px;
  color: white;
}

.expense-table,
.pay-table,
.funds-table {
  margin: 0 auto;
  text-align: center;
  border: 2px solid var(--black-white);
  color: var(--text-color);
  background-color: var(--white-black);
}

.expense-list,
.funds-table {
  margin-top: 20px;
  width: 60%;
}

.expense-list {
  margin: auto;
}

.pay-table {
  width: 45%;
}

.funds-table {
  margin-bottom: 20px;
}

.expense-table-header,
.pay-table-header,
.funds-table-header {
  font-weight: bold;
  border: 2px solid var(--black-white);
  background-color: var(--med-green);
  color: white;
}

.every-other {
  background-color: var(--green-bg);
}

.combined-double {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
}

.input-info {
  width: 150px;
  border-radius: 5px;
  border: 2px solid black;
  padding: 0 5px;
}

@media (max-width: 600px) {
  .expense-table,
  .pay-table,
  .funds-table {
    width: 100%;
  }

  .expense-table {
    margin-top: 0px;
  }

  .pay-table {
    margin-top: 20px;
  }

  .funds-table {
    margin-bottom: 0px;
  }

  .combined-double {
    margin-top: 0px;
  }
}
</style>
