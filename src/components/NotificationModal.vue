<template>
  <div class="notifications">
    <div class="expenses-found" v-if="expenseList.length > 0">
      <p>Here's a list of expenses coming up this week:</p>
    <div class="master-list-container">
      <MasterList pageType="notifications-noML-dateStr" :expenses="expenseList" />
    </div>
    <p class="link-adjust">
      Click
      <RouterLink to="/views/calendar">here</RouterLink>
      to view a full calendar of expenses.
    </p>
    </div>
    <div class="nada" v-else>
      <p>🎉 No upcoming expenses for this week! 🎉</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

import MasterList from "../components/MasterList.vue";
import { useUserStore } from "../stores/UserStore";
import { type Expense } from "../types";

export default defineComponent({
  props: {
    frequency: { type: String, required: true },
  },
  components: {
    MasterList,
    RouterLink,
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

.link-adjust {
  padding-bottom: 10px;
}

.nada {
  padding-bottom: 20px;
}

@media (max-width: 1024px) {
  .master-list-container {
    width: 90%;
    font-size: 1rem;
  }
}
</style>
