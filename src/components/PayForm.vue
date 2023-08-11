<template>
  <table :class="formType === 'new' ? 'pay-info info-centered' : 'pay-info'">
    <tbody>
      <tr class="table-row">
        <td class="pay-label">
          <strong><label for="pay">Pay Rate:</label></strong>
        </td>
        <td class="pay-input">
          <input
            type="number"
            step="0.01"
            id="pay"
            name="pay"
            class="input-info"
            v-model="newPay"
          />
        </td>
      </tr>
      <tr class="table-row">
        <td class="pay-label">
          <strong><label for="rate">Per:</label></strong>
        </td>
        <td class="pay-input">
          <select name="rate" id="rate" class="input-info" v-model="newRate">
            <option value="">--Select One--</option>
            <option value="hourly">Hour</option>
            <option value="annualy">Year</option>
          </select>
        </td>
      </tr>
      <tr class="table-row">
        <td class="pay-label">
          <strong><label for="frequency">Frequency:</label></strong>
        </td>
        <td class="pay-input">
          <select name="frequency" id="frequency" class="input-info" v-model="newFrequency">
            <option value="">--Select One--</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="bi-monthly">Bi-Monthly</option>
          </select>
        </td>
      </tr>
      <tr class="table-row">
        <td class="pay-label">
          <strong><label for="hours">Hours per Paycheck:</label></strong>
        </td>
        <td class="pay-input">
          <input
            type="number"
            step="0.01"
            id="hours"
            name="hours"
            class="input-info"
            v-model="newHours"
          />
        </td>
      </tr>
      <tr class="table-row">
        <td class="pay-label">
          <strong><label for="date">Pay Start Date:</label></strong>
        </td>
        <td class="pay-input">
          <input type="date" id="date" name="date" class="input-info" v-model="newDate" />
        </td>
      </tr>
      <tr class="table-row">
        <td class="pay-label">
          <strong><label for="deductions">Deductions:</label></strong>
        </td>
        <td class="pay-input">
          <input
            type="number"
            id="deductions"
            name="deductions"
            class="input-info"
            v-model="newDeductions"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  props: {
    number: { type: Number, required: true },
    formType: { type: String, required: true },
    pay: { type: Number, required: true },
    rate: { type: String, required: true },
    frequency: { type: String, required: true },
    hours: { type: Number, required: true },
    date: { type: String, required: true },
    deductions: { type: Number, required: true },
  },
  data() {
    return {
      newPay: this.pay,
      newRate: this.rate,
      newFrequency: this.frequency,
      newHours: this.hours,
      newDate: this.date ? this.date : new Date().toISOString().substring(0, 10),
      newDeductions: this.deductions,
    };
  },
  computed: {
    userPayData() {
      const userPayData = {
        number: this.number,
        pay: this.newPay,
        rate: this.newRate,
        frequency: this.newFrequency,
        hours: this.newHours,
        date: this.newDate,
        deductions: this.newDeductions,
      };
      return userPayData;
    },
  },
  watch: {
    userPayData: function () {
      this.$emit("form", this.userPayData)
    }
  },
  methods: {
    onSubmit() {
      console.log("hey");
    },
  },
  // mounted() {
  //   console.log(this.userPayData)
  // }
});
</script>

<style scoped>
.pay-info {
  width: 75%;
}

td {
  width: 50%;
}

.info-centered {
  margin: 0 auto;
}

.input-info {
  width: 150px;
  border-radius: 5px;
  border: 2px solid black;
}

</style>
