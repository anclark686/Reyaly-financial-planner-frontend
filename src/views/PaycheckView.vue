<template>
  <section class="page-content">
    <main class="paycheck-container" v-if="!userStore.loading">
      <header>
        <h1 class="page-header">Paycheck View</h1>
      </header>
      <section>
        <div class="card">
          <PaycheckExpenses
            v-if="showPaycheckCard && userStore.income === 1"
            :number="1"
            @dateChange1="sendExpenseList"
          />
          <PaycheckInfo
            v-if="showPaycheckCard && userStore.income === 1"
            :number="1"
            :expenseList="expenseList1"
          />

          <section
            v-else-if="showPaycheckCard && userStore.income === 2"
            class="accordion-container"
          >
            <div class="accordion" id="account-accordion">
              <div class="accordion-item">
                <h2 class="accordion-header" id="heading1">
                  <button
                    class="accordion-button collapsed accordion-header"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapse1"
                    aria-controls="collapse1"
                  >
                    Paycheck 1
                  </button>
                </h2>
                <div
                  id="collapse1"
                  class="accordion-collapse collapse"
                  aria-labelledby="heading1"
                  data-parent="account-accordion"
                >
                  <div class="accordion-body">
                    <PaycheckExpenses :number="1" @dateChange1="sendExpenseList" />
                    <PaycheckInfo :number="1" :expenseList="expenseList1" />
                  </div>
                </div>
              </div>
            </div>

            <div class="accordion" id="account-accordion">
              <div class="accordion-item">
                <h2 class="accordion-header" id="heading2">
                  <button
                    class="accordion-button collapsed accordion-header"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapse2"
                    aria-controls="collapse2"
                  >
                    Paycheck 2
                  </button>
                </h2>
                <div
                  id="collapse2"
                  class="accordion-collapse collapse"
                  aria-labelledby="heading2"
                  data-parent="account-accordion"
                >
                  <div class="accordion-body">
                    <PaycheckExpenses :number="2" @dateChange2="sendExpenseList" />
                    <PaycheckInfo :number="2" :expenseList="expenseList2" />
                  </div>
                </div>
              </div>
            </div>

            <div class="accordion" id="account-accordion">
              <div class="accordion-item">
                <h2 class="accordion-header" id="heading2">
                  <button
                    class="accordion-button collapsed accordion-header"
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapse3"
                    aria-controls="collapse3"
                  >
                    Combined Info
                  </button>
                </h2>
                <div
                  id="collapse3"
                  class="accordion-collapse collapse"
                  aria-labelledby="heading3"
                  data-parent="account-accordion"
                >
                  <div class="accordion-body">
                    <PaycheckExpenses :number="3" @dateChange2="sendExpenseList" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
    <div class="spinner-container" v-else>
      <div class="spinner-border text-success loading-spinner" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h1 class="loading">Loading...</h1>
    </div>
  </section>
</template>

<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { defineComponent } from "vue";

import PaycheckExpenses from "../components/PaycheckExpenses.vue";
import PaycheckInfo from "../components/PaycheckInfo.vue";
import CombinedPay from "../components/CombinedPay.vue";
import { useUserStore } from "../stores/UserStore";
import { type Expense } from "../types";

export default defineComponent({
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  components: {
    PaycheckExpenses,
    PaycheckInfo,
    CombinedPay,
  },
  data() {
    return {
      userStore: useUserStore(),
      showPaycheckCard: false,
      expenseList1: [] as Expense[],
      expenseList2: [] as Expense[],
    };
  },
  methods: {
    sendExpenseList({ num, list }: { num: number; list: Expense[] }) {
      console.log(num);
      console.log(list);
      if (num === 1) {
        this.expenseList1 = list;
      } else {
        this.expenseList2 = list;
      }
    },
  },
  async mounted() {
    await this.userStore.fill(this.user.sub);
    this.showPaycheckCard = true;
  },
});
</script>

<style scoped>
.card {
  width: 50%;
  margin: 20px auto;
  background-color: var(--white-black);
  color: var(--text-color);
}

.card-header {
  text-align: center;
  display: flex;
  justify-content: center;
}

.arrow-btn {
  height: 35px;
  width: 35px;
  margin: 0 5px;
  color: white;
  padding: 0px;
  background-color: #f9f9f9;
}

.arrow-img {
  height: 25px;
  width: 25px;
  color: white;
}

.loading {
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

@media (max-width: 1024px) {
  .page-header {
    font-size: 2.5rem;
  }
  .subheader {
    font-size: 2rem;
  }
  .card {
    width: 95%;
    font-size: 1rem;
  }
}
</style>
