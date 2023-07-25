<template>
  <footer>
    <p>Back to <RouterLink to="/dashboard">Dashboard</RouterLink></p>
    <div class="footerLinks">
      <a href="https://www.ancportfolio.link" className="social-icon">Portfolio</a>
      <a href="https://github.com/anclark686" target="_blank" rel="noreferrer">
        <img alt="" src="./icons/github.png" class="social-icon" />
      </a>
      <a href="https://www.linkedin.com/in/anclark686/" target="_blank" rel="noreferrer">
        <img alt="" src="./icons/linkedin.png" class="social-icon" />
      </a>
    </div>
    <p>&copy; Reyaly Tech 2023</p>
  </footer>
</template>

<script setup lang="ts">

</script>

<style scoped>
footer {
  background-color: var(--dk-green);
  width: 100%;
  color: white;
  text-align: center;
  margin-top: auto;
  justify-self: flex-end;
}

footer a:visited {
  color: white;
}

.social-icon {
  height: 25px;
  width: 25px;
  margin: 5px;
}
</style>
