<template>
  <section class="page-content">
    <main class="settings-container" v-if="!userStore.loading">
      <header>
        <h1 class="page-header">Settings</h1>
      </header>

      <section class="settings-content">
        <div class="master-list-container">
          <MasterList pageType="settings" :expenses="userStore.expenses" />
        </div>

        <div class="form-container">
          <SettingsForm
            v-if="userStore.pay"
            formType="update"
            :pay="userStore.pay"
            :rate="userStore.payRate"
            :frequency="userStore.payFreq"
            :hours="userStore.hours"
            :date="userStore.date"
            :deductions="userStore.deductions"
            :residence="userStore.residence"
            :relationship="userStore.relationship"
          />
        </div>
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
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

import MasterList from "../components/MasterList.vue";
import SettingsForm from "../components/SettingsForm.vue";
import { useUserStore } from "../stores/UserStore";

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
  },
  data() {
    return {
      userStore: useUserStore(),
    };
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

@media (max-width: 1000px) {
  .master-list-container {
    width: 90%;
    margin: 20px;
    padding: 10px;
  }

  .form-container {
    width: 90%;
    margin: 20px;
    padding: 10px;
  }
}
</style>
