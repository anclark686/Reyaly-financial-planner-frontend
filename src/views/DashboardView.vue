<template>
  <main class="dashboard">
    <h1 class="page-header">Dashboard</h1>
    <section class="main-dashboard">
      <section class="view-boxes">
        <RouterLink to="/views/calendar" class="view-box">
          <h2>Calendar View</h2>
        </RouterLink>

        <RouterLink to="/views/paycheck" class="view-box">
          <h2>Paycheck View</h2>
        </RouterLink>

        <RouterLink to="/views/paycheck" class="view-box">
          <h2>Account View</h2>
        </RouterLink>
      </section>
      <section class="settings-container">
        <div class="user-info" v-if="userInfo">
          <h3 class="subheader">User Info:</h3>

          <table class="info-table">
            <tbody>
              <tr class="odd">
                <td class="left">
                  <strong>Username:</strong>
                </td>
                <td class="right">
                  {{ user.nickname }}
                </td>
              </tr>
              <tr class="even">
                <td class="left">
                  <strong>Pay:</strong>
                </td>
                <td class="right">
                  ${{ userInfo.pay }}
                  {{ userInfo.pay_rate === "hourly" ? "/hr" : "/year" }}
                </td>
              </tr>
              <tr class="odd">
                <td class="left">
                  <strong>Pay Frequency:</strong>
                </td>
                <td class="right">
                  {{ userInfo.pay_freq }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="link-adjust">
          Click
          <RouterLink to="/settings">here</RouterLink>
          to adjust your settings.
        </p>
      </section>
    </section>
    <button @click="handleFormClick">showModal</button>
    <div v-if="showUserForm" @close="showUserForm = false" class="form-modal">
      <h2 id="welcome">Welcome {{ user.name }}!</h2>
      <div class="instructions">
        <h5>Looks like it's your first time here!</h5>
        <h5>Enter the info below to get started.</h5>
      </div>
      <SettingsForm formType="new" />
      <button @click="handleFormClick">Close Modal</button>
    </div>
  </main>
</template>

<script lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";
import Axios from "axios";

import SettingsForm from "../components/SettingsForm.vue";

export default {
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  data() {
    return {
      showUserForm: false,
      userInfo: { pay: 0, pay_rate: "", pay_freq: "" },
    };
  },
  components: {
    SettingsForm,
  },
  methods: {
    getDBUserInfo() {
      Axios.get(`http://127.0.0.1:3000/users/?uid=${this.user.sub}`)
        .then((res) => {
          const data = res.data;
          console.log(res.data);
          if (data.message !== "Not Found") {
            console.log(res.data);
            this.userInfo = res.data.data[0];
          } else {
            this.showUserForm = true;
          }
        })
        .catch((err) => console.log(err));
    },
    handleFormClick() {
      this.showUserForm = !this.showUserForm;
      console.log(this.showUserForm);
    },
  },
  mounted() {
    this.getDBUserInfo();
  },
};
</script>

<style scoped>
.main-dashboard {
  display: flex;
  justify-content: space-around;
}
.view-boxes {
  width: 50%;
  margin: 50px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.view-box {
  background-color: var(--med-green);
  min-width: 200px;
  width: 40%;
  height: 100px;
  text-align: center;
  border-radius: 15px;
  border: 2px solid black;
  color: var(--dk-green);
  margin: 20px;
  text-decoration: none;
}

.view-box:hover {
  background-color: #26c67b;
}

.view-box h2 {
  margin: auto;
  padding: 27px;
  color: white;
  text-decoration: none;
}

.settings-container {
  min-width: 200px;
  width: 40%;
  background-color: white;
  border-radius: 15px;
  margin: 70px 50px;
  text-align: center;
  border: 2px solid black;
}

.user-info {
  margin: 50px;
}

.subheader {
  margin: 10px;
}

.info-table {
  width: 75%;
  margin: 20px auto;
  font-size: larger;
  border: 2px solid black;
}

.info-table td {
  border: 2px solid black;
}

.left {
  text-align: left;
  padding: 10px;
}

.right {
  text-align: right;
  padding: 10px;
}

.even {
  background-color: var(--lt-green);
}

.form-modal {
  width: 50%;
  height: 50%;
  background-color: var(--lt-green);
  position: absolute;
  border-radius: 5px;
  top: 25%;
  left: 25%;
  text-align: center;
  padding: 20px;
  border: solid 2px var(--dk-green);
  border-radius: 10px;
  overflow-y: auto;
}

#welcome {
  margin: 20px;
}

.instructions {
  margin-bottom: 20px;
}
</style>
