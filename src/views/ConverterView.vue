<template>
  <section class="page-content">
    <h1 class="page-header">Currency Converter</h1>
    <div class="converter-container">
      <CurrencyConverter
        @convert="getCurrencyData"
        :currencies="currencyList"
        :conversionData="conversionData"
        :exchangeData="exchangeData"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

import CurrencyConverter from "../components/CurrencyConverter.vue";
import { useUserStore } from "../stores/UserStore";

export default defineComponent({
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  components: {
    CurrencyConverter,
  },
  data() {
    return {
      userStore: useUserStore(),
      conversionData: { new_amount: 0, new_currency: "-", old_amount: 0, old_currency: "-" },
      exchangeData: { currency_pair: "", exchange_rate: 0 },
    };
  },
  computed: {
    currencyList() {
      return this.userStore.currencies;
    },
  },
  methods: {
    async getCurrencyData(data: { want: string; have: string; amount: number }) {
      await this.userStore
        .getCurrencyInfo(data.want, data.have, data.amount)
        .then((res) => {
          this.conversionData = res.data.conversion;
          this.exchangeData = res.data.exchange;
        })
        .catch((err) => console.log(err));
    },
  },
  async mounted() {},
});
</script>

<style scoped>
.converter-container {
  min-width: 400px;
  width: 40%;
  background-color: var(--green-bg);
  color: var(--text-color);
  border-radius: 15px;
  margin: 70px 50px;
  text-align: center;
  border: 2px solid black;
  padding: 30px;
  height: fit-content;
  margin: 75px auto;
}
</style>
