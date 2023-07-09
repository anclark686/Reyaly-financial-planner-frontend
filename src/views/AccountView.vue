<template>
  <div>
    <header>
      <h1 class="page-header">Account View</h1>
    </header>
    <div class="account-content">
      <div class="master-list-container">
        <MasterList pageType="account" :expenses="userStore.expenses" />
        <p class="link-adjust">
          Click
          <RouterLink to="/settings">here</RouterLink>
          to adjust your settings, and add expenses.
        </p>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

import MasterList from "../components/MasterList.vue";
import { useUserStore } from "../stores/UserStore";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  components: {
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
  min-width: 200px;
  width: 40%;
  margin: 50px;
  border-radius: 15px;
  border: 2px solid black;
  background-color: var(--green-bg);
  padding: 30px;
}

.link-adjust {
  margin-bottom: 20px;
  text-align: center;
}
</style>
