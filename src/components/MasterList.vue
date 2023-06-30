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
            :key="expense.id"
            :class="i % 2 === 0 ? 'expense-row every-other' : 'expense-row'"
          >
            <td>{{ expense.name }}</td>
            <td>{{ expense.amount }}</td>
            <td>{{ expense.date }}</td>
            <td>
              <button class="emoji-btn" @click="onEditClick(expense, i)">
                ✏️
              </button>
              |
              <button class="emoji-btn" @click="onDelete(expense.id, i)">
                ❌
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="expense-form-container"
      v-if="pageType === 'settings' && addNew"
    >
      <ExpenseForm
        @addInfo="addInfo"
        :expense="{ id: '', name: '', amount: 0, date: 0 }"
        type="new"
      />
      <div class="button-container">
        <button class="btn btn-success" @click="addNew = false">Close</button>
      </div>
    </div>

    <div class="expense-form-container" v-else-if="edit === true">
      <ExpenseForm
        @cancel="cancelEdit"
        @editInfo="editExpenseInfo"
        :expense="editInfo"
        type="edit"
      />
    </div>

    <div class="button-container" v-else>
      <button class="btn btn-success" @click="addNew = true">
        Add New Expense
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Axios from "axios";

import ExpenseForm from "./ExpenseForm.vue";
import { useUserStore } from "../stores/UserStore";
import { type Expense } from "../types";

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
      edit: false,
      editInfo: {} as Expense,
      editRow: 0,
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
        `${this.userStore.baseUrl}/users/${this.userStore.dbUserId}/expenses`,
        expenseData
      )
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "Success") {
            this.masterList.push({
              id: res.data.id,
              name: expenseData.name,
              amount: expenseData.amount,
              date: expenseData.date,
            });
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
    },
    onEditClick(expense: Expense, idx: number) {
      console.log("edit");
      // console.log(expense);
      // console.log(this.userStore.dbUserId);
      if (!this.edit) {
        this.edit = true;
        this.editInfo = expense;
        this.editRow = idx;
      }
    },
    editExpenseInfo(expenseData: Expense) {
      console.log("you get here?");
      console.log(this.editRow);
      console.log(expenseData);
      console.log(this.userStore.dbUserId);
      Axios.put(
        `${this.userStore.baseUrl}/users/${this.userStore.dbUserId}/expenses/${expenseData.id}`,
        expenseData
      )
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "Success") {
            this.masterList.splice(this.editRow, 1);
            this.masterList.push({
              id: expenseData.id,
              name: expenseData.name,
              amount: expenseData.amount,
              date: expenseData.date,
            });
            this.edit = false;
            this.editInfo = {} as Expense;
            this.editRow = 0;
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
    },
    cancelEdit() {
      this.edit = false;
      this.editInfo = {} as Expense;
    },
    onDelete(id: string, idx: number) {
      console.log("delete");
      console.log(id);
      console.log(this.userStore.dbUserId);
      Axios.delete(
        `${this.userStore.baseUrl}/users/${this.userStore.dbUserId}/expenses/${id}`
      )
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "Success") {
            this.masterList.splice(idx, 1);
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
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
