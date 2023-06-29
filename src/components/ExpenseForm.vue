<template>
  <div>
    <form 
      action="submit" 
      class="expense-form" 
      @submit.prevent="onSubmit"
      @keydown.enter.prevent=""
    >
      <div class="input-row">
        <label for="expense-name">Expense Name</label>
        <input type="text" id="expense-name" name="expense-name" v-model="name"/>
      </div>
      <div class="input-row">
        <label for="expense-amount">Amount</label>
        <input type="number" step="0.01" id="expense-amount" name="expense-amount" v-model="amount"/>
      </div>
      <div class="input-row">
        <label for="expense-date">Due Date</label>
        <select name="expense-date" id="expense-date" v-model="date">
          <option value="">--Select One --</option>
          <option v-for="num in dateArr" v-bind:key="num" :value="num">
            {{ num }}
          </option>
        </select>
      </div>
      <div class="input-row">
        <input
          type="submit"
          id="submit-expense"
          class="btn btn-success"
          value="Add Expense"
        />
      </div>
    </form>
    <p v-if="invalid" id="warning">Please ensure all fields are filled.</p>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    pageType: String,
  },
  data() {
    return {
      name: "",
      amount: 0,
      date: "",
      invalid: false,
    };
  },
  computed: {
    dateArr() {
      const dateArr = Array.from({ length: 31 }, (value, index) => index + 1);
      return dateArr;
    },
    expenseData() {
      const expenseData = {
        name: this.name,
        amount: this.amount,
        date: this.date,
      };
      return expenseData;
    },
  },
  methods: {
    clearinfo() {
      this.name = "";
      this.amount = 0;
      this.date = "";
    },
    onSubmit() {
      if (this.name && this.amount && this.date) {
        this.invalid = false;
        this.$emit("addInfo", this.expenseData);
        this.clearinfo()
      } else {
        this.invalid = true;
      }
      
    }
  },
  // mounted() {
  //   console.log(this.dateArr);
  // },
};
</script>

<style scoped>
.subheader {
  text-align: center;
}

.expense-form {
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

.input-row label {
  font-weight: bold;
}

#expense-name,
#expense-amount,
#expense-date {
  width: 150px;
  border-radius: 5px;
  border: 2px solid black;
}

#expense-amount {
  text-align: right;
}

#submit-expense {
  margin-top: 10px;
}

#warning {
  color: rgb(161, 8, 8);
  text-align: center;
  margin-top: 20px;
}
</style>
