<template>
  <div class="master-list">
    <h3 class="subheader" v-if="!pageType?.includes('noML')">Master List</h3>
    <section class="expense-container">
      <table class="expense-table" v-if="expenses?.length !== 0">
        <thead class="expense-table-header">
          <tr>
            <td>Expense Name</td>
            <td>Amount</td>
            <td>Due Date</td>
            <td v-if="pageType === 'paycheckList-noML-dateStr'">Paid</td>
            <td v-if="pageType === 'settings' || modify === true">
              Modify <button v-if="modify === true" class="emoji-btn">ℹ️</button>
            </td>
            <td v-if="pageType === 'account'">Account</td>
            <td v-if="pageType === 'account'">Add</td>
            <td v-if="pageType === 'accountForm-noML'">Remove</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(expense, i) in masterList"
            :key="expense.id"
            :class="i % 2 === 0 ? 'expense-row every-other' : 'expense-row eog'"
          >
            <td v-if="!expense.name.includes('*')">{{ expense.name }}</td>
            <td v-else class="one-time">{{ expense.name.slice(0,-1)}}</td>
            <td>${{ expense.amount }}</td>
            <td v-if="!pageType.includes('dateStr')">{{ expense.date }}</td>
            <td v-else>{{ expense.dateStr }}</td>
            <td v-if="pageType === 'paycheckList-noML-dateStr' && modify === true">
              <input
                type="checkbox"
                :value="expense.paid"
                class="paid-checkbox"
                @change="checkPaid(expense)"
              />
            </td>
            <td v-if="pageType === 'paycheckList-noML-dateStr' && modify === false">
              {{ expense.paid ? "✔️" : "-" }}
            </td>
            <td v-if="pageType === 'settings' || modify === true">
              <button class="emoji-btn" @click="onEditClick(expense, i)">✏️</button>
              |
              <button class="emoji-btn" @click="preDelete(expense.id, i, expense.name)">❌</button>
            </td>
            <td v-if="pageType === 'account'">
              {{ expense.account ? expense.account : "-" }}
            </td>
            <td v-if="pageType === 'account'">
              <button class="emoji-btn math-btn" @click="onAddClick(expense)">➕</button>
            </td>
            <td v-if="pageType === 'accountForm-noML'">
              <button class="emoji-btn math-btn" @click="onRemoveClick(i)">➖</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="expense-form-container" v-if="pageType === 'settings' && addNew">
      <ExpenseForm
        @addExpense="addExpense"
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
        @editExpense="editExpenseInfo"
        :expense="editInfo"
        :dateStr="dateStr ? dateStr : ''"
        type="edit"
      />
    </section>

    <section class="button-container" v-else>
      <button class="btn btn-success" @click="addNew = true" v-if="pageType === 'settings'">
        Add New Expense
      </button>
    </section>

    <section class="expense-form-container" v-if="modify === true && addNew">
      <ExpenseForm
        @addExpense="addExpense"
        :expense="{ id: '', name: '', amount: 0, date: 0 }"
        type="oneTime"
      />
      <div class="button-container">
        <button class="btn btn-success" @click="addNew = false">Close</button>
      </div>
    </section>

    <section class="button-container" v-if="modify === true && addNew === false">
      <button class="btn btn-success" @click="addNew = true">Add One Time Expense</button>
    </section>

    <section class="button-container" v-if="modify === true">
      <button class="btn btn-success" @click="saveExpenseList">Save Changes</button>
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

import ExpenseForm from "./ExpenseForm.vue";
import DeleteModal from "./DeleteModal.vue";
import { useUserStore } from "../stores/UserStore";
import { type Expense } from "../types";

