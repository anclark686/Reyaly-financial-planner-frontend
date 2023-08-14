<template>
  <section class="page-content">
    <main class="settings-container" v-if="!userStore.loading && !userStore.error">
      <header>
        <h1 class="page-header">Settings</h1>
      </header>

      <section class="settings-content">
        <div class="master-list-container">
          <MasterList pageType="settings" :expenses="userStore.expenses" />
        </div>

        <div class="form-container">
          <SettingsForm v-if="userStore.pay" formType="update" :userInfo="userInfo" />
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
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

import MasterList from "../components/MasterList.vue";
import SettingsForm from "../components/SettingsForm.vue";
import ErrorComponent from "../components/ErrorComponent.vue";
import { useUserStore } from "../stores/UserStore";
import { type User } from "../types";

export default defineComponent({
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  components: {
    SettingsForm,
    MasterList,
    ErrorComponent,
  },
  data() {
    return {
      userStore: useUserStore(),
    };
  },
  computed: {
    userInfo() {
      const userInfo = {
        residence: this.userStore.residence,
        relationship: this.userStore.relationship,
        pay: this.userStore.pay,
        rate: this.userStore.payRate,
        frequency: this.userStore.payFreq,
        hours: this.userStore.hours,
        date: this.userStore.date,
        deductions: this.userStore.deductions,
        income: this.userStore.income,
        pay2: this.userStore.pay2,
        rate2: this.userStore.payRate2,
        frequency2: this.userStore.payFreq2,
        hours2: this.userStore.hours2,
        date2: this.userStore.date2,
        deductions2: this.userStore.deductions2,
      } as User;
      return userInfo;
    },
  },
  async mounted() {
    await this.userStore.fill(this.user.sub);
  },
});
</script>

<style scoped>
.settings-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.master-list-container {
  min-width: 400px;
  width: 40%;
  margin: 50px;
  border-radius: 15px;
  border: 2px solid black;
  background-color: var(--green-bg);
  padding: 30px;
  height: fit-content;
}

.form-container {
  min-width: 400px;
  width: 40%;
  background-color: var(--white-black);
  border-radius: 15px;
  margin: 50px;
  text-align: center;
  border: 2px solid black;
  padding: 30px;
  text-align: left;
  height: fit-content;
}

.loading {
  color: var(--text-color);
}

@media (max-width: 1024px) {
  .page-header {
    font-size: 2.5rem;
  }

  .master-list-container {
    width: 90%;
    margin: 20px;
  }

  .form-container {
    width: 90%;
    margin: 20px;
  }
}
@media (max-width: 600px) {
  .master-list-container {
    padding: 10px;
  }
  .form-container {
    font-size: 1.25rem;
    padding: 10px;
  }
}
</style>
