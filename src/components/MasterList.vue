<template>
  <div class="master-list">
    <h3 class="subheader" v-if="!pageType?.includes('account')">Master List</h3>
    <section class="expense-container">
      <table class="expense-table" v-if="expenses?.length !== 0">
        <thead class="expense-table-header">
          <tr>
            <td>Expense Name</td>
            <td>Amount</td>
            <td>Due Date</td>
            <td v-if="pageType === 'settings'">Modify</td>
            <td v-if="pageType === 'account'">Account</td>
            <td v-if="pageType === 'account'">Add</td>
            <td v-if="pageType === 'accountForm'">Remove</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(expense, i) in masterList"
            :key="expense.id"
            :class="i % 2 === 0 ? 'expense-row every-other' : 'expense-row eog'"
          >
            <td>{{ expense.name }}</td>
            <td>{{ expense.amount }}</td>
            <td>{{ expense.date }}</td>
            <td v-if="pageType === 'settings'">
              <button class="emoji-btn" @click="onEditClick(expense, i)">
                ✏️
              </button>
              |
              <button class="emoji-btn" @click="preDelete(expense.id, i, expense.name)">
                ❌
              </button>
            </td>
            <td v-if="pageType === 'account'">
              {{ expense.account ? expense.account : "-" }}
            </td>
            <td v-if="pageType === 'account'">
              <button class="emoji-btn" @click="onAddClick(expense)">
                ➕
              </button>
            </td>
            <td v-if="pageType === 'accountForm'">
              <button class="emoji-btn" @click="onRemoveClick(i)">
                ➖
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section
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
    </section>

    <section class="expense-form-container" v-else-if="edit === true">
      <ExpenseForm
        @cancel="cancelEdit"
        @editInfo="editExpenseInfo"
        :expense="editInfo"
        type="edit"
      />
    </section>

    <section class="button-container" v-else>
      <button
        class="btn btn-success"
        @click="addNew = true"
        v-if="pageType === 'settings'"
      >
        Add New Expense
      </button>
    </section>
    <DeleteModal
      v-if="showModal"
      @close="showModal = false"
      @deleteItem="onDelete(deleteInfo.id, deleteInfo.idx)"
      :name="deleteInfo.title"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Axios from "axios";

import ExpenseForm from "./ExpenseForm.vue";
import DeleteModal from "./DeleteModal.vue";
import { useUserStore } from "../stores/UserStore";
import { type Expense } from "../types";

export default defineComponent({
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
      showModal: false,
      deleteInfo: {} as { id: string, idx: number, title: string },
    };
  },
  components: {
    ExpenseForm,
    DeleteModal,
  },
  watch: {
    expenses: function (newVal, oldVal) {
      this.masterList = this.expenses as Expense[];
    },
  },
  methods: {
    addInfo(expenseData: Expense) {
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
            this.sortMasterList();
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
    },
    onEditClick(expense: Expense, idx: number) {
      this.addNew = false;
      if (!this.edit) {
        this.edit = true;
        this.editInfo = expense;
        this.editRow = idx;
      }
    },
    editExpenseInfo(expenseData: Expense) {
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
            this.sortMasterList();
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
    preDelete(id: string, idx: number, title: string) {
      this.showModal = true;
      this.deleteInfo = { id: id, idx: idx, title: title };
    },
    onDelete(id: string, idx: number) {
      this.showModal = false;
      Axios.delete(
        `${this.userStore.baseUrl}/users/${this.userStore.dbUserId}/expenses/${id}`
      )
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "Success") {
            this.masterList.splice(idx, 1);
            this.deleteInfo = { id: "", idx: 0, title: "" };
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
    },
    onAddClick(expense: Expense) {
      this.$emit("addExpense", expense);
    },
    onRemoveClick(idx: number) {
      this.masterList.splice(idx, 1);
    },
    sortMasterList() {
      this.masterList.sort((a: any = {} as Expense, b: any = {} as Expense) => {
        return a.date - b.date;
      });
    },
  },
  mounted() {
    this.sortMasterList();
  }
});
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
  border: 2px solid var(--black-white);
  color: var(--text-color);
}

.expense-table-header {
  font-weight: bold;
  border: 2px solid var(--black-white);
  background-color: var(--med-green);
  color: white;
}

.every-other {
  background-color: var(--white-black);
}

.eog {
  background-color: var(--green-bg);
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
