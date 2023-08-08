<template>
  <div class="notifications">
    <h5>Here's a list of expenses coming up this week:</h5>
    <div class="master-list-container">
      <MasterList pageType="accountNotifications" :expenses="expenseList" />
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
    date: { type: String, required: true },
    frequency: { type: String, required: true },
  },
  components: {
    MasterList,
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseList: [] as Expense[],
    };
  },
  methods: {
    async getPaychecks() {
      const params = `date=${this.date};frequency=${this.frequency}`;
      if (this.userStore.dbUserId) {
        await this.userStore
          .getPaychecks(params)
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
    this.getPaychecks();
  },
});
</script>

<style scoped>
.notifications {
  text-align: center;
}
.master-list-container {
  width: 50%;
  margin: auto;
}
@media (max-width: 1000px) {
  .master-list-container {
    width: 90%;
    font-size: 1rem;
  }
}
</style>
