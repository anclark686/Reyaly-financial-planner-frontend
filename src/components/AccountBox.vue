<template>
  <section>
    {{ account }}
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import { useUserStore } from "../stores/UserStore";
import { type Expense } from "../types";
import { type Account } from "../types";

export default defineComponent({
  props: {
    account: {
      type: Object as PropType<Account>,
      required: true
    },  
  },
  data() {
    return {
      userStore: useUserStore(),
      expenseList: [] as Expense[],
      edit: false,
    }
  },
})
</script>

<style scoped>

</style>