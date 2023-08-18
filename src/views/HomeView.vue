<template>
  <main class="main-content">
    <h1 class="header">Reyaly Financial Planner</h1>
    <p class="summary">The all in one solution to organizing your finances</p>
    <section class="get-started" v-if="!isAuthenticated && !isLoading">
      <p class="cta">Log in or sign up to get started!</p>
      <div class="login-btn btn btn-lg btn-success">
        <LoginButton />
      </div>
    </section>
    <div v-else-if="isLoading" class="small-spinner-container">
      <div class="spinner-border text-success loading-spinner" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <section class="get-started" v-else>
      <p class="cta">Head over to your Dashboard to get started!</p>
      <RouterLink to="/dashboard">
        <button class="btn btn-lg btn-success">Dashboard</button>
      </RouterLink>
    </section>

    <section class="demo">
      <h2 class="demo-header">Here's what's inside!</h2>

      <p class="summary">Try our Savings Calculator and Currency Converter, no account needed!</p>

      <div class="no-account">
        <RouterLink to="/views/savings" class="view-box">
          <h2>Savings View</h2>
        </RouterLink>
        <RouterLink to="/views/converter" class="view-box">
          <h2>Currency Converter</h2>
        </RouterLink>
      </div>

      <section class="left-align demo-item fade-in full-width">
        <img alt="The Master List" src="../assets/master-list.png" class="demo-pic" />
        <div class="demo-text-content">
          <h3 class="text-header">The Master List</h3>
          <p class="demo-summary">
            The Master List is the star of the show. This will be the central hub of all of your
            expenses. Items can be added to this list in the settings, or via the calendar. This
            list will sort your expenses by due date, so you can easily see when everything is due.
          </p>
        </div>
      </section>
      <section class="right-align demo-item fade-in full-width">
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
      <section class="left-align demo-item fade-in full-width">
        <img
          alt="The Paycheck View"
          src="../assets/paycheck-view.png"
          class="demo-pic"
          id="paycheck"
        />
        <div class="demo-text-content">
          <h3 class="text-header">The Paycheck View</h3>
          <p class="demo-summary">
            The Paycheck View breaks down your expenses per paycheck. It will only show you the
            expenses due within that current paycheck, and before the next.
          </p>
        </div>
      </section>
      <section class="right-align demo-item fade-in full-width">
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
      <section class="left-align demo-item fade-in full-width">
        <img alt="The Debt View" src="../assets/debt-view.png" class="demo-pic" />
        <div class="demo-text-content">
          <h3 class="text-header">The Debt View</h3>
          <p class="demo-summary">
            The Debt View lets you visualize your debt pay-off. There are two plans, debt-avalance
            and debt-snowball, compare to see which works best for you!
          </p>
        </div>
      </section>
      <section class="right-align demo-item fade-in full-width">
        <div class="demo-text-content">
          <h3 class="text-header">The Savings View</h3>
          <p class="demo-summary every-other">
            The Savings View offers two great services. A savings calculator which calculates how
            much interest can be earned over a period of time with or without additional deposits.
            Also a list of accounts with high APYs is provided for maximum savings potential.
          </p>
        </div>
        <img alt="The Savings View" src="../assets/savings-view.png" class="demo-pic" />
      </section>
      <section class="left-align demo-item fade-in full-width">
        <img alt="Currency Converter" src="../assets/currency.png" class="demo-pic" />
        <div class="demo-text-content">
          <h3 class="text-header">Currency Converter</h3>
          <p class="demo-summary">
            The Currency Converter takes in two global currencies and an amount, and returns the new
            amount, as well as the current exchange rate.
          </p>
        </div>
      </section>
      <section class="right-align demo-item fade-in full-width">
        <div class="demo-text-content">
          <h3 class="text-header">Excel Export</h3>
          <p class="demo-summary every-other">
            If you ever feel like doing things old school, you can export your Master List and other
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
import { onMounted, onUnmounted } from "vue";

import LoginButton from "../components/LoginButton.vue";

const { isAuthenticated, isLoading } = useAuth0();
let fadeInElements: HTMLElement[] = [];

const handleScroll = (): void => {
  for (var i = 0; i < fadeInElements.length; i++) {
    var elem = fadeInElements[i];
    if (isElemVisible(elem)) {
      elem.style.opacity = "1";
      elem.style.transform = "scale(1)";
      fadeInElements.splice(i, 1);
    }
  }
};

const isElemVisible = (el: HTMLElement): boolean => {
  var rect = el.getBoundingClientRect();
  var elemTop = rect.top + 200;
  var elemBottom = rect.bottom;
  return elemTop < window.innerHeight && elemBottom >= 0;
};

onMounted(() => {
  window.scrollTo({ top: 0, left: 0 });
  fadeInElements = Array.from(
    document.getElementsByClassName("fade-in") as HTMLCollectionOf<HTMLElement>
  );
  document.addEventListener("scroll", handleScroll);
  handleScroll();
});

onUnmounted(() => {
  document.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.main-content {
  text-align: center;
  color: var(--text-color);
}

.header,
.demo-header {
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

.small-spinner-container {
  margin-top: 20px;
}

.btn {
  margin-top: 10px;
}

.login-btn {
  color: white;
}

.btn-success {
  background-color: var(--med-green);
  box-shadow: 0 0 10px var(--box-shadow);
  color: white;
}

.demo {
  margin-top: 100px;
}

.no-account {
  width: 75%;
  margin: 20px auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.view-box {
  background-color: var(--btn-main);
  min-width: 375px;
  width: 40%;
  height: 80px;
  text-align: center;
  border-radius: var(--border-radius);
  box-shadow: 0 0 10px var(--box-shadow);
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

.demo-item {
  width: 70%;
  padding: 20px;
}

.fade-in {
  margin-bottom: 50px;
  opacity: 0;
  transition: 0.3s all ease-out;
  transform: scale(0.8);
  box-sizing: border-box;
  padding: 20px;
}

.left-align {
  margin: 10px auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.right-align {
  margin: 10px auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.demo-pic {
  max-width: 75%;
  border-radius: var(--border-radius);
}

#paycheck {
  max-width: 50%;
}

.demo-summary {
  box-shadow: 0 0 10px var(--box-shadow);
  border-radius: 5px;
  margin: 10px;
  padding: 10px;
  background-color: var(--white-black);
  width: 500px;
}

.every-other {
  background-color: var(--green-bg);
}

@media (max-width: 1024px) {
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
    width: 95%;
  }
}
</style>
