<template>
  <div class="error-component-container">
    <h1>Uh Oh...</h1>
    <h3>A suspicious error has occured - please try again!</h3>
    <p>
      If the issue persists, please feel free to 
      <a href="mailto:reyalytech@gmail.com?subject=Technical Issues">Contact Us</a>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({

});
</script>

<style scoped>
.error-component-container {
  text-align: center;
  margin: 100px;
}

@media (max-width: 1024px) {

}
</style>