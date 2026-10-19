<script setup>
const links = [
  { to: '/', label: 'Home' },
  { to: '/restaurants', label: 'Restaurants' },
  { to: '/about', label: 'About' },
  { to: '/admin', label: 'Admin' }
]
</script>

<template>
  <header class="navbar">
    <router-link to="/" class="brand">Salo<span>Spot</span></router-link>
    <nav class="nav-links">
      <router-link v-for="link in links" :key="link.to" :to="link.to" class="nav-link">
        {{ link.label }}
      </router-link>
    </nav>
  </header>
</template>