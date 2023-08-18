<template>
  <section class="page-content">
    <main class="calendar-container" v-if="!userStore.loading && !userStore.error">
      <header>
        <h1 class="page-header">Calendar View</h1>
      </header>
      <section class="calendar">
        <FullCalendar ref="calendar" :options="calendarOptions" />
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
        <h3 class="subheader">{{ currentExpense.name }} Info</h3>
        <div class="expense-info">
          <table>
            <tbody>
              <tr>
                <td class="expense-label"><strong>Expense Name:&nbsp;</strong></td>
                <td>{{ currentExpense.name }}</td>
              </tr>
              <tr>
                <td class="expense-label"><strong>Amount:</strong></td>
                <td>${{ currentExpense.amount }}</td>
              </tr>
              <tr>
                <td class="expense-label">
                  <strong>Due Date: </strong>
                </td>
                <td>{{ currentExpense.fullDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="btn-container" v-if="edit === false">
          <button id="edit-btn" class="btn btn-success modify-btn btn-sm" @click="edit = true">
            Modify
          </button>
          <button
            id="delete-btn"
            class="btn btn-success modify-btn btn-sm"
            @click="preDelete(currentExpense)"
          >
            Delete
          </button>
        </div>
        <div class="expense-form-container" v-if="edit === true">
          <ExpenseForm
            @cancel="cancelEdit"
            @editExpense="editExpenseInfo"
            :expense="currentExpense"
            type="edit"
            :dateStr="currentExpense.fullDate"
          />
        </div>
        <div class="btn-container">
          <button id="close-btn" class="btn btn-success" @click="showData = false">Close</button>
        </div>
      </section>
      <DeleteModal
        v-if="showModal"
        @close="showModal = false"
        @deleteItem="onDelete(deleteInfo.id, deleteInfo.idx)"
        :name="deleteInfo.title"
      />
    </main>
    <div class="spinner-container" v-if="userStore.loading">
      <div class="spinner-border text-success loading-spinner" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h1 class="loading">Loading...</h1>
    </div>
    <div class="error-container" v-if="userStore.error">
      <ErrorComponent />
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuth0 } from "@auth0/auth0-vue";
import JSConfetti from "js-confetti";

import { useUserStore } from "../stores/UserStore";
import ExpenseForm from "../components/ExpenseForm.vue";
import ErrorComponent from "../components/ErrorComponent.vue";
import DeleteModal from "../components/DeleteModal.vue";

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
    ErrorComponent,
    DeleteModal,
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseDates: [],
      payDates: [],
      addNew: false,
      edit: false,
      showModal: false,
      deleteInfo: {},
      dueDate: 0,
      showData: false,
      currentExpense: {},
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
      const end = this.$refs.calendar.getApi().currentData.dateProfile.currentRange.end;
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
          id: expense.id + newDateStr,
          title: expense.name,
          date: newDateStr,
          expense: expense,
        };

        if (
          this.calendarOptions.events.filter(
            (e) => e.id === eventObj.id && e.date === eventObj.date
          ).length === 0
        ) {
          this.calendarOptions.events.push(eventObj);
        }
      }
    },
    formatPaychecks() {
      if (this.userStore.income === 1) {
        this.payDates = this.userStore.paychecks.map((x) => ({
          id: x.id,
          title: "Payday",
          date: x.date,
          color: "#1e9f63",
        }));
      } else {
        this.payDates = this.userStore.paychecks
          .map((x) => ({
            id: x.id,
            title: "Payday 1",
            date: x.date,
            color: "#1e9f63",
          }))
          .concat(
            this.userStore.paychecks2.map((x) => ({
              id: x.id,
              title: "Payday 2",
              date: x.date,
              color: "#17784b",
            }))
          );
      }
    },
    handleDateClick(info) {
      this.addNew = true;
      this.dueDate = info.date.getDate();
    },
    handleEventClick(info) {
      if (info.event.extendedProps.expense) {
        this.showData = true;
        this.currentExpense = info.event.extendedProps.expense;
        this.currentExpense.fullDate = info.event.start.toLocaleDateString();
        this.currentExpense.dateStr = info.event.startStr;
      } else {
        jsConfetti.addConfetti();
      }
    },
    addToLists(expenseData, newDateStr) {
      const eventObj = {
        id: expenseData.id + newDateStr,
        title: `${expenseData.name}`,
        date: newDateStr,
        expense: expenseData,
      };

      this.calendarOptions.events.push(eventObj);
      this.userStore.expenses.push(expenseData);
    },
    removeEvent() {
      const calendarApi = this.$refs.calendar.getApi();
      const relatedArr = this.calendarOptions.events.filter((e) => {
        return e.id.includes(this.currentExpense.id);
      })

      for (const eventObj of relatedArr) {
        const calEvent = calendarApi.getEventById(eventObj.id);
        calEvent.remove();
        const index = this.calendarOptions.events.findIndex((e) => e.id === eventObj.id);
        this.calendarOptions.events.splice(index, 1);
      }

      this.userStore.expenses = this.userStore.expenses.filter((e) => {
        return !e.id.includes(this.currentExpense.id);
      });
    },
    async addExpense(expenseData) {
      await this.userStore
        .addExpense(expenseData)
        .then((res) => {
          if (res.message === "Success") {
            expenseData.id = res.id;
            const [month, year] = this.getMonthAndYear();
            const day = this.dueDate < 10 ? `0${this.dueDate}` : this.dueDate;

            const newDateStr = `${year}-${month}-${day}`;
            this.addToLists(expenseData, newDateStr);

            this.addNew = false;
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
    },
    async editExpenseInfo(expenseData) {
      await this.userStore
        .editExpense(expenseData)
        .then((res) => {
          if (res.message === "Success") {
            this.removeEvent();

            const [month, year] = this.getMonthAndYear();
            const day = expenseData.date < 10 ? `0${expenseData.date}` : expenseData.date;
            const newDateStr = `${year}-${month}-${day}`;
            this.addToLists(expenseData, newDateStr);

            this.showData = false;
            this.edit = false;
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
    },
    cancelEdit() {
      this.edit = false;
      this.editInfo = {};
    },
    preDelete(currentExpense) {
      this.showModal = true;
      this.deleteInfo = { id: currentExpense.id, title: currentExpense.name };
    },
    async onDelete() {
      await this.userStore
        .deleteExpense(this.currentExpense.id)
        .then((res) => {
          if (res.message === "Success") {
            this.removeEvent();

            this.deleteInfo = { id: "", idx: 0, title: "" };
            this.showModal = false;
            this.showData = false;
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
  box-shadow: 0 0 10px var(--box-shadow);
}

.expense-form-modal,
.view-expense-modal {
  width: 50%;
  height: 305px;
  background-color: var(--green-bg);
  position: fixed;
  border-radius: 5px;
  top: 25%;
  left: 25%;
  text-align: center;
  padding: 20px;
  border-radius: var(--border-radius);
  overflow-y: auto;
  color: var(--black-white);
  z-index: 1;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.519);
}

.subheader {
  margin-bottom: 20px;
}

.btn-container {
  margin-bottom: 20px;
}
.expense-info {
  width: 75%;
  margin: 20px auto;
  background-color: var(--white-black);
  border-radius: 5px;
  box-shadow: 0 0 10px var(--box-shadow);
}

.expense-label {
  text-align: left;
}

.modify-btn {
  width: 100px;
  margin: 0 5px;
}

.loading {
  color: var(--text-color);
}

table {
  margin: auto;
}

@media (max-width: 1024px) {
  .page-header {
    font-size: 2.5rem;
  }
  .calendar {
    width: 95%;
  }
  .expense-form-modal,
  .view-expense-modal {
    width: 75%;
    left: 12%;
  }
}

@media (max-width: 700px) {
  .expense-form-modal,
  .view-expense-modal {
    width: 95%;
    left: 2.75%;
  }
  .expense-info {
    width: 95%;
  }
}
</style>
