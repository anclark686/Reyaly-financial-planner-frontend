<template>
  <section class="page-content">
    <main class="paycheck-container" v-if="!userStore.loading && !userStore.error">
      <header>
        <h1 class="page-header">Paycheck View</h1>
      </header>
      <section>
        <div class="single-container card" v-if="showPaycheckCard && userStore.income === 1">
          <PaycheckExpenses :number="1" @dateChange1="sendExpenseList" />

          <div class="ote-container">
            <OTETable
              :paycheckId="paycheckId1"
              :number="1"
              :possChange="possChange"
              @newTotal="updateOTEtotal"
              @possChange="handleChange"
            />
          </div>

          <PaycheckInfo :number="1" :expenseList="expenseList1" :oteTotal="oteTotal1" />
        </div>

        <div class="double" v-else-if="showPaycheckCard && userStore.income === 2">
          <div class="double-container card">
            <PaycheckExpenses :number="1" @dateChange1="sendExpenseList" />

            <div class="ote-container">
              <OTETable
                :paycheckId="paycheckId1"
                :number="1"
                :possChange="possChange"
                @newTotal="updateOTEtotal"
                @possChange="handleChange"
              />
            </div>

            <PaycheckInfo :number="1" :expenseList="expenseList1" :oteTotal="oteTotal1" />
          </div>

          <div class="double-container card">
            <PaycheckExpenses :number="2" @dateChange2="sendExpenseList" />

            <div class="ote-container">
              <OTETable
                :paycheckId="paycheckId2"
                :number="2"
                :possChange="possChange"
                @newTotal="updateOTEtotal"
                @possChange="handleChange"
              />
            </div>

            <PaycheckInfo :number="2" :expenseList="expenseList2" :oteTotal="oteTotal2" />
          </div>
          <div class="combined-container card">
            <CombinedPay />
          </div>
        </div>
      </section>
    </main>
    <div class="spinner-container" v-if="userStore.loading">
      <div class="spinner-border text-success loading-spinner" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h1 class="loading">Loading...</h1>
    </div>
    <div class="error-container" v-if="userStore.error">
      <ErrorComponent />
    </div>
  </section>
</template>

<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { defineComponent } from "vue";

import PaycheckExpenses from "../components/PaycheckExpenses.vue";
import PaycheckInfo from "../components/PaycheckInfo.vue";
import OTETable from "../components/OTETable.vue";
import CombinedPay from "../components/CombinedPay.vue";
import ErrorComponent from "../components/ErrorComponent.vue";
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
    OTETable,
    ErrorComponent,
  },
  data() {
    return {
      userStore: useUserStore(),
      paycheckId1: "",
      paycheckId2: "",
      oteTotal1: 0,
      oteTotal2: 0,
      num: 1,
      possChange: false,
      showPaycheckCard: false,
      expenseList1: [] as Expense[],
      expenseList2: [] as Expense[],
    };
  },
  methods: {
    updateOTEtotal({ total, num }: { total: number; num: number }) {
      if (num === 1) {
        this.oteTotal1 = total;
      } else {
        this.oteTotal2 = total;
      }
    },
    sendExpenseList({
      num,
      list,
      paycheckId,
    }: {
      num: number;
      list: Expense[];
      paycheckId: string;
    }) {
      if (num === 1) {
        this.paycheckId1 = paycheckId;
      } else {
        this.paycheckId2 = paycheckId;
      }

      this.num = num;

      if (num === 1) {
        this.expenseList1 = list;
      } else {
        this.expenseList2 = list;
      }
    },
    handleChange(bool: boolean) {
      this.possChange = bool;
    },
  },
  async mounted() {
    await this.userStore.fill(this.user.sub);
    this.showPaycheckCard = true;
    this.paycheckId1 = this.userStore.paychecks[this.userStore.pIndex].id;
    this.paycheckId2 = this.userStore.paychecks2[this.userStore.pIndex2].id;
  },
});
</script>

<style scoped>
.single-container {
  width: 50%;
  margin: 20px auto;
  background-color: var(--white-black);
  color: var(--text-color);
}

.double {
  display: flex;
  flex-wrap: wrap;
}

.double-container {
  width: 40%;
  margin: 20px auto;
  height: fit-content;
}

.ote-container {
  margin: auto;
  width: 100%;
}

.combined-container {
  width: 75%;
  margin: 20px auto;
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
