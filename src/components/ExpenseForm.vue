<template>
  <div>
    <form
      action="submit"
      class="expense-form"
      @submit.prevent="onSubmit"
      @keydown.enter.prevent=""
    >
      <div class="input-row">
        <label for="expense-name">Expense Name</label>
        <input
          type="text"
          id="expense-name"
          name="expense-name"
          v-model="name"
        />
      </div>
      <div class="input-row">
        <label for="expense-amount">Amount</label>
        <input
          type="number"
          step="0.01"
          id="expense-amount"
          name="expense-amount"
          v-model="amount"
        />
      </div>
      <div class="input-row">
        <label for="expense-date">Due Date</label>
        <select name="expense-date" id="expense-date" v-model="date">
          <option value="">--Select One --</option>
          <option v-for="num in dateArr" v-bind:key="num" :value="num">
            {{ num }}
          </option>
        </select>
      </div>
      <div class="input-row" v-if="type === 'new'">
        <input
          type="submit"
          id="submit-expense"
          class="btn btn-success"
          value="Add Expense"
        />
      </div>

      <div class="btn-container" v-if="type === 'edit'">
        <button
          class="btn btn-danger edit-btn"
          @click.prevent="$emit('cancel')"
        >
          Cancel
        </button>
        <button class="btn btn-success edit-btn">Confirm</button>
      </div>
    </form>
    <p v-if="invalid" id="warning">Please ensure all fields are filled.</p>
  </div>
</template>

<script lang="ts">
import { type Expense } from "../types";

export default {
  props: {
    pageType: String,
    expense: { type: Object, required: true },
    type: String,
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
    clearinfo() {
      this.name = "";
      this.amount = 0;
      this.date = "";
    },
    onSubmit() {
      if (this.name && this.amount && this.date) {
        if (this.type === "new") {
          this.invalid = false;
          this.$emit("addInfo", this.expenseData);
          this.clearinfo();
        } else if (this.type === "edit") {
          this.$emit("editInfo", this.expenseData);
          console.log(this.expense);
        }
      } else {
        this.invalid = true;
      }
    },
  },
  // mounted() {
  //   console.log(this.dateArr);
  // },
};
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

#expense-name,
#expense-amount,
#expense-date {
  width: 150px;
  border-radius: 5px;
  border: 2px solid black;
}

#expense-amount {
  text-align: right;
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
</style>
