<template>
  <div class="error-component-container">
    <img src="../assets/error.png" alt="error" id="error-image" />
    <h1 class="error-text">Uh Oh...</h1>
    <h3 class="error-text">A suspicious error has occured - Let's try that again!</h3>
    <h3 class="error-text">
      <button class="click-here" @click="refreshScreen">Click Here</button>
      to refresh
    </h3>

    <h5 class="error-text">
      If the issue persists, please feel free to
      <a href="mailto:reyalytech@gmail.com?subject=Technical Issues">Contact Us</a>
    </h5>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    refreshScreen(): void {
      window.location.reload();
    },
  },
});
</script>

<style scoped>
.error-component-container {
  text-align: center;
  margin-bottom: 100px;
  color: var(--text-color);
}

#error-image {
  margin: 50px auto;
  width: 500px;
  border-radius: 10px;
}

.error-text {
  margin-bottom: 20px;
}

.click-here {
  color: var(--med-green);
  text-decoration: underline;
  background-color: inherit;
  border: none;
  padding: 0;
}

@media (max-width: 600px) {
  #error-image {
    width: 75%;
  }
}
</style>
