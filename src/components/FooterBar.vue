<template>
    <footer>
        <p>Back to <RouterLink to="/dashboard">Dashboard</RouterLink></p>
        <p>
            <RouterLink to="/about">About Us</RouterLink>
            |
            <RouterLink to="/contact">Contact Us</RouterLink>
        </p>
        <p>&copy; Reyaly Tech 2023</p>
    </footer>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

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
</style>