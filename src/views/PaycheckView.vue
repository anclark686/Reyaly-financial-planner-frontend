<template>
  <main class="paycheck-container">
    <header>
      <h1 class="page-header">Paycheck View</h1>
    </header>
    <section>
      <div class="card">
        <div class="card-header">
          <button class="arrow-btn btn" @click="changeDate('previous')">
            <img
              src="../components/icons/arrow-left.png"
              alt="left-arrow"
              class="arrow-img"
            />
          </button>
          <div v-if="loading" class="spinner-border text-success" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2 class="subheader" v-else>{{ paycheck }}</h2>
          <button class="arrow-btn btn" @click="changeDate('next')">
            <img
              src="../components/icons/arrow-right.png"
              alt="right-arrow"
              class="arrow-img"
            />
          </button>
        </div>
        
        <PaycheckInfo
          v-if="showPaycheckCard"
          :date="paycheck"
          :frequency="userStore.payFreq"
        />
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { defineComponent } from "vue";

import PaycheckInfo from "../components/PaycheckInfo.vue";
import { useUserStore } from "../stores/UserStore";

export default defineComponent({
  setup() {
    const { user } = useAuth0();

    return {
      user,
    };
  },
  components: {
    PaycheckInfo,
  },
  data() {
    return {
      userStore: useUserStore(),
      showPaycheckCard: false,
      paycheck: "",
      loading: false,
    };
  },
  computed: {
    firstShown() {
      console.log();
      return this.userStore.pIndex;
    },
  },
  methods: {
    changeDate(direction: string) {
      if (direction === "next") {
        if (this.userStore.pIndex < this.userStore.paychecks.length - 1) {
          this.userStore.pIndex++;
          const badDateStr =
            this.userStore.paychecks[this.userStore.pIndex].date;
          const rawDate = new Date(badDateStr);
          this.paycheck = this.userStore.formatDays(rawDate);
        }
      } else {
        if (this.userStore.pIndex > 0) {
          this.userStore.pIndex--;
          const badDateStr =
            this.userStore.paychecks[this.userStore.pIndex].date;
          const rawDate = new Date(badDateStr);
          this.paycheck = this.userStore.formatDays(rawDate);
        }
      }
    },
  },
  async mounted() {
    this.loading = true 
    await this.userStore.fill(this.user.sub);
    const badDateStr = this.userStore.paychecks[this.userStore.pIndex].date;
      const rawDate = new Date(badDateStr);
      this.paycheck = this.userStore.formatDays(rawDate);
      this.loading = false;
      this.showPaycheckCard = true;
  },
});
</script>

<style scoped>
.card {
  width: 50%;
  margin: 20px auto;
  background-color: var(--white-black);
  color: var(--text-color);
}

.card-header {
  text-align: center;
  display: flex;
  justify-content: center;
}

.arrow-btn {
  height: 35px;
  width: 35px;
  margin: 0 5px;
  color: white;
  padding: 0px;
  background-color: white;
}

.arrow-img {
  height: 25px;
  width: 25px;
  color: white;
}
</style>
