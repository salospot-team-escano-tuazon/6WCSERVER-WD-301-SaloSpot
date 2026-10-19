<script setup>
defineProps({
  restaurant: { type: Object, required: true }
})
</script>

<template>
  <article class="card restaurant-card">
    <div class="card-top">
      <h3>{{ restaurant.name }}</h3>
      <span class="badge">{{ restaurant.cuisine }}</span>
    </div>
    <p class="muted">{{ restaurant.address }}</p>
    <p class="rating">&#9733; {{ Number(restaurant.rating).toFixed(1) }}</p>
    <p v-if="restaurant.contact" class="muted">{{ restaurant.contact }}</p>
  </article>
</template>
