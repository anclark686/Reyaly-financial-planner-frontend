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

        <RouterLink to="/views/debt" class="view-box">
          <h2>Debt View</h2>
        </RouterLink>

        <button class="view-box" @click="downloadExcel">
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
                  <strong># of Deductions:</strong>
                </td>
                <td class="right">${{ userStore.deductions }}</td>
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
    <button @click="handleFormClick">showModal</button>
    <div v-if="showUserForm" @close="showUserForm = false" class="form-modal">
      <h2 id="welcome">Welcome {{ user.name }}!</h2>
      <div class="instructions">
        <h5>Looks like it's your first time here!</h5>
        <h5>Enter the info below to get started.</h5>
      </div>
      <SettingsForm
        formType="new"
        :pay="0"
        rate=""
        frequency=""
        :hours="0"
        @close="updateUserInfo"
      />
      <button @click="handleFormClick">Close Modal</button>
    </div>
    <button @click="handleIDClick">print id</button>
  </main>
</template>

<script lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";
import { defineComponent } from "vue";

import SettingsForm from "../components/SettingsForm.vue";
import { useUserStore } from "../stores/UserStore";

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
    };
  },
  components: {
    SettingsForm,
  },
  // computed: {
  //   expenseSum() {
  //     const expenseSum = this.userStore.expenses.reduce(
  //       (a: any = {}, b: any = {}) => a + b.amount,
  //       0
  //     );
  //     return expenseSum;
  //   },
  // },
  methods: {
    updateUserInfo(newUserData: {
      pay: number;
      rate: string;
      frequency: string;
      hours: number;
    }) {
      this.showUserForm = false;
      console.log(newUserData);
      this.userStore.pay = newUserData.pay;
      this.userStore.payRate = newUserData.rate;
      this.userStore.payFreq = newUserData.frequency;
      this.userStore.hours = newUserData.hours;
    },
    handleFormClick() {
      this.showUserForm = !this.showUserForm;
      console.log(this.showUserForm);
    },
    handleIDClick() {
      console.log(this.userStore.dbUserId);
    },
    downloadExcel() {
      this.userStore.generateJSON(this.user.nickname)
      let alink = document.createElement("a");
      const fileName = `${this.user.nickname}-expense-info.xls`
      alink.href = `${this.userStore.baseUrl}/${fileName}`;
      alink.download = fileName;
      alink.click();
    },
  },
  mounted() {
    this.userStore.fill(this.user.sub);
    setTimeout(() => {
      if (!this.userStore.dbUserId) {
        this.showUserForm = true;
      }
    }, 1000);
  },
});
</script>

<style scoped>
.main-dashboard {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
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
  background-color: var(--btn-main);
  min-width: 300px;
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
  background-color: var(--btn-hover);
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
  padding: 10px;
}

.right {
  text-align: right;
  padding: 10px;
}

.even {
  background-color: var(--green-bg);
}

.link-adjust {
  margin-bottom: 20px;
}

.form-modal {
  width: 50%;
  height: 50%;
  background-color: var(--green-bg);
  position: absolute;
  border-radius: 5px;
  top: 25%;
  left: 25%;
  text-align: center;
  padding: 20px;
  border: solid 2px black;
  border-radius: 10px;
  overflow-y: auto;
  color: var(--black-white);
}

#welcome {
  margin: 20px;
}

.instructions {
  margin-bottom: 20px;
}

@media screen and (max-width: 800) {
  .view-boxes {
    width: 75%;
  }
  .view-box {
    width: 90%;
    margin: 10px;
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
    font-size: small;
    border: 2px solid black;
  }
}
</style>
