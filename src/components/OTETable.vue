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
import DeleteModal from "./DeleteModal.vue";
import { type OneTimeExpense } from "../types"

export default defineComponent({
  props: {
    paycheckId: { type: String, required: true },
  },
  components: {
    OTEForm,
    DeleteModal,
  },
  data() {
    return {
      userStore: useUserStore(),
      showOTEForm: false,
      edit: false,
      editInfo: {} as OneTimeExpense,
      editRow: 0,
      deleteInfo: {} as { id: string; idx: number; title: string },
    };
  },
  methods: {
    async addNew(oteData: OneTimeExpense) {
      console.log(oteData)
      console.log("you here?")
      await this.userStore
        .addOTExpense(oteData)
        .then((res) => {
          if (res.message === "Success") {
            console.log(res)
            // (expenseData.id = res.id), this.masterList.push(expenseData);
            // this.sortMasterList();
          } else {
            alert("An error occurred, please try again");
          }
        })
        .catch((err) => console.log(err));
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
