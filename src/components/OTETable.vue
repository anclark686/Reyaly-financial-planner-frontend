<template>
  <div class="one-time-expense-table-container">
    <section class="ote-container" v-if="otExpenseList?.length !== 0">
      <h5 class="ote-title">One Time Expenses</h5>
      <table class="ote-table">
        <thead class="ote-table-header">
          <tr>
            <td>Expense Name</td>
            <td>Amount</td>
            <td>Due Date</td>
            <td>Modify</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(ote, i) in otExpenseList"
            :key="ote.id"
            :class="i % 2 === 0 ? 'expense-row every-other' : 'expense-row eog'"
          >
            <td>{{ ote.name }}</td>
            <td>${{ ote.amount }}</td>
            <td>{{ new Date(ote.date).toDateString() }}</td>
            <td>
              <button class="emoji-btn" @click="onEditClick(ote, i)">✏️</button>
              |
              <button class="emoji-btn" @click="preDelete(ote.id, i, ote.name)">❌</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <div class="btn-container" v-if="!showOTEForm">
      <button class="btn btn-success" @click="showOTEForm = true">+ One Time Expense</button>
    </div>
    <OTEForm
      v-if="showOTEForm"
      :paycheckId="paycheckId"
      :otExpense="editInfo"
      :type="oteFormType"
      :paychecks="paychecks"
      :income="userStore.income"
      :possChange="possChange"
      @addNew="addNew"
      @edit="editOTE"
      @cancel="cancelEdit"
    />
    <div class="btn-container" v-if="showOTEForm && !edit">
      <button class="btn btn-success" @click="showOTEForm = false">Close</button>
    </div>

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

import { useUserStore } from "../stores/UserStore";
import OTEForm from "../components/OTEForm.vue";
import DeleteModal from "./DeleteModal.vue";
import { type OneTimeExpense } from "../types";

export default defineComponent({
  props: {
    paycheckId: { type: String, required: true },
    number: { type: Number, required: true },
    possChange: { type: Boolean, required: true },
  },
  components: {
    OTEForm,
    DeleteModal,
  },
  data() {
    return {
      userStore: useUserStore(),
      otExpenseList: [] as OneTimeExpense[],
      total: 0,
      showOTEForm: false,
      oteFormType: "new",
      edit: false,
      editInfo: {} as OneTimeExpense,
      editRow: 0,
      showModal: false,
      deleteInfo: {} as { id: string; idx: number; title: string },
    };
  },
  computed: {
    paychecks() {
      return this.userStore.combinePaychecks();
    },
  },
  watch: {
    paycheckId: function () {
      this.otExpenseList = [] as OneTimeExpense[];
      this.filterOTExpenses();
      this.sortOTExpenses();
      this.calculateTotal(this.otExpenseList);
      this.showOTEForm = false;
    },
    possChange: function () {
      this.otExpenseList = [] as OneTimeExpense[];
      this.filterOTExpenses();
      this.sortOTExpenses();
    },
  },
  methods: {
    filterOTExpenses() {
      for (const ote of this.userStore.otExpenses) {
        if (ote.paycheck === this.paycheckId) {
          this.otExpenseList.push(ote);
        }
      }
    },
    sortOTExpenses() {
      this.otExpenseList.sort((a: any = {}, b: any = {}) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return aDate.valueOf() - bDate.valueOf();
      });
    },
    calculateTotal(otExpenseList: OneTimeExpense[]) {
      const total = otExpenseList.reduce((a: any = {}, b: any = {}) => a + b.amount, 0);
      this.$emit("newTotal", { total: total, num: this.number });
      return total;
    },
    async addNew(oteData: OneTimeExpense) {
      await this.userStore
        .addOTExpense(oteData)
        .then((res) => {
          if (res.message === "Success") {
            oteData.id = res.id;
            this.otExpenseList.push(oteData);
            this.userStore.otExpenses.push(oteData);
            this.calculateTotal(this.otExpenseList);
            this.sortOTExpenses();
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
    },
    onEditClick(expense: OneTimeExpense, idx: number) {
      this.showOTEForm = true;
      this.oteFormType = "edit";
      if (!this.edit) {
        this.edit = true;
        this.editInfo = expense;
        this.editRow = idx;
      }
    },
    cancelEdit() {
      this.edit = false;
      this.editInfo = {} as OneTimeExpense;
      this.oteFormType = "new";
      this.showOTEForm = false;
    },
    async editOTE(oteData: OneTimeExpense) {
      if (oteData.newPaycheck !== oteData.paycheck) {
        this.$emit("possChange", true);
      }
      await this.userStore
        .editOTExpense(oteData)
        .then((res) => {
          if (res.message === "Success") {
            this.otExpenseList = [] as OneTimeExpense[];
            this.userStore.otExpenses = this.userStore.otExpenses.filter(
              (e: any) => e.id !== oteData.id
            );

            this.userStore.otExpenses.push({
              id: oteData.id,
              name: oteData.name,
              amount: oteData.amount,
              date: oteData.date,
              paycheck:
                oteData.newPaycheck !== this.paycheckId ? oteData.newPaycheck! : this.paycheckId,
            });

            this.filterOTExpenses();
            this.sortOTExpenses();
            this.edit = false;
            this.editInfo = {} as OneTimeExpense;
            this.editRow = 0;
            this.oteFormType = "new";
            this.showOTEForm = false;
            this.$emit("possChange", false);
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
    },
    preDelete(id: string, idx: number, title: string) {
      this.showModal = true;
      this.deleteInfo = { id: id, idx: idx, title: title };
    },
    async onDelete(id: string, idx: number) {
      this.showModal = false;
      await this.userStore
        .deleteOTExpense(this.paycheckId, id)
        .then((res) => {
          if (res.message === "Success") {
            this.otExpenseList.splice(idx, 1);
            this.userStore.otExpenses = this.userStore.otExpenses.filter((e: any) => e.id !== id);
            this.deleteInfo = { id: "", idx: 0, title: "" };
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
    },
  },
  mounted() {
    this.filterOTExpenses();
    this.sortOTExpenses();
    this.calculateTotal(this.otExpenseList);
  },
});
</script>

<style scoped>
.one-time-expense-table-container {
  background-color: var(--white-black);
}

.ote-title {
  text-align: center;
  margin: -10px auto 5px auto;
  color: var(--text-color);
}

.ote-table {
  width: 100%;
  margin: 0 auto 20px auto;
  text-align: center;
  border: 2px solid var(--black-white);
  color: var(--text-color);
}

.ote-table-header {
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
  padding: 0;
  background-color: inherit;
}

.btn-container {
  margin: auto;
  text-align: center;
}

@media (max-width: 600px) {
}
</style>
