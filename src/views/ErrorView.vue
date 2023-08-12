<template>
  <div class="not-found-page">
    <div class="image-container">
      <img src="../assets/404.png" alt="404" id="not-found-image" />
    </div>
    <div class="nav-button">
      <RouterLink to="/" class="view-box">
        <h2>Home</h2>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.not-found-page {
  text-align: center;
}

#not-found-image {
  margin: 50px auto;
  width: 75%;
}

.nav-button {
  width: 75%;
  margin: 20px auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.view-box {
  background-color: var(--btn-main);
  min-width: 375px;
  width: 40%;
  height: 80px;
  text-align: center;
  border-radius: 15px;
  border: 2px solid black;
  color: var(--dk-green);
  margin: 5px;
  text-decoration: none;
}

.view-box:hover {
  background-color: var(--btn-hover);
}

.view-box:active {
  transform: translateY(2px);
}

.view-box h2 {
  margin: auto;
  padding: 18px;
  color: white;
  text-decoration: none;
}

@media (max-width: 1024px) {
  #not-found-image {
    width: 100%;
  }
  .view-box {
    width: 30%;
    margin: 10px;
  }
  .view-box h2 {
    font-size: 2rem;
  }
}
</style>
