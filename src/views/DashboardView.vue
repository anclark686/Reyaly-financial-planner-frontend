<template>
  <section class="page-content">
    <main class="dashboard" v-if="!userStore.loading && !userStore.error">
      <h1 class="page-header">Dashboard</h1>
      <div class="notification-container" v-if="!userStore.noUser">
        <section class="notif-container" v-if="showNotifications">
          <div class="notif-header">
            <h2>Notifications</h2>
            <button class="emoji-btn" @click="showNotifications = false">➖</button>
          </div>

          <NotificationModal frequency="weekly" />
        </section>
        <section class="notif-container" v-else>
          <div class="notif-header">
            <h2>Notifications</h2>
            <button class="emoji-btn" @click="showNotifications = true">➕</button>
          </div>
        </section>
      </div>
      <section class="main-dashboard" v-if="!userStore.noUser">
        <section class="view-boxes">
          <RouterLink to="/views/calendar" class="view-box" id="top">
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

          <RouterLink to="/views/converter" class="view-box">
            <h2>Currency Converter</h2>
          </RouterLink>

          <button class="view-box" @click="downloadExcel" id="bottom">
            <h2>Export Excel</h2>
          </button>
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
                    <strong>State of Residence:</strong>
                  </td>
                  <td class="right">{{ userStore.residence }}</td>
                </tr>
                <tr class="odd">
                  <td class="left">
                    <strong>Relationship Status:</strong>
                  </td>
                  <td class="right">
                    {{ userStore.relationship }}
                  </td>
                </tr>
                <tr class="even">
                  <td class="left">
                    <strong># of Expenses:</strong>
                  </td>
                  <td class="right">
                    {{ userStore.expenses.length }}
                  </td>
                </tr>
                <tr class="odd">
                  <td class="left">
                    <strong>Expense Total:</strong>
                  </td>
                  <td class="right">${{ userStore.expenseSum }}</td>
                </tr>
                <tr class="even">
                  <td class="left">
                    <strong>Est. Monthly Pay:</strong>
                  </td>
                  <td class="right">${{ userStore.getMonthlyTakeHome() }}</td>
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

            <h3 class="subheader">Paycheck Info:</h3>
            <div class="pay-info-single" v-if="userStore.income === 1">
              <PayTable
                :number="0"
                type="single"
                :pay="userStore.pay"
                :rate="userStore.payRate"
                :frequency="userStore.payFreq"
                :hours="userStore.hours"
                :deductions="userStore.deductions"
                :net="userStore.getEstNet(1)"
              />
            </div>
            <div class="pay-info-double" v-else>
              <PayTable
                :number="1"
                type="double"
                :pay="userStore.pay"
                :rate="userStore.payRate"
                :frequency="userStore.payFreq"
                :hours="userStore.hours"
                :deductions="userStore.deductions"
                :net="userStore.getEstNet(1)"
              />
              <PayTable
                :number="2"
                type="double"
                :pay="userStore.pay2"
                :rate="userStore.payRate2"
                :frequency="userStore.payFreq2"
                :hours="userStore.hours2"
                :deductions="userStore.deductions2"
                :net="userStore.getEstNet(2)"
              />
            </div>
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
        <SettingsForm formType="new" :userInfo="blankAccount" @close="showUserForm = false" />
      </div>
    </main>

    <div class="spinner-container" v-if="userStore.loading">
      <div class="spinner-border text-success loading-spinner spinner-border-lg" role="status">
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
import { RouterLink } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";
import { defineComponent } from "vue";

import SettingsForm from "../components/SettingsForm.vue";
import NotificationModal from "../components/NotificationModal.vue";
import PayTable from "../components/PayTable.vue";
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
  data() {
    return {
      userStore: useUserStore(),
      showUserForm: false,
      showNotifications: true,
      blankAccount: {
        residence: "",
        relationship: "",
        pay: 0,
        rate: "",
        frequency: "",
        hours: 0,
        date: "",
        deductions: 0,
        income: 1,
        pay2: 0,
        rate2: "",
        frequency2: "",
        hours2: 0,
        date2: "",
        deductions2: 0,
      } as User,
    };
  },
  components: {
    RouterLink,
    SettingsForm,
    NotificationModal,
    PayTable,
    ErrorComponent,
  },
  methods: {
    handleFormClick(): void {
      this.showUserForm = !this.showUserForm;
    },
    async downloadExcel(): Promise<any> {
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
    if (this.userStore.noUser) {
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
  border-radius: var(--border-radius);
  width: 50%;
  margin: 30px auto 0 auto;
  background-color: var(--green-bg);
  box-shadow: 0 0 10px var(--box-shadow);
}

.notif-header {
  margin: 10px;
  display: flex;
  justify-content: center;
}

.emoji-btn {
  border: 1px solid var(--black-white);
  border-radius: 5px;
  padding: 0 2px 0 1px;
  height: fit-content;
  align-self: center;
  margin: 5px;
}

.view-boxes {
  width: 40%;
  margin: 70px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  height: fit-content;
}

.view-box {
  background-color: var(--btn-main);
  min-width: 375px;
  width: 40%;
  height: 80px;
  text-align: center;
  border-radius: var(--border-radius);
  box-shadow: 0 0 10px var(--dk-box-shadow);
  margin: 10px;
  text-decoration: none;
}

#top {
  margin-top: 5px;
}

#bottom {
  margin-bottom: 0px;
  border: none;
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
  width: 50%;
  background-color: var(--white-black);
  color: var(--text-color);
  border-radius: var(--border-radius);
  margin: 70px 50px;
  text-align: center;
  box-shadow: 0 0 10px var(--box-shadow);
}

.user-info {
  margin: 25px;
}

.subheader {
  margin: 10px;
}

.info-table {
  width: 90%;
  margin: 20px auto;
  font-size: larger;
  box-shadow: 0 0 10px var(--box-shadow);
}

.left {
  text-align: left;
  padding: 5px 10px;
}

.right {
  text-align: right;
  padding: 5px 10px;
}

.even {
  background-color: var(--row-bg);
}

.pay-info-double {
  display: flex;
  flex-wrap: wrap;
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
  border-radius: var(--border-radius);
  overflow-y: auto;
  color: var(--black-white);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.519);
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

@media (max-width: 1024px) {
  .page-header {
    font-size: 2.5rem;
  }

  .notif-container {
    width: 75%;
  }

  .view-boxes {
    width: 755%;
  }
  .view-box {
    width: 30%;
    margin: 10px;
  }

  .view-box h2 {
    font-size: 2rem;
  }

  .settings-container {
    width: 75%;
    margin: 20px;
  }

  .user-info {
    margin: 10px;
  }

  .info-table {
    width: 90%;
    margin: 0 auto;
    font-size: 1rem;
  }

  .link-adjust {
    font-size: 1rem;
  }

  .form-modal {
    width: 75%;
    left: 12%;
  }
}

@media (max-width: 600px) {
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

  .settings-container {
    width: 95%;
    margin: 20px;
  }

  .info-table {
    width: 95%;
    margin: 0 auto;
    font-size: 1rem;
  }

  .form-modal {
    width: 100%;
    left: 0;
    font-size: 1.25rem;
  }
}
</style>
