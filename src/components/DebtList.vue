<template>
  <div class="debt-list">
    <h3 class="subheader">Debt List</h3>
    <section class="debt-container">
      <table class="debt-table" v-if="debts?.length !== 0">
        <thead class="debt-table-header">
          <tr>
            <td>Creditor</td>
            <td>Type</td>
            <td>Owed</td>
            <td>Limit</td>
            <td>APR</td>
            <td>Modify</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(debt, i) in debtList"
            :key="debt.id"
            :class="i % 2 === 0 ? 'debt-row every-other' : 'debt-row'"
          >
            <td>{{ debt.name }}</td>
            <td>{{ debt.type }}</td>
            <td>{{ debt.owed }}</td>
            <td>{{ debt.limit }}</td>
            <td>{{ debt.rate }}</td>
            <td>
              <button class="emoji-btn" @click="onEditClick(debt, i)">
                ✏️
              </button>
              |
              <button class="emoji-btn" @click="onDelete(debt.id, i)">
                ❌
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <section class="debt-form-container" v-if="addNew">
      <DebtForm
        @addInfo="addInfo"
        pageType="new"
        :debt="{
          id: '',
          name: '',
          type: '',
          owed: 0,
          limit: 0,
          rate: 0,
          payment: 0,
        }"
      />
      <div class="button-container">
        <button class="btn btn-success" @click="addNew = false">Close</button>
      </div>
    </section>

    <section class="expense-form-container" v-else-if="edit === true">
      <DebtForm
        @cancel="cancelEdit"
        @editInfo="editDebtInfo"
        :debt="editInfo"
        pageType="edit"
      />
    </section>

    <section class="button-container" v-else>
      <button class="btn btn-success" @click="addNew = true">
        Add New Debt
      </button>
    </section>
  </div>
</template>

<script lang="ts">
import Axios from "axios";
import { defineComponent } from "vue";

import DebtForm from "./DebtForm.vue";
import { useUserStore } from "../stores/UserStore";
import { type Debt } from "../types";

export default defineComponent({
  props: {
    debts: Array,
  },
  components: {
    DebtForm,
  },
  data() {
    return {
      userStore: useUserStore(),
      addNew: false,
      debtList: this.debts as Debt[],
      edit: false,
      editInfo: {} as Debt,
      editRow: 0,
    };
  },
  watch: {
    debts: function (newVal, oldVal) {
      this.debtList = this.debts as Debt[];
    },
  },
  methods: {
    addInfo(debtData: Debt) {
      Axios.post(
        `${this.userStore.baseUrl}/users/${this.userStore.dbUserId}/debts`,
        debtData
      )
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "Success") {
            this.debtList.push({
              id: res.data.id,
              name: debtData.name,
              type: debtData.type,
              owed: debtData.owed,
              limit: debtData.limit,
              rate: debtData.rate,
              payment: debtData.payment,
            });
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
    },
    onEditClick(debt: Debt, idx: number) {
      this.addNew = false;
      if (!this.edit) {
        this.edit = true;
        this.editInfo = debt;
        this.editRow = idx;
      }
    },
    editDebtInfo(debtData: Debt) {
      console.log(debtData);
      Axios.put(
        `${this.userStore.baseUrl}/users/${this.userStore.dbUserId}/debts/${debtData.id}`,
        debtData
      )
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "Success") {
            this.debtList.splice(this.editRow, 1);
            this.debtList.push({
              id: debtData.id,
              name: debtData.name,
              type: debtData.type,
              owed: debtData.owed,
              limit: debtData.limit,
              rate: debtData.rate,
              payment: debtData.payment,
            });
            this.edit = false;
            this.editInfo = {} as Debt;
            this.editRow = 0;
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
    },
    cancelEdit() {
      this.edit = false;
      this.editInfo = {} as Debt;
    },
    onDelete(id: string, idx: number) {
      Axios.delete(
        `${this.userStore.baseUrl}/users/${this.userStore.dbUserId}/debts/${id}`
      )
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "Success") {
            this.debtList.splice(idx, 1);
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
    },
  },
});
</script>

<style scoped>
.debt-table {
  width: 100%;
  margin: 20px auto;
  text-align: center;
  border: 2px solid var(--black-white);
  color: var(--text-color);
}

.debt-table-header {
  font-weight: bold;
  border: 2px solid var(--black-white);
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