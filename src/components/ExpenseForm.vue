<template>
  <main>
    <form action="submit" class="expense-form" @submit.prevent="onSubmit" @keydown.enter.prevent="">
      <div class="input-row">
        <label for="expense-name">Expense Name</label>
        <input
          type="text"
          id="expense-name"
          name="expense-name"
          class="input-info"
          v-model="name"
          ref="name"
        />
      </div>
      <div class="input-row">
        <label for="expense-amount">Amount</label>
        <input
          type="number"
          step="0.01"
          id="expense-amount"
          name="expense-amount"
          class="input-info"
          v-model="amount"
        />
      </div>
      <div class="input-row">
        <label for="expense-date">Due Date</label>
        <select
          name="expense-date"
          id="expense-date"
          class="input-info"
          v-model="date"
          @keyup.enter="onSubmit"
          v-if="type !== 'oneTime'"
        >
          <option value="">-Select One-</option>
          <option v-for="num in dateArr" v-bind:key="num" :value="num">
            {{ num }}
          </option>
        </select>
        <input
          type="date"
          id="ote-date"
          name="ote-date"
          class="input-info"
          v-model="oteDate"
          v-else
        />
      </div>
      <div class="input-row" v-if="type === 'new' || type === 'oneTime'">
        <input type="submit" id="submit-expense" class="btn btn-success" value="Add Expense" />
      </div>

      <div class="btn-container" v-if="type === 'edit'">
        <button class="btn btn-danger edit-btn" @click.prevent="$emit('cancel')">Cancel</button>
        <button class="btn btn-success edit-btn">Confirm</button>
      </div>
    </form>
    <p v-if="invalid" id="warning">Please ensure all fields are filled.</p>
  </main>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import { type Expense } from "../types";

export default defineComponent({
  props: {
    expense: {
      type: Object as PropType<Expense>,
      required: true,
    },
    type: { type: String, required: true },
    dateStr: { type: String, required: false },
  },
  data() {
    return {
      name: this.expense.name,
      amount: this.expense.amount,
      date: this.expense.date,
      oteDate: "",
      invalid: false,
    };
  },
  watch: {
    expense: function () {
      this.name = this.expense.name;
      this.amount = this.expense.amount;
      this.date = this.expense.date;
    },
  },
  computed: {
    dateArr(): number[] {
      const dateArr = Array.from({ length: 31 }, (_, idx) => idx + 1);
      return dateArr;
    },
    expenseData(): Expense {
      let dateArr = [];
      let newDateStr = "";
      if (this.dateStr) {
        dateArr = this.dateStr.split("/");

        if (this.date < parseInt(dateArr[1])) {
          if (parseInt(dateArr[0]) < 12) {
            dateArr[0] = (parseInt(dateArr[0]) + 1).toString()
          } else {
            dateArr[0] = "1"
            dateArr[2] = (parseInt(dateArr[2]) + 1).toString()
          }
        }

        if (this.date < 10) {
          newDateStr = `${dateArr[0]}/0${this.date}/${dateArr[2]}`;
        } else {
          newDateStr = `${dateArr[0]}/${this.date}/${dateArr[2]}`;
        }
      }
      let dateObj: Date;
      let dateStr: string;

      if (newDateStr) {
        dateObj = new Date(newDateStr);
        dateStr = dateObj.toDateString();
      } else if (this.type === "oneTime") {
        dateObj = new Date(this.oteDate.replace(/-/g, "/"));
        dateStr = dateObj.toDateString();
        this.date = dateObj.getDate();
      } else {
        dateObj = new Date(0);
        dateStr = "";
      }

      const expenseData = {
        id: this.expense.id,
        name: this.type === "oneTime" ? this.name + "*" : this.name,
        amount: this.amount,
        date: this.date,
        dateStr: dateStr,
        dateObj: dateObj,
        paid: this.expense.paid,
      };
      return expenseData;
    },
  },
  methods: {
    clearInfo(): void {
      this.name = "";
      this.amount = 0;
      this.date = 0;
      this.oteDate = "";
    },
    onSubmit(): void {
      if (this.name && (this.date || this.oteDate)) {
        this.invalid = false;
        if (this.type === "new" || this.type === "oneTime") {
          this.$emit("addExpense", this.expenseData);
          this.clearInfo();
          (this.$refs["name"] as any).focus();
        } else if (this.type === "edit") {
          this.$emit("editExpense", this.expenseData);
        }
      } else {
        this.invalid = true;
      }
    },
  },
  mounted() {
    (this.$refs["name"] as any).focus()
  },
});
</script>

<style scoped>
.subheader {
  text-align: center;
}

.expense-form {
  display: flex;
  text-align: center;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.input-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.input-row label {
  font-weight: bold;
  color: var(--text-color);
}

.input-info {
  width: 150px;
  border-radius: 5px;
  border: 1px solid var(--input-info);
  padding: 0 5px;
}

#submit-expense {
  margin-top: 10px;
}

.btn-container {
  display: flex;
  margin-top: 10px;
}

.edit-btn {
  margin: 5px;
}

#warning {
  color: rgb(161, 8, 8);
  text-align: center;
  margin-top: 20px;
}

@media (max-width: 600px) {
  .btn {
    font-size: 1.15rem;
  }

  .input-info {
    font-size: 1.25rem;
  }
}
</style>
