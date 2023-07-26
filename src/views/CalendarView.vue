<template>
  <section class="page-content">
    <main class="calendar-container" v-if="!userStore.loading">
      <header>
        <h1 class="page-header">Calendar View</h1>
      </header>
      <section class="calendar">
        <FullCalendar ref="cc" :options="calendarOptions" />
      </section>
      <section class="expense-form-modal" v-if="addNew === true">
        <h3 class="subheader">Add Recurring Expense</h3>
        <ExpenseForm
          @addExpense="addExpense"
          :expense="{ id: '', name: '', amount: 0, date: dueDate }"
          type="new"
        />
        <div class="btn-container">
          <button id="close-btn" class="btn btn-success" @click="addNew = false">Close</button>
        </div>
      </section>
      <section class="view-expense-modal" v-if="showData === true">
        <h3 class="subheader">{{ currentexpense.name }} Info</h3>
        <div class="expense-info">
          <table>
            <tbody>
              <tr>
                <td class="expense-label"><strong>Expense Name:</strong></td>
                <td>{{ currentexpense.name }}</td>
              </tr>
              <tr>
                <td class="expense-label"><strong>Expense Amount:</strong></td>
                <td>${{ currentexpense.amount }}</td>
              </tr>
              <tr>
                <td class="expense-label">
                  <strong>Expense Due Date:</strong>
                </td>
                <td>{{ currentexpense.fullDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="btn-container">
          <button id="close-btn" class="btn btn-success" @click="showData = false">Close</button>
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

<script>
import { defineComponent } from "vue";
import Axios from "axios";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuth0 } from "@auth0/auth0-vue";
import JSConfetti from "js-confetti";

import { useUserStore } from "../stores/UserStore";
import ExpenseForm from "../components/ExpenseForm.vue";

const jsConfetti = new JSConfetti();

export default defineComponent({
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  components: {
    FullCalendar,
    ExpenseForm,
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseDates: [],
      payDates: [],
      addNew: false,
      dueDate: 0,
      showData: false,
      currentexpense: {},
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        selectable: true,
        initialView: "dayGridMonth",
        events: [],
        eventColor: "#26c67b",
        editable: true,
        datesSet: this.gatherDates,
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,
      },
    };
  },
  methods: {
    getMonthAndYear() {
      const end = this.$refs.cc.getApi().currentData.dateProfile.currentRange.end;
      const month = end.getUTCMonth() < 10 ? `0${end.getUTCMonth()}` : end.getUTCMonth();
      const year = end.getUTCFullYear();
      return [month, year];
    },
    gatherDates() {
      const [month, year] = this.getMonthAndYear();

      for (const expense of this.userStore.expenses) {
        const day = expense.date < 10 ? `0${expense.date}` : expense.date;
        const newDateStr = `${year}-${month}-${day}`;
        const eventObj = {
          title: expense.name,
          date: newDateStr,
          expense: expense,
        };

        if (this.calendarOptions.events.filter((e) => e.date === eventObj.date).length === 0) {
          this.calendarOptions.events.push(eventObj);
        }
      }
    },
    formatPaychecks() {
      this.payDates = this.userStore.paychecks.map((x) => ({
        title: "Payday",
        date: x.date,
        color: "#1e9f63",
      }));
    },
    handleDateClick(info) {
      this.addNew = true;
      this.dueDate = info.date.getDate();
    },
    handleEventClick(info) {
      if (info.event.extendedProps.expense) {
        this.showData = true;
        this.currentexpense = info.event.extendedProps.expense;
        this.currentexpense.fullDate = info.event.start.toLocaleDateString();
      } else {
        jsConfetti.addConfetti();
      }
    },
    async addExpense(expenseData) {
      await this.userStore.addExpense(expenseData)
        .then((res) => {
          console.log(res)
          if (res.message === "Success") {
            expenseData.id = res.id;
            const [month, year] = this.getMonthAndYear();
            const day = this.dueDate < 10 ? `0${this.dueDate}` : this.dueDate;

            const newDateStr = `${year}-${month}-${day}`;
            const eventObj = {
              title: `${expenseData.name}`,
              date: newDateStr,
              expense: expenseData,
            };

            this.calendarOptions.events.push(eventObj);
            this.userStore.expenses.push(expenseData);
            this.addNew = false;
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
    },
  },
  async mounted() {
    await this.userStore.fill(this.user.sub);
    this.gatherDates();
    this.formatPaychecks();
    this.calendarOptions.events = [...this.calendarOptions.events, ...this.payDates];
  },
});
</script>

<style scoped>
.calendar {
  width: 75%;
  margin: 25px auto;
  padding: 15px;
  background-color: var(--white-black);
  color: var(--black-white);
  border-radius: 15px;
  border: 2px solid var(--black-white);
}

.expense-form-modal,
.view-expense-modal {
  width: 50%;
  height: 250px;
  background-color: var(--green-bg);
  position: fixed;
  border-radius: 5px;
  top: 25%;
  left: 25%;
  text-align: center;
  padding: 20px;
  border: solid 2px black;
  border-radius: 10px;
  overflow-y: auto;
  color: var(--black-white);
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

.subheader {
  margin-bottom: 20px;
}

.btn-container {
  margin-top: 20px;
}
.expense-info {
  width: 50%;
  margin: 0 auto;
  background-color: var(--white-black);
  border-radius: 5px;
  border: solid 2px black;
}

.expense-label {
  text-align: left;
}

table {
  margin: auto;
}

@media (max-width: 1000px) {
  .page-header {
    font-size: 2.5rem;
  }
  .calendar {
    width: 95%;
  }
  .expense-form-modal,
  .view-expense-modal {
    width: 95%;
    height: 250px;
    background-color: var(--green-bg);
    position: fixed;
    border-radius: 5px;
    top: 25%;
    left: 2.5%;
    text-align: center;
    padding: 20px;
    border: solid 2px black;
    border-radius: 10px;
    overflow-y: auto;
    color: var(--black-white);
    z-index: 1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  }
}
</style>
