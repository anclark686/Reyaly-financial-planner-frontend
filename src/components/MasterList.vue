<template>
  <div class="master-list">
    <h3 class="subheader">Master List</h3>
    <div class="expense-container">
      <table class="expense-table" v-if="expenses?.length !== 0">
        <thead class="expense-table-header">
          <tr>
            <td>Expense Name</td>
            <td>Amount</td>
            <td>Due Date</td>
            <td>Modify</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(expense, i) in masterList"
            :key="i"
            :class="i % 2 === 0 ? 'expense-row every-other' : 'expense-row'"
          >
            <td>{{ expense.name }}</td>
            <td>{{ expense.amount }}</td>
            <td>{{ expense.date }}</td>
            <td><button class="emoji-btn">✏️</button> | <button class="emoji-btn">❌</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="expense-form-container"
      v-if="pageType === 'settings' && addNew"
    >
      <ExpenseForm @addInfo="addInfo" />
      <div class="button-container">
        <button class="btn btn-success" @click="onCloseClick">Close</button>
      </div>
    </div>
    <div class="button-container" v-else>
      <button class="btn btn-success" @click="onAddNewClick">
        Add New Expense
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Axios from "axios";

import ExpenseForm from "./ExpenseForm.vue";
import { useUserStore } from "../stores/UserStore";
import { type Expense }from "../types"

export default {
  props: {
    pageType: String,
    expenses: Array,
  },
  data() {
    return {
      userStore: useUserStore(),
      addNew: false,
      masterList: this.expenses as Expense[],
    };
  },
  components: {
    ExpenseForm,
  },
  methods: {
    addInfo(expenseData: Expense) {
      // console.log(expenseData);
      console.log(this.userStore.dbUserId);
      Axios.post(
        `http://127.0.0.1:3000/users/${this.userStore.dbUserId}/expenses`,
        expenseData
      )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => console.log(err));
      this.masterList.push({
        name: expenseData.name,
        amount: expenseData.amount,
        date: expenseData.date,
      });
    },
    onAddNewClick() {
      this.addNew = true;
      console.log(this.userStore.darkMode);
    },
    onCloseClick() {
      this.addNew = false;
    },
  },
};
</script>

<style scoped>
.subheader {
  text-align: center;
  color: var(--text-color);
}

.expense-table {
  width: 100%;
  margin: 20px auto;
  text-align: center;
  border: 2px solid black;
  color: var(--text-color);
}

.expense-table-header {
  font-weight: bold;
  border: 2px solid var(--dk-green);
  background-color: var(--med-green);
  color: white;
}

.every-other {
  background-color: var(--white-black);
}

.emoji-btn {
  border: none;
  background-color: inherit;
}

.button-container {
  margin: 20px;
  text-align: center;
}
</style>