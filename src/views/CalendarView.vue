<template>
  <div>
    <header>
      <h1 class="page-header">Calendar View</h1>
    </header>
    <main class="calendar">
      <FullCalendar ref="cc" :options="calendarOptions" />
    </main>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuth0 } from "@auth0/auth0-vue";

import { useUserStore } from "../stores/UserStore";

export default defineComponent({
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  components: {
    FullCalendar,
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseDates: [],
      payDates: [],
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        themeSystem: "minty",
        events: [],
        eventColor: "#26c67b",
        datesSet: this.gatherDates,
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
    gatherDates() {
      const end =
        this.$refs.cc.getApi().currentData.dateProfile.currentRange.end;
      const month =
        end.getUTCMonth() < 10 ? `0${end.getUTCMonth()}` : end.getUTCMonth();
      const year = end.getUTCFullYear();

      for (const expense of this.userStore.expenses) {
        const day = expense.date < 10 ? `0${expense.date}` : expense.date;
        const newDateStr = `${year}-${month}-${day}`;
        const eventObj = { title: expense.name, date: newDateStr };

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
        color: "#378006",
      }));
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
</style>
