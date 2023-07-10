<script setup lang="ts">
import { useUserStore } from "../stores/UserStore";

const data = () => {
  return {
    userStore: useUserStore(),
  };
};

const doSomething = () => {
  const userStore = useUserStore();
  console.log(userStore.dbUserId);
};
</script>

<template>
  <div class="home">
    <h1>Home</h1>
    <button @click="doSomething">click</button>
  </div>
</template>
