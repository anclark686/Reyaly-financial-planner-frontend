<template>
  <div class="master-list">
    <h3 class="subheader" v-if="!pageType?.includes('noML')">Master List</h3>
    <section class="expense-container">
      <table class="expense-table" v-if="expenses?.length !== 0">
        <thead class="expense-table-header">
          <tr>
            <td class="header-label">Expense Name</td>
            <td class="header-label">Amount</td>
            <td class="header-label">Due Date</td>
            <td v-if="pageType === 'paycheckList-noML-dateStr'" class="header-label">Paid</td>
            <td v-if="pageType === 'settings' || modify" class="header-label">
              Modify
              <button
                v-if="modify"
                class="emoji-btn"
                id="info-btn"
                @click.prevent="showInfoModal = true"
              >
                ℹ️
              </button>
            </td>
            <td v-if="pageType === 'account'" class="header-label">Account</td>
            <td v-if="pageType === 'account'" class="header-label">Add</td>
            <td v-if="pageType === 'accountForm-noML'" class="header-label">Remove</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(expense, i) in masterList"
            :key="expense.id"
            :class="i % 2 === 0 ? 'expense-row every-other' : 'expense-row eog'"
          >
            <td v-if="!expense.name.includes('*')">{{ expense.name }}</td>
            <td v-else class="one-time">{{ expense.name.slice(0, -1) }}</td>
            <td>${{ expense.amount }}</td>
            <td v-if="!pageType.includes('dateStr')">{{ expense.date }}</td>
            <td v-else>{{ expense.dateStr }}</td>
            <td v-if="pageType === 'paycheckList-noML-dateStr' && modify">
              <input
                type="checkbox"
                :checked="expense.paid"
                class="paid-checkbox form-check-input"
                @change="checkPaid(expense)"
              />
            </td>
            <td v-if="pageType === 'paycheckList-noML-dateStr' && !modify">
              {{ expense.paid ? "✔️" : "-" }}
            </td>
            <td v-if="pageType === 'settings' || modify">
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
          <tr>
            <td v-if="pageType === 'settings' || modify" colspan="5" class="add-new-row">
              <button
                class="add-new-btn"
                @click="addNew = true"
                v-if="pageType === 'settings' && !addNew && !edit"
              >
                + Add New Expense
              </button>
              <button class="add-new-btn" @click="addNew = true" v-if="modify && !addNew">
                + Add One Time Expense
              </button>
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

    <section class="expense-form-container" v-else-if="edit">
      <ExpenseForm
        @cancel="cancelEdit"
        @editExpense="editExpenseInfo"
        :expense="editInfo"
        :dateStr="dateStr ? dateStr : ''"
        type="edit"
      />
    </section>

    <section class="expense-form-container" v-if="modify && addNew">
      <ExpenseForm
        @addExpense="addExpense"
        :expense="{ id: '', name: '', amount: 0, date: 0 }"
        type="oneTime"
      />
      <div class="button-container">
        <button class="btn btn-success" @click="addNew = false">Close</button>
      </div>
    </section>

    <section class="button-container" v-if="modify">
      <button class="btn btn-success" @click="saveExpenseList">Save Changes</button>
    </section>

    <SureModal
      v-if="showModal"
      type="delete"
      @close="showModal = false"
      @deleteItem="onDelete(deleteInfo.id, deleteInfo.idx)"
      :name="deleteInfo.title"
    />

    <section class="info-modal" v-if="showInfoModal">
      <button id="x-out" @click="showInfoModal = false">x</button>
      <h3 class="subheader">FYI</h3>
      <p>Changes made here will not affect your master list.</p>
      <button class="btn-success btn close-btn" @click="showInfoModal = false">Close</button>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import ExpenseForm from "./ExpenseForm.vue";
import SureModal from "./SureModal.vue";
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
      changes: 0,
      showModal: false,
      deleteInfo: {} as { id: string; idx: number; title: string },
      showInfoModal: false,
    };
  },
  components: {
    ExpenseForm,
    SureModal,
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
        this.$emit("changes");
        this.changes += 1;
        expenseData.id = crypto.randomUUID();
        console.log(expenseData);
        this.masterList.push(expenseData);
        console.log(this.masterList);
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
        this.$emit("changes");
        this.changes += 1;
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
        this.$emit("changes");
        this.changes += 1;
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
      expense.paid = !expense.paid;
      this.$emit("changes");
      this.changes += 1;
    },
    async saveExpenseList(): Promise<any> {
      const paycheckData = {
        id: this.paycheck!.savedPaycheck,
        paycheckId: this.paycheck!.id,
        date: this.paycheck!.date,
        expenses: this.masterList,
      };
      console.log(paycheckData);
      if (!Object.keys(this.userStore.savedPaychecks).includes(this.paycheck!.id)) {
        await this.userStore
          .addSavedPaycheck(paycheckData)
          .then((res) => {
            if (res.message === "Success") {
              paycheckData.id = res.id;
              this.userStore.savedPaychecks[this.paycheck!.id] = paycheckData;
            } else {
              alert("An error occurred, please try again");
            }
          })
          .catch((err) => console.log(err));
      } else {
        console.log("edit");
        console.log(this.paycheck);
        await this.userStore
          .editSavedPaycheck(paycheckData)
          .then((res) => {
            if (res.message === "Success") {
              this.userStore.savedPaychecks[this.paycheck!.id] = paycheckData;
            } else {
              alert("An error occurred, please try again");
            }
          })
          .catch((err) => console.log(err));
      }

      this.$emit("saved");
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

.expense-table-header,
.add-new-row {
  font-weight: bold;
  box-shadow: 0 -1px 10px var(--box-shadow);
  background-color: var(--med-green);
  color: white;
}

.header-label {
  padding: 5px;
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

.form-check-input {
  position: relative;
  margin: 0;
  vertical-align: middle;
}

.form-check-input:focus {
  outline: 2px solid var(--med-green);
  border-color: var(--med-green);
  box-shadow: none;
}

.form-check-input:checked {
  background-color: var(--med-green);
  border-color: var(--med-green);
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

.add-new-btn {
  width: 100%;
  background-color: inherit;
  color: white;
  border: none;
}

.button-container {
  margin-bottom: 20px;
  text-align: center;
}

.info-modal {
  width: 50%;
  height: 200px;
  background-color: var(--green-bg);
  position: fixed;
  border-radius: 5px;
  top: 25%;
  left: 25%;
  text-align: center;
  padding: 20px;
  border-radius: var(--border-radius);
  border: 1px solid var(--input-info);
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

.close-btn {
  margin: 15px;
}

@media (max-width: 1024px) {
  .info-modal {
    width: 90%;
    left: 5%;
  }
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

  .emoji-btn {
    font-size: 0.85rem;
  }
}
</style>
