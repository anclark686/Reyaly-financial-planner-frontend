<template>
  <div>
    <header>
      <h1 class="page-header">Settings</h1>
    </header>

    <div class="settings-content">
      <div class="master-list-container">
        <div class="master-list">
          <h3>Master List</h3>
        </div>

      </div>

      <div class="form-container">
        <SettingsForm formType="update"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import { useUserStore } from "../stores/UserStore";
import { useAuth0 } from "@auth0/auth0-vue";
import Axios from "axios";

import SettingsForm from '../components/SettingsForm.vue';

// const userStore = useUserStore();

export default {
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  components: {
    SettingsForm
  },
  methods: {

  }
};
</script>

<style scoped>
.settings-content {
  display: flex;
  justify-content: space-around;
}

.master-list {
  width: 75%;
  margin: 50px auto;
  background-color: aquamarine;
}

.form-container {
  min-width: 200px;
  width: 40%;
  background-color: white;
  border-radius: 15px;
  margin: 70px 50px;
  text-align: center;
  border: 2px solid black;
  padding: 30px;
  text-align: left;
}

</style>
