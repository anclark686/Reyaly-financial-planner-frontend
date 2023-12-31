<template>
  <section class="page-content">
    <div class="component-container" v-if="!userStore.error">
      <h1 class="page-header">Currency Converter</h1>
      <div class="converter-container">
        <CurrencyConverter
          @convert="getCurrencyData"
          :currencies="currencyList"
          :conversionData="conversionData"
          :exchangeData="exchangeData"
        />
      </div>
    </div>
    <div class="error-container" v-else>
      <ErrorComponent />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

import { useUserStore } from "../stores/UserStore";
import CurrencyConverter from "../components/CurrencyConverter.vue";
import ErrorComponent from "../components/ErrorComponent.vue";

export default defineComponent({
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  components: {
    CurrencyConverter,
    ErrorComponent,
  },
  data() {
    return {
      userStore: useUserStore(),
      conversionData: { new_amount: 0, new_currency: "-", old_amount: 0, old_currency: "-" },
      exchangeData: { currency_pair: "", exchange_rate: 0 },
    };
  },
  computed: {
    currencyList(): string[] {
      return this.userStore.currencies;
    },
  },
  methods: {
    async getCurrencyData(data: { want: string; have: string; amount: number }): Promise<any> {
      await this.userStore
        .getCurrencyInfo(data.want, data.have, data.amount)
        .then((res) => {
          this.conversionData = res.data.conversion;
          this.exchangeData = res.data.exchange;
        })
        .catch((err) => console.log(err));
    },
  },
});
</script>

<style scoped>
.converter-container {
  min-width: 400px;
  width: 65%;
  background-color: var(--green-bg);
  color: var(--text-color);
  border-radius: var(--border-radius);
  margin: 70px 50px;
  text-align: center;
  box-shadow: 0 0 10px var(--box-shadow);
  padding: 30px;
  height: fit-content;
  margin: 75px auto;
}

@media (max-width: 1024px) {
  .converter-container {
    width: 90%;
    margin: 20px auto;
  }
}
</style>