export default defineComponent({
  props: {
    pageType: { type: String, required: true },
    expenses: Array,
    dateStr: { type: String, required: false },
    modify: { type: Boolean, required: false },
    paycheck: { type: Object, required: false },
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
      deleteInfo: {} as { id: string; idx: number; title: string },
    };
  },
  components: {
    ExpenseForm,
    DeleteModal,
  },
  watch: {
    expenses: function () {
      this.masterList = this.expenses as Expense[];
    },
  },
  methods: {
    async addExpense(expenseData: Expense): Promise<any> {
      if (!this.modify) {
        await this.userStore
          .addExpense(expenseData)
          .then((res) => {
            if (res.message === "Success") {
              expenseData.id = res.id;
              this.masterList.push(expenseData);
              this.sortMasterList();
            } else {
              alert("An error occurred, please try again");
            }
          })
          .catch((err) => console.log(err));
      } else {
        this.$emit("changes")
        expenseData.id = crypto.randomUUID();
        console.log(expenseData);
        this.masterList.push(expenseData);
        this.userStore.sortExpenseDateList(this.masterList);
      }
    },
    onEditClick(expense: Expense, idx: number): void {
      this.addNew = false;
      if (!this.edit) {
        this.edit = true;
        this.editInfo = expense;
        this.editRow = idx;
      }
    },
    async editExpenseInfo(expenseData: Expense): Promise<any> {
      if (!this.modify) {
        await this.userStore
          .editExpense(expenseData)
          .then((res) => {
            if (res.message === "Success") {
              this.masterList.splice(this.editRow, 1);
              this.masterList.push({
                id: expenseData.id,
                name: expenseData.name,
                amount: expenseData.amount,
                date: expenseData.date,
                dateStr: expenseData.dateStr,
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
      } else {
        this.$emit("changes")
        this.masterList.splice(this.editRow, 1);
        this.masterList.push({
          id: expenseData.id,
          name: expenseData.name,
          amount: expenseData.amount,
          date: expenseData.date,
          dateStr: expenseData.dateStr,
        });
        this.sortMasterList();
        this.edit = false;
        this.editInfo = {} as Expense;
        this.editRow = 0;
      }
    },
    cancelEdit(): void {
      this.edit = false;
      this.editInfo = {} as Expense;
    },
    preDelete(id: string, idx: number, title: string): void {
      this.showModal = true;
      this.deleteInfo = { id: id, idx: idx, title: title };
    },
    async onDelete(id: string, idx: number): Promise<any> {
      this.showModal = false;
      if (!this.modify) {
        await this.userStore
          .deleteExpense(id)
          .then((res) => {
            if (res.message === "Success") {
              this.masterList.splice(idx, 1);
              this.deleteInfo = { id: "", idx: 0, title: "" };
            } else {
              alert("An error occurred, please try again");
            }
          })
          .catch((err) => console.log(err));
      } else {
        this.$emit("changes")
        this.masterList.splice(idx, 1);
        this.deleteInfo = { id: "", idx: 0, title: "" };
      }
    },
    onAddClick(expense: Expense): void {
      this.$emit("addExpense", expense);
    },
    onRemoveClick(idx: number): void {
      this.masterList.splice(idx, 1);
    },
    sortMasterList(): void {
      this.masterList.sort((a: any = {} as Expense, b: any = {} as Expense) => {
        return a.date - b.date;
      });
    },
    checkPaid(expense: Expense): void {
      expense.paid = !expense.paid
      this.$emit("changes")
    },
    saveExpenseList(): void {
      console.log(this.masterList)
    },
  },
  mounted() {
    this.sortMasterList();
  },
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
  box-shadow: 0 0 10px var(--box-shadow);
  color: var(--text-color);
}

.expense-table-header {
  font-weight: bold;
  box-shadow: 0 -1px 10px var(--box-shadow);
  background-color: var(--med-green);
  color: white;
}

.every-other {
  background-color: var(--white-black);
}

.eog {
  background-color: var(--row-bg);
}

.one-time {
  font-style: italic;
}

.emoji-btn {
  border: none;
  padding: 0;
  background-color: inherit;
}

.math-btn {
  border: 1px solid var(--black-white);
  border-radius: 5px;
  padding: 0 2px;
  background-color: rgb(237, 237, 237);
}

.button-container {
  margin-bottom: 20px;
  text-align: center;
}

@media (max-width: 600px) {
  .subheader {
    font-size: 2rem;
  }

  .btn {
    font-size: 1.15rem;
  }
  .expense-container {
    width: 100%;
  }
}
</style>
