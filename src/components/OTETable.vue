<template>
  <div class="one-time-expense-table-container">
    <h1>Hello Table</h1>
    <div class="btn-container" v-if="!showOTEForm">
      <button class="btn btn-success" @click="showOTEForm = true">+ One Time Expense</button>
    </div>
    <OTEForm v-if="showOTEForm" :paycheckId="paycheckId" @addNew="addNew"/>
    <div class="btn-container" v-if="showOTEForm">
      <button class="btn btn-success" @click="showOTEForm = false">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useUserStore } from "../stores/UserStore";
import OTEForm from "../components/OTEForm.vue";
import { type OneTimeExpense } from "../types"

export default defineComponent({
  props: {
    paycheckId: { type: String, required: true },
  },
  components: {
    OTEForm,
  },
  data() {
    return {
      userStore: useUserStore(),
      showOTEForm: false,
    };
  },
  methods: {
    addNew(oteData: OneTimeExpense) {
      console.log(oteData)
    }
  },
  mounted() {

  },
});
</script>

<style scoped>
.one-time-expense-table-container {
  background-color: aqua;
}

.btn-container {
  margin: auto;
  text-align: center;
}

@media (max-width: 1024px) {
}
</style>
