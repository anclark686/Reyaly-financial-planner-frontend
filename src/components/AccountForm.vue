<template>
  <section>
    <form
      action="submit"
      class="debt-form"
      @submit.prevent="onSubmit"
      @keydown.enter.prevent=""
    >
      <table class="account-table">
        <tbody>
          <tr>
            <td>
              <strong><label for="debt-name">Account Name: </label></strong>
            </td>
            <td>
              <input
                type="text"
                id="debt-name"
                name="debt-name"
                class="input-info"
                v-model="name"
              />
            </td>
          </tr>
          <tr>
            <td>
              <strong
                ><label for="debt-limit">Starting Balance: </label></strong
              >
            </td>
            <td>
              <input
                type="number"
                step="0.01"
                id="debt-limit"
                name="debt-limit"
                class="input-info num-input"
                v-model="startBalance"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <h4>Expenses</h4>
      <div class="expense-list" v-if="expenseList.length > 0">
        <MasterList pageType="accountBox" :expenses="expenseList" />
        <button id="clear" class="btn btn-secondary" @click.prevent="clear">
          Clear
        </button>
      </div>
      <div class="expense-list" v-else>
        <p>&lt;-- Click add on an expense to get started!</p>
      </div>
      <table class="account-table">
        <tbody>
          <tr>
            <td>
              <strong><label for="debt-name">Total Expenses: </label></strong>
            </td>
            <td>
              <p class="input-info">{{ total }}</p>
            </td>
          </tr>
          <tr>
            <td>
              <strong><label for="debt-limit">Ending Balance: </label></strong>
            </td>
            <td>
              <p class="input-info">{{ endBalance }}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="invalid" id="warning">Please ensure all fields are filled.</p>
      <button
        class="btn btn-secondary bottom-btn"
        @click.prevent="$emit('cancel')"
      >
        Cancel
      </button>
      <input
        class="btn btn-success bottom-btn"
        type="submit"
        id="submit-btn"
        value="Add Account"
      />
    </form>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import Axios from "axios";

import MasterList from "./MasterList.vue";
import { type Expense } from "../types";
import { useUserStore } from "../stores/UserStore";

export default defineComponent({
  props: {
    expense: {
      type: Object as PropType<Expense>,
      required: true,
    },
    formType: String,
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseList: [] as Expense[],
      edit: false,
      name: "",
      startBalance: 0,
      invalid: false,
    };
  },
  computed: {
    total() {
      const total = this.expenseList.reduce(
        (a: any = {}, b: any = {}) => a + b.amount,
        0
      );
      return total;
    },
    endBalance() {
      return this.startBalance - this.total;
    },
    newAcct() {
      const newAcct = {
        name: this.name,
        start: this.startBalance,
        total: this.total,
        end: this.endBalance,
        expenses: this.expenseList,
      };
      return newAcct;
    },
  },
  watch: {
    expense: function (newVal, oldVal) {
      if (
        this.expenseList.filter((e: any) => e.name === this.expense.name)
          .length === 0
      ) {
        this.expenseList.push(this.expense);
      }
    },
  },
  components: {
    MasterList,
  },
  methods: {
    addNewAcct() {
      console.log(this.newAcct)

      Axios.post(`${this.userStore.baseUrl}/users/${this.userStore.dbUserId}/accounts`, this.newAcct)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err))
    },
    editAcct() {

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
</style>
