<template>
  <table :class="type">
    <tr class="header-row" v-if="number !== 0">
      <td colspan="2">
        <strong>Paycheck {{ number }}</strong>
      </td>
    </tr>
    <tr class="odd">
      <td class="left">
        <strong>Pay:</strong>
      </td>
      <td class="right">
        ${{ pay }}
        {{ rate === "hourly" ? "/hr" : "/yr" }}
      </td>
    </tr>
    <tr class="even">
      <td class="left">
        <strong>Pay Frequency:</strong>
      </td>
      <td class="right">
        {{ frequency }}
      </td>
    </tr>
    <tr class="odd">
      <td class="left">
        <strong>Paycheck Hours:</strong>
      </td>
      <td class="right">
        {{ hours }}
      </td>
    </tr>
    <tr class="even">
      <td class="left">
        <strong>Deductions:</strong>
      </td>
      <td class="right">${{ deductions }}</td>
    </tr>
    <tr class="odd">
      <td class="left">
        <strong>Est Take Home:</strong>
      </td>
      <td class="right">${{ net }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    number: { type: Number, required: true },
    type: { type: String, required: true },
    pay: { type: Number, required: true },
    rate: { type: String, required: true },
    frequency: { type: String, required: true },
    hours: { type: Number, required: true },
    deductions: { type: Number, required: true },
    net: { type: Number, required: true },
  },
});
</script>

<style scoped>
.header-row {
  font-weight: bold;
  background-color: var(--med-green);
  color: white;
  border: none;
  box-shadow: 0 -1px 10px var(--box-shadow);
}

.single {
  width: 90%;
  margin: 20px auto;
  font-size: larger;
  box-shadow: 0 0 10px var(--box-shadow);
}

.double {
  width: 45%;
  margin: 10px auto;
  font-size: large;
  border: none;
  box-shadow: 0 0 10px var(--box-shadow);
}

.left {
  text-align: left;
  padding: 5px 10px;
}

.right {
  text-align: right;
  padding: 5px 10px;
}

.even {
  background-color: var(--row-bg);
}

@media (max-width: 1500px) {
  .single {
    font-size: 1rem;
  }

  .double {
    width: 90%;
    margin: 10px auto;
    font-size: 1rem;
  }
}
</style>
