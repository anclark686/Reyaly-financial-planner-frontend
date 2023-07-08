<template>
  <div>
    <header>
      <h1 class="page-header">Calendar View</h1>
    </header>
    <main class="calendar">
      <FullCalendar :options="calendarOptions" />
    </main>
    
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default defineComponent({
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth'
      }
    }
  }
})
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
