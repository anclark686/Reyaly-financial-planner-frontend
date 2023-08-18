<template>
  <div class="one-time-expense-form-container">
    <form action="submit" class="ote-form" @submit.prevent="onSubmit" @keydown.enter.prevent="">
      <div class="flex-row">
        <div class="input-row">
          <label for="ote-name"><strong>Expense Name:</strong></label>
          <input type="text" id="ote-name" name="ote-name" class="input-info" v-model="oteName" />
        </div>
        <div class="input-row">
          <label for="ote-amount"><strong>Amount:</strong></label>
          <input
            type="number"
            step="0.01"
            id="ote-amounte"
            name="ote-amount"
            class="input-info"
            v-model="oteAmount"
          />
        </div>
        <div class="input-row">
          <label for="ote-date"><strong>Due Date:</strong></label>
          <input type="date" id="ote-date" name="ote-date" class="input-info" v-model="oteDate" />
        </div>
      </div>
      <div class="new-paycheck" v-if="newPaycheck.id !== paycheckId">
        <p><strong>New Paycheck:</strong> {{ newPaycheck.dateObj.toLocaleDateString() }}</p>
      </div>
      <div class="btn-container">
        <button
          class="btn btn-success edit-btn"
          v-if="type === 'edit'"
          @click.prevent="paycheckPicker = true"
        >
          Change Paycheck
        </button>
      </div>

      <p v-if="invalid" id="warning">Please ensure all fields are filled.</p>

      <div class="btn-container" v-if="type === 'new'">
        <input type="submit" id="submit-ote" class="btn btn-success" value="Add Expense" />
      </div>

      <div class="btn-container" v-if="type === 'edit'">
        <button class="btn btn-danger edit-btn" @click.prevent="$emit('cancel')">Cancel</button>
        <button class="btn btn-success edit-btn">Confirm</button>
      </div>
    </form>

    <div class="paycheck-picker-modal" v-if="paycheckPicker === true && type === 'edit'">
      <button id="x-out" @click="paycheckPicker = false">x</button>
      <h3 class="date-picker-header">Adjust Paycheck</h3>
      <div class="date-picker-container" v-if="!year">
        <div class="years">
          <div class="year date-picker-btn" v-for="(yr, i) in years" v-bind:key="i">
            <button class="btn btn-success" @click="year = yr">{{ yr }}</button>
          </div>
        </div>
        <button class="back btn btn-success" @click="paycheckPicker = false">Cancel</button>
      </div>

      <div class="paycheck-picker-container" v-if="year && !month">
        <div class="months">
          <div class="month date-picker-btn" v-for="(mo, i) in months" v-bind:key="i">
            <button class="btn btn-success month-btn" @click="month = i + 1">{{ mo }}</button>
          </div>
        </div>
        <button class="back btn btn-success" @click="year = 0">Back</button>
      </div>

      <div class="paycheck-picker-container" v-if="year && month">
        <div class="paychecks">
          <div
            class="paycheck date-picker-btn"
            v-for="(pc, i) in filterPaychecks()"
            v-bind:key="pc.id"
            v-if="filterPaychecks().length > 0"
          >
            <button
              :class="`btn btn-success paycheck-btn ${income === 2 ? 'paycheck-btn-lg' : null}`"
              @click="changePaycheck(pc)"
            >
              {{
                income === 1
                  ? pc.dateObj.toDateString()
                  : `${pc.dateObj.toDateString()} (${pc.income})`
              }}
            </button>
          </div>
          <div class="no-paychecks" v-else>No Results Found...</div>
        </div>
        <button class="back btn btn-success" @click="month = 0">Back</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import { useUserStore } from "../stores/UserStore";
import { type OneTimeExpense } from "../types";
import { type Paycheck } from "../types";

export default defineComponent({
  props: {
    paycheckId: { type: String, required: true },
    otExpense: {
      type: Object as PropType<OneTimeExpense>,
      required: true,
    },
    type: { type: String, required: true },
    paychecks: {
      type: Array as PropType<Paycheck[]>,
      required: true,
    },
    income: { type: Number, required: true },
  },
  components: {},
  data() {
    return {
      userStore: useUserStore(),
      oteName: this.otExpense.name,
      oteAmount: this.otExpense.amount,
      oteDate: this.otExpense.date,
      invalid: false,
      newPaycheck: this.paychecks.filter((check) => check.id === this.paycheckId)[0],
      paycheckPicker: false,
      years: [...new Set(this.paychecks.map((check) => check.dateObj.getFullYear()))],
      year: 0,
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      month: 0,
    };
  },
  computed: {
    oteData(): OneTimeExpense {
      const oteData = {
        id: this.otExpense.id,
        paycheck: this.paycheckId,
        name: this.oteName,
        amount: this.oteAmount,
        date: this.oteDate,
        newPaycheck: this.newPaycheck.id,
      };
      return oteData;
    },
  },
  methods: {
    filterPaychecks(): Paycheck[] {
      const checks = this.paychecks.filter((check: Paycheck) => {
        return (
          check.dateObj.getFullYear() === this.year && check.dateObj.getMonth() === this.month - 1
        );
      });
      return checks;
    },
    clearInfo(): void {
      this.oteName = "";
      this.oteAmount = 0;
      this.oteDate = "";
      this.newPaycheck = this.paychecks.filter((check) => check.id === this.paycheckId)[0];
      this.year = 0;
      this.month = 0;
    },
    changePaycheck(paycheck: Paycheck): void {
      this.newPaycheck = paycheck;
      this.paycheckPicker = false;
    },
    onSubmit(): void {
      if (this.oteName && this.oteAmount && this.oteDate) {
        this.invalid = false;

        if (this.type === "new") {
          this.$emit("addNew", this.oteData);
          this.clearInfo();
        } else {
          this.$emit("edit", this.oteData);
          this.clearInfo();
        }
      } else {
        this.invalid = true;
      }
    },
  },
  mounted() {
    this.userStore.addPaycheckDates(this.paychecks);
  },
});
</script>

<style scoped>
.one-time-expense-form-container {
  background-color: var(--white-black);
}

.flex-row {
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
  border: 1px solid var(--input-info);
  padding: 0 5px;
}

.input-row label {
  color: var(--text-color);
  margin-bottom: 0;
}

.new-paycheck {
  text-align: center;
  margin-top: 10px;
}

#warning {
  color: rgb(161, 8, 8);
  text-align: center;
  margin-top: 20px;
}

.btn-container {
  text-align: center;
  margin: 10px;
}

.edit-btn {
  margin: 5px;
}

.paycheck-picker-modal {
  width: 50%;
  height: fit-content;
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

.years {
  width: 300px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 5px auto;
}

.year {
  margin: 10px;
}

.months {
  width: 500px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 5px auto;
}

.month-btn {
  margin: 10px;
  width: 125px;
}

.paychecks {
  width: 450px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 5px auto;
}

.paycheck-btn {
  width: 150px;
  margin: 10px;
}

.paycheck-btn-lg {
  width: 200px;
}

.no-paychecks {
  margin: 20px;
  font-size: 1.25rem;
}

@media (max-width: 1024px) {
  .paycheck-picker-modal {
    width: 90%;
    left: 5%;
  }

  .months {
    width: 500px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 5px auto;
  }
}

@media (max-width: 600px) {
  .paycheck-picker-modal {
    width: 90%;
    left: 5%;
  }

  .months {
    width: 90%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 5px auto;
  }
}
</style>
