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
        >
          <option value="">-Select One-</option>
          <option v-for="num in dateArr" v-bind:key="num" :value="num">
            {{ num }}
          </option>
        </select>
      </div>
      <div class="input-row" v-if="type === 'new'">
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
  },
  data() {
    return {
      name: this.expense.name,
      amount: this.expense.amount,
      date: this.expense.date,
      invalid: false,
    };
  },
  computed: {
    dateArr() {
      const dateArr = Array.from({ length: 31 }, (val, idx) => idx + 1);
      return dateArr;
    },
    expenseData() {
      const expenseData = {
        id: this.expense.id,
        name: this.name,
        amount: this.amount,
        date: this.date,
      };
      return expenseData;
    },
  },
  methods: {
    clearInfo() {
      this.name = "";
      this.amount = 0;
      this.date = 0;
    },
    onSubmit() {
      if (this.name && this.date) {
        this.invalid = false;
        if (this.type === "new") {
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
  border: 2px solid black;
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
