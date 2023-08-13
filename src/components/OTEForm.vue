<template>
  <div class="one-time-expense-form-container">
    <form action="submit" class="ote-form" @submit.prevent="onSubmit" @keydown.enter.prevent="">
      <div class="flex-row">
        <div class="input-row">
          <label for="ote-name"><strong>Expense Name:</strong></label>
          <input type="text" id="ote-name" name="ote-name" class="input-info" v-model="oteName" />
        </div>
        <div class="input-row">
          <label for="ote-amount"><strong>Amount:</strong></label>
          <input type="number" step="0.01" id="ote-amounte" name="ote-amount" class="input-info" v-model="oteAmount" />
        </div>
        <div class="input-row">
          <label for="ote-date"><strong>Due Date:</strong></label>
          <input type="date" id="ote-date" name="ote-date" class="input-info" v-model="oteDate" />
        </div>
      </div>
      <p v-if="invalid" id="warning">Please ensure all fields are filled.</p>
      <div class="btn-container">
        <input type="submit" class="btn btn-success" value="Add Expense">
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useUserStore } from "../stores/UserStore";

export default defineComponent({
  props: {
    paycheckId: { type: String, required: true },
  },
  components: {

  },
  data() {
    return {
      userStore: useUserStore(),
      oteName: "",
      oteAmount: 0,
      oteDate: "",
      invalid: false,
    };
  },
  computed: {
    oteData() {
      const oteData = {
        paycheck: this.paycheckId,
        name: this.oteName,
        amount: this.oteAmount,
        date: this.oteDate,
      };
      return oteData;
    },
  },
  methods: {
    clearInfo() {
      this.oteName = "";
      this.oteAmount = 0;
      this.oteDate = "";
    },
    onSubmit() {
      if (this.oteName && this.oteAmount && this.oteDate) {
        this.invalid = false;
        this.$emit("addNew", this.oteData);
          this.clearInfo();
      } else {
        this.invalid = true;
      }
    },
  },
  mounted() {

  },
});
</script>

<style scoped>
.one-time-expense-form-container {
  background-color: greenyellow;
}

.flex-row {
  display: flex;
  text-align: center;
  justify-content: space-around;
  flex-wrap: wrap;
}

.input-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.input-info {
  width: 150px;
  border-radius: 5px;
  border: 2px solid black;
  padding: 0 5px;
}

.input-row label {
  color: var(--text-color);
  margin-bottom: 0;
}

#warning {
  color: rgb(161, 8, 8);
  text-align: center;
  margin-top: 20px;
}

.btn-container {
  text-align: center;
  margin: 10px;
}

@media (max-width: 1024px) {

}
</style>