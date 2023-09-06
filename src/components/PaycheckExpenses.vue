<template>
  <main class="main-card">
    <div class="card-header">
      <button class="arrow-btn btn" @click="checkModify('previous')">
        <img src="../components/icons/arrow-left.png" alt="left-arrow" class="arrow-img" />
      </button>
      <div v-if="loading" class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h2 class="subheader" v-else>{{ paycheck }}</h2>
      <button class="arrow-btn btn" @click="checkModify('next')">
        <img src="../components/icons/arrow-right.png" alt="right-arrow" class="arrow-img" />
      </button>
    </div>

    <div class="btn-container" v-if="modify === false">
      <button class="btn btn-success" @click="modify = true">Modify Expenses</button>
    </div>
    <div class="btn-container" v-else>
      <button class="btn btn-success" @click="checkModify('')">Close</button>
    </div>

    <div class="expense-list" v-if="expenseList.length > 0">
      <MasterList
        pageType="paycheckList-noML-dateStr"
        :expenses="expenseList"
        :dateStr="paycheck"
        :modify="modify"
        :paycheck="paycheckInfo"
        @changes="changes += 1"
      />
    </div>
    
    <SaveModal
      v-if="showModal"
      @close="showModal = false"
      @continue="handleContinue"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import MasterList from "./MasterList.vue";
import SaveModal from "./SaveModal.vue";
import { useUserStore } from "../stores/UserStore";
import { type Expense } from "../types";
import { type Paycheck } from "../types";

export default defineComponent({
  props: {
    number: { type: Number, required: true },
  },
  components: {
    MasterList,
    SaveModal
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseList: [] as Expense[],
      paycheck: "",
      modify: false,
      direction: "",
      paycheckInfo: {paycheckId: "", date: ""},
      changes: 0,
      showModal: false,
      loading: false,
    };
  },
  computed: {
    paychecks(): Paycheck[] {
      return this.number === 1 ? this.userStore.paychecks : this.userStore.paychecks2;
    },
  },
  watch: {
    paycheck: function () {
      this.getExpenses();
    },
  },
  methods: {
    formatDate(dateStr: string): string {
      return this.userStore.formatDays(new Date(dateStr));
    },
    checkModify(direction: string): void {
      this.direction = direction
      if (this.modify && this.changes) {
        this.showModal = true;
      } else {
        this.handleContinue()
      }
    },
    handleContinue(): void {
      this.modify = false
      this.changes = 0
      this.showModal = false;
      console.log(this.expenseList)
      if (this.direction) {
        this.changeDate()
      } 
      this.getExpenses();
    },
    changeDate(): void {
      let pIndex = this.number === 1 ? this.userStore.pIndex : this.userStore.pIndex2;
      if (this.direction === "next") {
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
    async getExpenses(): Promise<any> {
      const payFreq = this.number === 1 ? this.userStore.payFreq : this.userStore.payFreq2;
      const params = `date=${this.paycheck};frequency=${payFreq}`;
      let pIndex = this.number === 1 ? this.userStore.pIndex : this.userStore.pIndex2;

      await this.userStore
        .getExpenses(params)
        .then((res) => {
          this.expenseList = res.data;
          this.userStore.addConvertedDates(this.expenseList, this.paycheck);
          this.userStore.sortExpenseDateList(this.expenseList);
          this.$emit(`dateChange${this.number}`, {
            num: this.number,
            list: this.expenseList,
            paycheckId: this.paychecks[pIndex].id,
          });
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
.main-card {
  background-color: var(--white-black);
  color: var(--text-color);
}

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

.arrow-btn:focus {
  box-shadow: 0 0 0 0.2rem var(--med-green);
}

.arrow-img {
  height: 25px;
  width: 25px;
  color: white;
}

.btn-container {
  margin:  20px auto 0 auto;
  text-align: center;
}

.expense-list {
  background-color: var(--white-black);
}
</style>
