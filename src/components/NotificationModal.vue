<template>
  <div class="notifications">
    <h5>Here's a list of expenses coming up this week:</h5>
    <div class="master-list-container">
      <MasterList pageType="notifications-noML-dateStr" :expenses="expenseList" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import MasterList from "../components/MasterList.vue";
import { useUserStore } from "../stores/UserStore";
import { type Expense } from "../types";

export default defineComponent({
  props: {
    frequency: { type: String, required: true },
  },
  components: {
    MasterList,
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseList: [] as Expense[],
      date: new Date().toLocaleDateString(),
    };
  },
  methods: {
    async getExpenses(): Promise<any> {
      const params = `date=${this.date};frequency=${this.frequency}`;
      if (this.userStore.dbUserId) {
        await this.userStore
          .getExpenses(params)
          .then((res) => {
            this.expenseList = res.data;
            this.userStore.addConvertedDates(this.expenseList, this.date);
            this.userStore.sortExpenseDateList(this.expenseList);
          })
          .catch((err) => console.log(err));
      }
    },
  },
  mounted() {
    this.getExpenses();
  },
});
</script>

<style scoped>
.notifications {
  text-align: center;
}
.master-list-container {
  width: 75%;
  margin: auto;
}
@media (max-width: 1024px) {
  .master-list-container {
    width: 90%;
    font-size: 1rem;
  }
}
</style>
