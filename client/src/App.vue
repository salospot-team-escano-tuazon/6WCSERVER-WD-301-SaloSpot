<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar />
  <main class="page">
    <router-view />
  </main>
  <footer class="footer">
    <p>SaloSpot &copy; 2026. Find where to eat, together.</p>
  </footer>
</template>