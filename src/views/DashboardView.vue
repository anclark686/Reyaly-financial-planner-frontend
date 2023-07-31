<template>
  <section class="page-content">
    <main class="dashboard" v-if="!userStore.loading">
      <h1 class="page-header">Dashboard</h1>
      <section class="notif-container" v-if="showNotifications === true">
        <div class="notif-header">
          <h2>Notifications</h2>
          <button class="emoji-btn" @click="showNotifications = false">➖</button>
        </div>

        <NotificationModal :date="date" frequency="weekly" />
      </section>
      <section class="notif-container" v-else>
        <div class="notif-header">
          <h2>Notifications</h2>
          <button class="emoji-btn" @click="showNotifications = true">➕</button>
        </div>
      </section>
      <section class="main-dashboard">
        <section class="view-boxes">
          <RouterLink to="/views/calendar" class="view-box">
            <h2>Calendar View</h2>
          </RouterLink>

          <RouterLink to="/views/paycheck" class="view-box">
            <h2>Paycheck View</h2>
          </RouterLink>

          <RouterLink to="/views/account" class="view-box">
            <h2>Account View</h2>
          </RouterLink>

          <RouterLink to="/views/debt" class="view-box">
            <h2>Debt View</h2>
          </RouterLink>

          <RouterLink to="/views/savings" class="view-box">
            <h2>Savings View</h2>
          </RouterLink>

          <button class="view-box" @click="downloadExcel">
            <h2>Export Excel</h2>
          </button>

          <RouterLink to="/views/savings" class="view-box">
            <h2>Currency Converter</h2>
          </RouterLink>
        </section>

        <section class="settings-container">
          <div class="user-info" v-if="userStore.dbUserId">
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
                    ${{ userStore.pay }}
                    {{ userStore.payRate === "hourly" ? "/hr" : "/year" }}
                  </td>
                </tr>
                <tr class="odd">
                  <td class="left">
                    <strong>Pay Frequency:</strong>
                  </td>
                  <td class="right">
                    {{ userStore.payFreq }}
                  </td>
                </tr>
                <tr class="even">
                  <td class="left">
                    <strong>Paycheck Hours:</strong>
                  </td>
                  <td class="right">
                    {{ userStore.hours }}
                  </td>
                </tr>
                <tr class="odd">
                  <td class="left">
                    <strong>Deductions:</strong>
                  </td>
                  <td class="right">${{ userStore.deductions }}</td>
                </tr>

                <tr class="even">
                  <td class="left">
                    <strong>State of Residence:</strong>
                  </td>
                  <td class="right">{{ userStore.residence }}</td>
                </tr>
                <tr class="odd">
                  <td class="left">
                    <strong>Relationship Status:</strong>
                  </td>
                  <td class="right">
                    {{ userStore.relationship === "single" ? "Single" : "Married" }}
                  </td>
                </tr>

                <tr class="even">
                  <td class="left">
                    <strong>Est Take Home:</strong>
                  </td>
                  <td class="right">${{ userStore.estNet }}</td>
                </tr>
                <tr class="odd">
                  <td class="left">
                    <strong># of Expenses:</strong>
                  </td>
                  <td class="right">
                    {{ userStore.expenses.length }}
                  </td>
                </tr>
                <tr class="even">
                  <td class="left">
                    <strong>Expense Total:</strong>
                  </td>
                  <td class="right">${{ userStore.expenseSum }}</td>
                </tr>
                <tr class="odd">
                  <td class="left">
                    <strong>Next Payday:</strong>
                  </td>
                  <td class="right">
                    {{ userStore.nextPayDay }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="link-adjust">
            Click
            <RouterLink to="/settings">here</RouterLink>
            to adjust your settings, and add expenses.
          </p>
        </section>
      </section>
      <div v-if="showUserForm" @close="showUserForm = false" class="form-modal">
        <h2 id="welcome">Welcome {{ user.name }}!</h2>
        <div class="instructions">
          <h5>Looks like it's your first time here!</h5>
          <h5>Enter the info below to get started.</h5>
        </div>
        <SettingsForm formType="new" :userInfo="blankAccount" @close="updateUserInfo" />
      </div>
    </main>
    <div class="spinner-container" v-else>
      <div class="spinner-border text-success loading-spinner spinner-border-lg" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h1 class="loading">Loading...</h1>
    </div>
  </section>
</template>

<script lang="ts">
import { RouterLink } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";
import { defineComponent } from "vue";

import SettingsForm from "../components/SettingsForm.vue";
import NotificationModal from "../components/NotificationModal.vue";
import { useUserStore } from "../stores/UserStore";
import { type User } from "../types";

export default defineComponent({
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  data() {
    return {
      userStore: useUserStore(),
      showUserForm: false,
      showNotifications: true,
      date: new Date().toLocaleDateString(),
      blankAccount: {
        pay: 0,
        rate: "",
        frequency: "",
        hours: 0,
        date: "",
        deductions: 0,
        residence: "",
        relationship: "",
      } as User,
    };
  },
  components: {
    SettingsForm,
    RouterLink,
    NotificationModal,
  },
  methods: {
    updateUserInfo(newUserData: { pay: number; rate: string; frequency: string; hours: number }) {
      this.showUserForm = false;
      this.userStore.pay = newUserData.pay;
      this.userStore.payRate = newUserData.rate;
      this.userStore.payFreq = newUserData.frequency;
      this.userStore.hours = newUserData.hours;
    },
    handleFormClick() {
      this.showUserForm = !this.showUserForm;
    },
    async downloadExcel() {
      await this.userStore.generateJSON(this.user.nickname).then((res: any) => {
        let alink = document.createElement("a");
        const fileName = `${this.user.nickname}-expense-info.xls`;
        alink.href = `${this.userStore.baseUrl}/${fileName}`;
        alink.download = fileName;
        alink.click();
      });
    },
  },
  async mounted() {
    await this.userStore.fill(this.user.sub);
    if (!this.userStore.dbUserId) {
      this.showUserForm = true;
    }
  },
});
</script>

<style scoped>
.main-dashboard {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.notif-container {
  text-align: center;
  color: var(--text-color);
  border-radius: 15px;
  border: 2px solid black;
  width: 50%;
  margin: 30px auto 0 auto;
  background-color: var(--green-bg);
}

.notif-header {
  display: flex;
  justify-content: center;
}

.emoji-btn {
  border: none;
  background-color: inherit;
}

.view-boxes {
  width: 50%;
  margin: 70px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.view-box {
  background-color: var(--btn-main);
  min-width: 375px;
  width: 40%;
  height: 80px;
  text-align: center;
  border-radius: 15px;
  border: 2px solid black;
  color: var(--dk-green);
  margin: 5px;
  text-decoration: none;
}

.view-box:hover {
  background-color: var(--btn-hover);
}

.view-box:active {
  transform: translateY(2px);
}

.view-box h2 {
  margin: auto;
  padding: 18px;
  color: white;
  text-decoration: none;
}

.settings-container {
  min-width: 400px;
  width: 40%;
  background-color: var(--white-black);
  color: var(--text-color);
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
  width: 90%;
  margin: 20px auto;
  font-size: larger;
  border: 2px solid var(--black-white);
}

.info-table td {
  border: 2px solid var(--black-white);
}

.left {
  text-align: left;
  padding: 5px;
}

.right {
  text-align: right;
  padding: 5px;
}

.even {
  background-color: var(--green-bg);
}

.link-adjust {
  margin-bottom: 20px;
}

.form-modal {
  width: 50%;
  height: 75%;
  background-color: var(--green-bg);
  position: fixed;
  border-radius: 5px;
  top: 10%;
  left: 25%;
  text-align: center;
  padding: 20px;
  border: solid 2px black;
  border-radius: 10px;
  overflow-y: auto;
  color: var(--black-white);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

#welcome {
  margin: 20px;
}

.instructions {
  margin-bottom: 20px;
}

.loading {
  color: var(--text-color);
}

@media (max-width: 1000px) {
  .page-header {
    font-size: 2.5rem;
  }

  .subheader {
    font-size: 2.5rem;
  }

  .notif-container {
    width: 90%;
  }

  .view-boxes {
    width: 95%;
  }
  .view-box {
    width: 90%;
    margin: 10px;
  }

  .view-box h2 {
    font-size: 2rem;
  }

  .settings-container {
    width: 95%;
    margin: 20px;
  }

  .user-info {
    margin: 10px;
  }

  .info-table {
    width: 95%;
    margin: 0 auto;
    font-size: 1rem;
    border: 2px solid black;
  }
  .link-adjust {
    font-size: 1rem;
  }
}
</style>
