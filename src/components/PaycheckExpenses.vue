<template>
  <main class="main-card">
    <div class="card-header">
      <button class="arrow-btn btn" @click="changeDate('previous')">
        <img src="../components/icons/arrow-left.png" alt="left-arrow" class="arrow-img" />
      </button>
      <div v-if="loading" class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h2 class="subheader" v-else>{{ paycheck }}</h2>
      <button class="arrow-btn btn" @click="changeDate('next')">
        <img src="../components/icons/arrow-right.png" alt="right-arrow" class="arrow-img" />
      </button>
    </div>

    <div class="expense-list">
      <MasterList pageType="paycheckList-noML-dateStr" :expenses="expenseList" />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import MasterList from "./MasterList.vue";
import { useUserStore } from "../stores/UserStore";
import { type Expense } from "../types";

export default defineComponent({
  props: {
    number: { type: Number, required: true },
  },
  components: {
    MasterList,
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseList: [] as Expense[],
      paycheck: "",
      loading: false,
    };
  },
  computed: {
    paychecks() {
      return this.number === 1 ? this.userStore.paychecks : this.userStore.paychecks2;
    },
  },
  watch: {
    paycheck: function () {
      this.getExpenses();
    },
  },
  methods: {
    formatDate(dateStr: string) {
      return this.userStore.formatDays(new Date(dateStr));
    },
    changeDate(direction: string) {
      let pIndex = this.number === 1 ? this.userStore.pIndex : this.userStore.pIndex2;
      if (direction === "next") {
        if (pIndex < this.userStore.paychecks.length - 1) {
          pIndex++;
          this.paycheck = this.formatDate(this.paychecks[pIndex].date);
        }
      } else {
        if (pIndex > 0) {
          pIndex--;
          this.paycheck = this.formatDate(this.paychecks[pIndex].date);
        }
      }

      if (this.number === 1) {
        this.userStore.pIndex = pIndex;
      } else if (this.number === 2) {
        this.userStore.pIndex2 = pIndex;
      }
    },
    async getExpenses() {
      const payFreq = this.number === 1 ? this.userStore.payFreq : this.userStore.payFreq2;
      const params = `date=${this.paycheck};frequency=${payFreq}`;
      let pIndex = this.number === 1 ? this.userStore.pIndex : this.userStore.pIndex2;

      await this.userStore
        .getExpenses(params)
        .then((res) => {
          this.expenseList = res.data;
          this.userStore.addConvertedDates(this.expenseList, this.paycheck);
          this.userStore.sortExpenseDateList(this.expenseList);
          this.$emit(`dateChange${this.number}`, { num: this.number, list: this.expenseList, paycheckId: this.paychecks[pIndex].id });
        })
        .catch((err) => console.log(err));
    },
  },
  mounted() {
    let pIndex = this.number === 1 ? this.userStore.pIndex : this.userStore.pIndex2;
    this.loading = true;
    this.paycheck = this.formatDate(this.paychecks[pIndex].date);
    this.getExpenses();
    this.loading = false;
  },
});
</script>

<style scoped>
.card-header {
  text-align: center;
  display: flex;
  justify-content: center;
  background-color: var(--white-black);
  color: var(--text-color);
}

.subheader {
  text-align: center;
  width: 200px;
}

.arrow-btn {
  height: 35px;
  width: 35px;
  margin: 0 5px;
  color: white;
  padding: 0px;
  background-color: white;
}

.arrow-btn:hover {
  background-color: rgb(204, 206, 204);
  outline: 2px solid var(--med-green);
}

.arrow-img {
  height: 25px;
  width: 25px;
  color: white;
}

.loading {
  color: var(--text-color);
}

.expense-table {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  border: 2px solid var(--black-white);
  color: var(--text-color);
  background-color: var(--white-black);
}

.expense-table-header {
  font-weight: bold;
  border: 2px solid var(--black-white);
  background-color: var(--med-green);
  color: white;
}

.every-other {
  background-color: var(--green-bg);
}

.pay-info-table {
  margin-top: 20px;
}

.input-info {
  width: 150px;
  border-radius: 5px;
  border: 2px solid black;
  padding: 0 5px;
}
</style>
