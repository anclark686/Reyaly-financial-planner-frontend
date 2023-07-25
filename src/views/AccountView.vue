<template>
  <section class="page-content">
    <main class="account-view-container" v-if="!userStore.loading">
      <header>
        <h1 class="page-header">Account View</h1>
      </header>
      <section class="account-content">
        <section class="master-list-container">
          <MasterList
            pageType="account"
            :expenses="userStore.expenses"
            @addExpense="addExpense"
          />
          <p class="link-adjust">
            Click
            <RouterLink to="/settings">here</RouterLink>
            to adjust your settings, and add expenses.
          </p>
        </section>
        <section class="account-container">
          <h3 class="subheader">Accounts</h3>
          <div v-if="showAccountForm">
            <AccountForm
              @cancel="showAccountForm = false"
              @close-new="addAccountList"
              @close-edit="editAccountList"
              :formType="accountFormType"
              :expense="expense"
              :account="editAccount"
            />
          </div>
          <div v-else class="account-box">
            <div v-if="userStore.accounts.length > 0">
              <button
                class="btn btn-success"
                v-if="!showAccountForm"
                @click="onNewAcct"
              >
                Add New Account
              </button>
              <section class="accordion-container">
                <div
                  class="accordion"
                  id="account-accordion"
                  v-for="(account, i) in userStore.accounts"
                  :key="account.id"
                >
                  <div class="accordion-item">
                    <h2 class="accordion-header" :id="`heading${i}`">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-toggle="collapse"
                        :data-target="`#collapse${i}`"
                        :aria-controls="`collapse${i}`"
                      >
                        {{ account.name.toUpperCase() }}
                      </button>
                    </h2>
                    <div
                      :id="`collapse${i}`"
                      class="accordion-collapse collapse"
                      :aria-labelledby="`heading${i}`"
                      data-parent="account-accordion"
                    >
                      <div class="accordion-body">
                        <AccountBox :account="account" @edit="onEditAcct" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div v-else>
              <div class="content">
                <div class="nada">
                  <p>No accounts found.</p>
                  <button
                    class="btn btn-success"
                    @click="showAccountForm = true"
                  >
                    Add New Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
    <div class="spinner-container" v-else>
      <div class="spinner-border text-success loading-spinner" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h1>Loading...</h1>
    </div>
  </section>
</template>

<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

import MasterList from "../components/MasterList.vue";
import AccountBox from "../components/AccountBox.vue";
import AccountForm from "../components/AccountForm.vue";
import { useUserStore } from "../stores/UserStore";
import { defineComponent } from "vue";
import { type Expense } from "../types";
import { type Account } from "../types";

export default defineComponent({
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  components: {
    MasterList,
    AccountBox,
    AccountForm,
  },
  data() {
    return {
      userStore: useUserStore(),
      expense: {} as Expense,
      showAccountForm: false,
      editAccount: {
        id: "",
        name: "",
        start: 0,
        total: 0,
        end: 0,
        expenses: [] as Expense[],
      } as Account,
      accountFormType: "new",
    };
  },
  methods: {
    addExpense(expense: Expense) {
      this.expense = expense;
    },
    async addAccountList() {
      this.showAccountForm = false;
      await this.userStore.fill(this.user.sub);
    },
    async editAccountList() {
      this.showAccountForm = false;
      await this.userStore.fill(this.user.sub);
    },
    onNewAcct() {
      this.showAccountForm = true;
      this.expense = {} as Expense;
      this.accountFormType = "new";
      this.editAccount = {
        id: "",
        name: "",
        start: 0,
        total: 0,
        end: 0,
        expenses: [] as Expense[],
      } as Account;
    },
    onEditAcct(accountData: Account) {
      this.expense = {} as Expense;
      this.accountFormType = "edit";
      this.editAccount = accountData;
      this.showAccountForm = true;
    },
  },
  async mounted() {
    await this.userStore.fill(this.user.sub);
  },
});
</script>

<style scoped>
.account-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.master-list-container {
  min-width: 200px;
  width: 40%;
  margin: 50px;
  border-radius: 15px;
  border: 2px solid black;
  background-color: var(--green-bg);
  padding: 30px;
  height: fit-content;
}

.link-adjust {
  margin-bottom: 20px;
  text-align: center;
  color: var(--text-color);
}

.content {
  height: 100%;
  padding: 35% 0px;
}

.nada {
  font-size: large;
  align-items: center;
}

.nada p {
  margin-bottom: 10px;
}

.account-box {
  margin: 20px auto;
}

.account-container {
  min-width: 400px;
  width: 40%;
  background-color: var(--white-black);
  color: var(--text-color);
  border-radius: 15px;
  margin: 50px;
  text-align: center;
  border: 2px solid black;
  padding: 30px;
}

.accordion-container {
  margin: 20px auto;
}

.subheader {
  color: var(--text-color);
}

.accordion-button:focus,
.accordion-button:focus-visible {
  border-color: var(--med-green);
  box-shadow: none;
}

.accordion-button:not(.collapsed) {
  background-color: var(--green-bg);
  border-color: var(--med-green);
  color: var(--text-color);
  border: 1px solid var(--black-white);
}

.accordion-button.collapsed,
.accordion-body {
  background-color: var(--white-black);
  color: var(--text-color);
  border: 1px solid var(--black-white);
}

.accordion {
  --bs-accordion-btn-icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='green'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
  --bs-accordion-btn-active-icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='green'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
}

.small-spinner-container {
  margin: 50px;
  text-align: center;
  margin: 0px auto;
}

#submit-btn,
.loading-spinner {
  margin: 20px;
}
</style>
