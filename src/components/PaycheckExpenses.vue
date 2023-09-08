<template>
  <main class="main-card">
    <div class="card-header">
      <button class="arrow-btn btn" @click="checkModify('previous')">
        <img src="../components/icons/arrow-left.png" alt="left-arrow" class="arrow-img" />
      </button>
      <div v-if="loading" class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h2 class="subheader" v-else>{{ prettyDate }}</h2>
      <button class="arrow-btn btn" @click="checkModify('next')">
        <img src="../components/icons/arrow-right.png" alt="right-arrow" class="arrow-img" />
      </button>
    </div>

    <div class="btn-container" v-if="!modify">
      <button class="btn btn-success" @click="modify = true">Modify Expenses</button>
    </div>
    <div class="btn-container" v-else>
      <button class="btn btn-success" @click="checkModify('')">Close</button>
      <button class="btn btn-success" @click="checkRevert()" v-if="ableToRevert">
        Revert to Original
      </button>
    </div>

    <div class="expense-list" v-if="expenseList.length > 0">
      <MasterList
        pageType="paycheckList-noML-dateStr"
        :expenses="expenseList"
        :dateStr="prettyDate"
        :modify="modify"
        :paycheck="paycheck"
        @changes="changes += 1"
        @saved="handleSave"
      />
    </div>

    <SureModal
      v-if="showModal"
      :type="modalType"
      @close="showModal = false"
      @continue="handleContinue"
      name=""
    />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import MasterList from "./MasterList.vue";
import SureModal from "./SureModal.vue";

import { useUserStore } from "../stores/UserStore";
import { type Expense } from "../types";
import { type Paycheck } from "../types";
import { type SavedPaycheck } from "../types";

export default defineComponent({
  props: {
    number: { type: Number, required: true },
  },
  components: {
    MasterList,
    SureModal,
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseList: [] as Expense[],
      paycheck: {} as Paycheck,
      prettyDate: "",
      modify: false,
      direction: "",
      changes: 0,
      ableToRevert: false,
      showModal: false,
      modalType: "",
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
    checkRevert() {
      this.modalType = "revert";
      this.showModal = true;
    },
    checkModify(direction: string): void {
      this.direction = direction;
      if (this.modify && this.changes) {
        this.modalType = "save";
        this.showModal = true;
      } else {
        this.handleContinue();
      }
    },
    handleContinue(): void {
      if (this.direction) {
        this.changeDate();
      } else if (this.modalType === "revert") {
        this.revertExpenses();
      }
      this.modify = false;
      this.changes = 0;
      this.showModal = false;
      this.modalType = "";
      this.getExpenses();
    },
    async revertExpenses(): Promise<any> {
      console.log(this.userStore.savedPaychecks[this.paycheck.id].id);
      await this.userStore
        .deleteSavedPaycheck(this.paycheck.id, this.userStore.savedPaychecks[this.paycheck.id].id)
        .then((res) => {
          console.log("deleted");
          delete this.userStore.savedPaychecks[this.paycheck.id];
          this.getExpenses();
        })
        .catch((err) => console.log(err));
    },
    changeDate(): void {
      let pIndex = this.number === 1 ? this.userStore.pIndex : this.userStore.pIndex2;
      if (this.direction === "next") {
        if (pIndex < this.userStore.paychecks.length - 1) {
          pIndex++;
          this.paycheck = this.paychecks[pIndex];
          this.prettyDate = this.formatDate(this.paycheck.date);
        }
      } else {
        if (pIndex > 0) {
          pIndex--;
          this.paycheck = this.paychecks[pIndex];
          this.prettyDate = this.formatDate(this.paycheck.date);
        }
      }

      if (this.number === 1) {
        this.userStore.pIndex = pIndex;
      } else if (this.number === 2) {
        this.userStore.pIndex2 = pIndex;
      }
      this.direction = "";
    },
    async getExpenses(): Promise<any> {
      const payFreq = this.number === 1 ? this.userStore.payFreq : this.userStore.payFreq2;
      const params = `date=${this.prettyDate};frequency=${payFreq}`;
      let pIndex = this.number === 1 ? this.userStore.pIndex : this.userStore.pIndex2;

      if (Object.keys(this.userStore.savedPaychecks).includes(this.paycheck.id)) {
        this.ableToRevert = true;
        await this.userStore
          .getSavedPaycheck(this.paycheck.id)
          .then((res) => {
            this.expenseList = res.data.expenses;
            this.paycheck.savedPaycheck = this.userStore.savedPaychecks[this.paycheck.id].id;
            console.log(this.paycheck);
            for (const expense of this.expenseList) {
              expense.dateObj = new Date(expense.dateStr!);
            }
            console.log(this.expenseList);
            this.userStore.sortExpenseDateList(this.expenseList);
            this.$emit(`dateChange${this.number}`, {
              num: this.number,
              list: this.expenseList,
              paycheckId: this.paychecks[pIndex].id,
            });
          })
          .catch((err) => console.log(err));
      } else {
        this.ableToRevert = false;
        await this.userStore
          .getExpenses(params)
          .then((res) => {
            this.expenseList = res.data;
            this.userStore.addConvertedDates(this.expenseList, this.prettyDate);
            this.userStore.sortExpenseDateList(this.expenseList);
            this.$emit(`dateChange${this.number}`, {
              num: this.number,
              list: this.expenseList,
              paycheckId: this.paychecks[pIndex].id,
            });
          })
          .catch((err) => console.log(err));
      }
    },
    handleSave(): void {
      this.modify = false;
      this.changes = 0;
      this.showModal = false;
    },
  },
  mounted() {
    this.userStore.nextPayDay;
    let pIndex = this.number === 1 ? this.userStore.pIndex : this.userStore.pIndex2;
    this.loading = true;
    this.paycheck = this.paychecks[pIndex];
    this.prettyDate = this.formatDate(this.paycheck.date);
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
  margin: 20px auto 0 auto;
  text-align: center;
}

.btn {
  margin: 0 5px;
}

.expense-list {
  background-color: var(--white-black);
}
</style>
