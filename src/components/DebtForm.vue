<template>
  <main>
    <form action="submit" class="debt-form" @submit.prevent="onSubmit" @keydown.enter.prevent="">
      <div class="flex-row">
        <div class="input-row">
          <label for="debt-name">Debt Name</label>
          <input type="text" id="debt-name" name="debt-name" class="input-info" v-model="name" />
        </div>
        <div class="input-row">
          <label for="debt-type">Type</label>
          <select name="debt-type" id="debt-type" class="input-info" v-model="type">
            <option value="">--Select One--</option>
            <option value="credit">Credit Card</option>
            <option value="auto">Auto Loan</option>
            <option value="home">Mortgage</option>
            <option value="student">Student Loan</option>
            <option value="personal">Personal Loan</option>
          </select>
        </div>
        <div class="input-row">
          <label for="debt-owed">Amount Owed</label>
          <input
            type="number"
            step="0.01"
            id="debt-owed"
            name="debt-owed"
            class="input-info num-input"
            v-model="owed"
          />
        </div>
      </div>
      <div class="flex-row">
        <div class="input-row">
          <label for="debt-limit">Debt Limit</label>
          <input
            type="number"
            step="0.01"
            id="debt-limit"
            name="debt-limit"
            class="input-info num-input"
            v-model="limit"
          />
        </div>
        <div class="input-row">
          <label for="debt-rate">Interest Rate</label>
          <input
            type="number"
            step="0.01"
            id="debt-rate"
            name="debt-rate"
            class="input-info num-input"
            v-model="rate"
          />
        </div>
        <div class="input-row">
          <label for="debt-payment">Monthly Payment</label>
          <input
            type="number"
            step="0.01"
            id="debt-payment"
            name="debt-payment"
            class="input-info num-input"
            v-model="payment"
          />
        </div>
      </div>
      <div class="input-row" v-if="pageType === 'new'">
        <input type="submit" id="submit-debt" class="btn btn-success" value="Add Debt" />
      </div>

      <div class="btn-container" v-if="pageType === 'edit'">
        <button class="btn btn-danger edit-btn" @click.prevent="$emit('cancel')">Cancel</button>
        <button class="btn btn-success edit-btn">Confirm</button>
      </div>
    </form>
    <p v-if="invalid" id="warning">Please ensure all fields are filled.</p>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    pageType: { type: String, required: true },
    debt: { type: Object, required: true },
  },
  data() {
    return {
      name: this.debt.name,
      type: this.debt.type,
      owed: this.debt.owed,
      limit: this.debt.limit,
      rate: this.debt.rate,
      payment: this.debt.payment,
      invalid: false,
    };
  },
  computed: {
    debtData() {
      const debtData = {
        id: this.debt.id,
        name: this.name,
        type: this.type,
        owed: this.owed,
        limit: this.limit,
        rate: this.rate,
        payment: this.payment,
      };
      return debtData;
    },
  },
  methods: {
    clearInfo() {
      this.name = "";
      this.type = "";
      this.owed = 0;
      this.limit = 0;
      this.rate = 0;
      this.payment = 0;
    },
    onSubmit() {
      if (this.name && this.type) {
        this.invalid = false;
        if (this.pageType === "new") {
          this.$emit("addDebt", this.debtData);
          this.clearInfo();
        } else if (this.pageType === "edit") {
          this.$emit("editDebt", this.debtData);
        }
      } else {
        this.invalid = true;
      }
    },
  },
});
</script>

<style scoped>
.debt-form {
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
}

.num-input {
  text-align: right;
}

.input-row label {
  color: var(--text-color);
  margin-bottom: 0;
}

#submit-expense {
  margin: 10px;
}

.btn-container {
  align-self: center;
}

.edit-btn {
  margin: 5px;
}

#warning {
  color: rgb(161, 8, 8);
  text-align: center;
  margin-top: 20px;
}
</style>
