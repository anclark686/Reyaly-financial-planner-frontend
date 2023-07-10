<template>
  <main class="calendar-container">
    <header>
      <h1 class="page-header">Calendar View</h1>
    </header>
    <section class="calendar">
      <FullCalendar ref="cc" :options="calendarOptions" />
    </section>
    <section class="expense-form-container" v-if="addNew === true">
      <h3 class="subheader">Add Recurring Expense</h3>
      <ExpenseForm
        @addInfo="addInfo"
        :expense="{ id: '', name: '', amount: 0, date: dueDate }"
        type="new"
      />
      <div class="btn-container">
        <button id="close-btn" class="btn btn-success" @click="addNew = false">
          Close
        </button>
      </div>
    </section>
  </main>
</template>

<script>
import { defineComponent } from "vue";
import Axios from "axios";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuth0 } from "@auth0/auth0-vue";

import { useUserStore } from "../stores/UserStore";
import ExpenseForm from "../components/ExpenseForm.vue";

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
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        selectable: true,
        initialView: "dayGridMonth",
        events: [],
        eventColor: "#26c67b",
        datesSet: this.gatherDates,
        dateClick: this.handleDateClick,
      },
    };
  },
  watch: {
    expenseDates: function (newVal, oldVal) {
      console.log(1);
      console.log(2);
    },
  },
  methods: {
    getMonthAndYear() {
      const end =
        this.$refs.cc.getApi().currentData.dateProfile.currentRange.end;
      const month =
        end.getUTCMonth() < 10 ? `0${end.getUTCMonth()}` : end.getUTCMonth();
      const year = end.getUTCFullYear();
      return [month, year];
    },
    gatherDates() {
      const [month, year] = this.getMonthAndYear();

      for (const expense of this.userStore.expenses) {
        const day = expense.date < 10 ? `0${expense.date}` : expense.date;
        const newDateStr = `${year}-${month}-${day}`;
        const eventObj = {
          title: `${expense.name} - $${expense.amount}`,
          date: newDateStr,
        };

        if (
          this.calendarOptions.events.filter((e) => e.date === eventObj.date)
            .length === 0
        ) {
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
    addInfo(expenseData) {
      console.log(expenseData);
      Axios.post(
        `${this.userStore.baseUrl}/users/${this.userStore.dbUserId}/expenses`,
        expenseData
      )
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "Success") {
            const [month, year] = this.getMonthAndYear();
            const day = this.dueDate < 10 ? `0${this.dueDate}` : this.dueDate;

            const newDateStr = `${year}-${month}-${day}`;
            const eventObj = {
              title: `${expenseData.name} - $${expenseData.amount}`,
              date: newDateStr,
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
    this.calendarOptions.events = [
      ...this.calendarOptions.events,
      ...this.payDates,
    ];
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

.expense-form-container {
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
}

.subheader {
  margin-bottom: 20px;
}

.btn-container {
  margin-top: 20px;
}
</style>
