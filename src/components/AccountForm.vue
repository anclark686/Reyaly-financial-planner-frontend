<template>
  <section>
    <form action="submit" class="account-form" @submit.prevent="onSubmit" @keydown.enter.prevent="">
      <table class="account-table">
        <tbody>
          <tr>
            <td>
              <strong><label for="account-name">Account Name: </label></strong>
            </td>
            <td>
              <input
                type="text"
                id="account-name"
                name="account-name"
                class="input-info"
                v-model="name"
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong><label for="account-limit">Starting Balance: </label></strong>
            </td>
            <td>
              <input
                type="number"
                step="0.01"
                id="account-limit"
                name="account-limit"
                class="input-info num-input"
                v-model="startBalance"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <h4 class="subheader">Expenses</h4>
      <div class="expense-list" v-if="expenseList.length > 0">
        <MasterList pageType="accountForm" :expenses="expenseList" />
        <button id="clear" class="btn btn-secondary" @click.prevent="clear">Clear</button>
      </div>
      <div class="expense-list" v-else>
        <p>Click ➕ &nbsp;on an expense to get started!</p>
      </div>
      <table class="account-table">
        <tbody>
          <tr>
            <td>
              <strong><label for="account-name">Total Expenses: </label></strong>
            </td>
            <td>
              <p class="input-info">{{ total }}</p>
            </td>
          </tr>
          <tr>
            <td>
              <strong><label for="account-limit">Ending Balance: </label></strong>
            </td>
            <td>
              <p class="input-info">{{ endBalance }}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="invalid" id="warning">Please ensure all fields are filled.</p>
      <button class="btn btn-secondary bottom-btn" @click.prevent="cancel">Cancel</button>
      <input
        v-if="formType === 'new'"
        class="btn btn-success bottom-btn"
        type="submit"
        id="submit-btn"
        value="Add Account"
      />
      <input
        v-if="formType === 'edit'"
        class="btn btn-success bottom-btn"
        type="submit"
        id="submit-btn"
        value="Update Account"
      />
    </form>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import MasterList from "./MasterList.vue";
import { useUserStore } from "../stores/UserStore";
import { type Expense } from "../types";
import { type Account } from "../types";

export default defineComponent({
  props: {
    expense: {
      type: Object as PropType<Expense>,
      required: true,
    },
    formType: String,
    account: {
      type: Object as PropType<Account>,
      required: true,
    },
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseList: this.account.expenses,
      edit: false,
      name: this.account.name,
      startBalance: this.account.start,
      invalid: false,
    };
  },
  computed: {
    total() {
      return this.userStore.getExpenseTotal(this.expenseList);
    },
    endBalance() {
      return this.startBalance - this.total;
    },
    acctInfo() {
      const acctInfo = {
        name: this.name,
        start: this.startBalance,
        total: this.total,
        end: this.endBalance,
        expenses: this.expenseList,
        id: "",
      };
      return acctInfo;
    },
  },
  watch: {
    expense: function (newVal, oldVal) {
      if (
        this.expenseList.filter((e: any) => e.name === this.expense.name).length === 0 ||
        this.expenseList.length == 0
      ) {
        this.expenseList.push(this.expense);
      }
    },
  },
  components: {
    MasterList,
  },
  methods: {
    clearInfo() {
      this.name = "";
      this.startBalance = 0;
      this.expenseList = this.account.expenses;
    },
    async addNewAcct() {
      await this.userStore
        .addAcct(this.acctInfo)
        .then((res) => {
          this.$emit("close-new");
          this.clearInfo();
        })
        .catch((err) => console.log(err));
    },
    async editAcct() {
      this.acctInfo.id = this.account.id;
      await this.userStore
        .editAcct(this.acctInfo)
        .then((res) => {
          if (res.message === "Success") {
            this.$emit("close-edit");
            this.clearInfo();
          }
        })
        .catch((err) => console.log(err));
    },
    cancel() {
      this.account.expenses = this.account.expenses.filter((i: any) => i.account);
      this.$emit("cancel");
    },
    onSubmit() {
      if (this.name && this.startBalance && this.expenseList.length > 0) {
        this.invalid = false;

        if (this.formType === "new") {
          this.addNewAcct();
        } else {
          this.editAcct();
        }
      } else {
        this.invalid = true;
      }
    },
    clear() {
      this.expenseList = [];
    },
  },
});
</script>

<style scoped>
.account-table {
  margin: 10px auto;
}

.account-table label {
  width: 200px;
  text-align: left;
}

.input-info {
  width: 150px;
  border-radius: 5px;
  border: 2px solid black;
}

.num-input {
  text-align: right;
}

.bottom-btn {
  margin: 5px;
}

#warning {
  color: var(--red);
  text-align: center;
  margin-top: 20px;
}

@media (max-width: 1000px) {
  .subheader {
    font-size: 1rem;
  }

  .account-table label {
    width: 95%;
    text-align: left;
  }
  .btn {
    font-size: 1rem;
  }
}
</style>
