<template>
  <main class="main-content">
    <h1 class="header">Reyaly Financial Planner</h1>
    <p class="summary">The all in one solution to organizing your finances</p>
    <section class="get-started" v-if="!isAuthenticated">
      <p class="cta">Log in to get started!</p>
      <div class="login-btn btn btn-success">
        <LoginButton />
      </div>
    </section>
    <section class="get-started" v-else>
      <p class="cta">Head over to your Dashboard to get started!</p>
      <RouterLink to="/dashboard">
        <button class="btn btn-lg btn-success">Dashboard</button>
      </RouterLink>
    </section>

    <section class="demo">
      <h2 class="demo-header">Here's what's inside!</h2>
      <section class="left-align demo-item">
        <img alt="" src="../assets/master-list.png" class="demo-pic" />
        <div class="demo-text-content">
          <h3 class="text-header">The Master List</h3>
          <p class="demo-summary">
            The Master List is the star of the show. This will be the central hub of all of your
            expenses. Items can be added to this list in the settings, or via the calendar. This
            list will sort your expenses by due date, so you can easily see when everything is due.
          </p>
        </div>
      </section>
      <section class="right-align demo-item">
        <div class="demo-text-content">
          <h3 class="text-header">The Calendar View</h3>
          <p class="demo-summary every-other">
            The Calendar view lets you visualize your expenses in calendar format. Not only does it
            show your current expenses, but upcoming pay days as well. Additional expenses can be
            added by clicking on a date cell.
          </p>
        </div>
        <img alt="The Calendar View" src="../assets/calendar-view.png" class="demo-pic" />
      </section>
      <section class="left-align demo-item">
        <img alt="The Paycheck View" src="../assets/paycheck-view.png" class="demo-pic" />
        <div class="demo-text-content">
          <h3 class="text-header">The Paycheck View</h3>
          <p class="demo-summary">
            The Paycheck View breaks down your expenses per paycheck. It will only show you the
            expenses due within that current paycheck, and before the next.
          </p>
        </div>
      </section>
      <section class="right-align demo-item">
        <div class="demo-text-content">
          <h3 class="text-header">The Account View</h3>
          <p class="demo-summary every-other">
            The Account View lets you visualize your expenses with your current bank account
            balances. You can simply enter your start balance, select a few expenses, and your new
            total will be shown!
          </p>
        </div>
        <img alt="The Account View" src="../assets/account-view.png" class="demo-pic" />
      </section>
      <section class="left-align demo-item">
        <img alt="The Debt View" src="../assets/debt-view.png" class="demo-pic" />
        <div class="demo-text-content">
          <h3 class="text-header">The Debt View</h3>
          <p class="demo-summary">
            The Debt View lets you visualize your debt pay-off. There are two plans, debt-avalance
            and debt-snowball, compare to see which works best for you!
          </p>
        </div>
      </section>
      <section class="right-align demo-item">
        <div class="demo-text-content">
          <h3 class="text-header">Export Excel</h3>
          <p class="demo-summary every-other">
            If you ever feel like doing things old school, you can export your master List and other
            pay details into a handy Excel sheet.
          </p>
        </div>
        <img alt="Export Excel" src="../assets/excel.png" class="demo-pic" />
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { RouterLink } from "vue-router";

import LoginButton from "../components/LoginButton.vue";

const { isAuthenticated } = useAuth0();
</script>

<style scoped>
.main-content {
  text-align: center;
  color: var(--text-color);
}

.header,
.demo-header {
  font-family: "Lobster", cursive;
  margin: 50px auto 20px auto;
}

.summary,
.demo-summary {
  font-size: larger;
}

.get-started {
  margin: 20px;
  text-align: center;
  font-size: larger;
}

.login-btn {
  color: white;
}

.btn-success {
  background-color: var(--med-green);
  border: 2px solid black;
  color: white;
}

.demo {
  margin-top: 100px;
}

.demo-item {
  width: 70%;
  padding: 20px;
}

.left-align {
  margin: 10px auto 10px 10%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.right-align {
  margin: 10px 10% 10px auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.demo-pic {
  max-width: 75%;
  border-radius: 10px;
}

.demo-summary {
  border: 2px solid black;
  border-radius: 5px;
  margin: 10px;
  padding: 10px;
  background-color: var(--white-black);
}

.every-other {
  background-color: var(--green-bg);
}

@media (max-width: 1000px) {
  .header {
    font-size: 2.5rem;
  }

  .demo-header {
    font-size: 2.5rem;
  }

  .demo-item {
    width: 100%;
  }
  .left-align {
    flex-direction: column;
    margin: auto;
  }

  .right-align {
    flex-direction: column-reverse;
    margin: auto;
  }

  .text-header {
    margin-top: 15px;
  }

  .demo-summary {
    margin: 20px auto;
  }
}
</style>
