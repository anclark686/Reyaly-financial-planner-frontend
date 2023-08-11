<template>
  <div class="debt-list">
    <h3 class="subheader">Debt List</h3>
    <div class="sort-container">
      <label for="sort-value">Sort By:</label>
      <select
        name="sort-value"
        id="sort-value"
        class="input-info"
        v-model="sortVal"
        @change="sortDebts"
      >
        <option value="">--Select One--</option>
        <option value="name">Creditor</option>
        <option value="type">Type</option>
        <option value="owed">Owed</option>
        <option value="limit">Limit</option>
        <option value="rate">APR</option>
      </select>
    </div>
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
            <td>${{ debt.owed }}</td>
            <td>${{ debt.limit }}</td>
            <td>{{ debt.rate }}%</td>
            <td>
              <button class="emoji-btn" @click="onEditClick(debt, i)">✏️</button>
              |
              <button class="emoji-btn" @click="onDelete(debt.id, i)">❌</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <section class="debt-form-container" v-if="addNew">
      <DebtForm
        @addDebt="addDebt"
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
      <DebtForm @cancel="cancelEdit" @editDebt="editDebt" :debt="editInfo" pageType="edit" />
    </section>

    <section class="button-container" v-else>
      <button class="btn btn-success" @click="addNew = true">Add New Debt</button>
    </section>
  </div>
</template>

<script lang="ts">
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
      sortVal: "",
    };
  },
  watch: {
    debts: function () {
      this.debtList = this.debts as Debt[];
    },
  },
  methods: {
    sortDebts() {
      if (this.sortVal === "name" || this.sortVal === "type") {
        this.debtList = this.debtList.sort((a: any = {}, b: any = {}) => {
          return a[this.sortVal].localeCompare(b[this.sortVal]);
        });
      } else {
        this.debtList = this.debtList.sort((a: any = {}, b: any = {}) => {
          return a[this.sortVal] - b[this.sortVal];
        });
      }
    },
    async addDebt(debtData: Debt) {
      await this.userStore
        .addDebt(debtData)
        .then((res) => {
          if (res.message === "Success") {
            debtData.id = res.id;
            this.debtList.push(debtData);
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
    async editDebt(debtData: Debt) {
      await this.userStore
        .editDebt(debtData)
        .then((res) => {
          if (res.message === "Success") {
            this.debtList.splice(this.editRow, 1);
            this.debtList.push(debtData);
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
    async onDelete(id: string, idx: number) {
      await this.userStore
        .deleteDebt(id)
        .then((res) => {
          if (res.message === "Success") {
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
.input-info {
  margin: 0 5px;
  width: 150px;
  border-radius: 5px;
  border: 2px solid black;
}

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

@media (max-width: 1024px) {
  .subheader {
    font-size: 2.25rem;
  }
  .btn {
    font-size: 1.5rem;
  }
  .debt-table {
    width: 99%;
    font-size: 0.9rem;
  }

  .emoji-btn {
    padding: 2px;
  }
}
</style>
