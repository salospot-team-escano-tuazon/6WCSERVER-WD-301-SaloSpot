<script setup>
import { ref, onMounted } from 'vue'
import { getRestaurants } from '../services/api'
import RestaurantCard from '../components/RestaurantCard.vue'

const featured = ref([])

onMounted(async () => {
  try {
    const data = await getRestaurants({ sort: 'rating', order: 'desc', limit: 3 })
    featured.value = data.items
  } catch {
    featured.value = []
  }
})
</script>

<template>
  <section class="hero">
    <h1>Find your next favorite <span class="accent">spot</span>.</h1>
    <p>Browse local restaurants, search by cuisine, and compare ratings in one place.</p>
    <div class="hero-actions">
      <router-link to="/restaurants" class="btn btn-primary">Browse Restaurants</router-link>
      <router-link to="/about" class="btn btn-outline">About SaloSpot</router-link>
    </div>
  </section>

  <section v-if="featured.length" class="home-section">
    <div class="section-head">
      <h2>Top rated</h2>
      <p>Highest rated restaurants right now.</p>
    </div>
    <div class="grid">
      <RestaurantCard v-for="r in featured" :key="r.restaurant_id" :restaurant="r" />
    </div>
  </section>

  <section class="home-section">
    <div class="section-head">
      <h2>How SaloSpot works</h2>
    </div>
    <div class="steps">
      <div class="card">
        <div class="step-number">1</div>
        <h3>Search</h3>
        <p class="muted">Look up restaurants by name, cuisine, or area.</p>
      </div>
      <div class="card">
        <div class="step-number">2</div>
        <h3>Compare</h3>
        <p class="muted">Sort by rating and filter by cuisine to narrow your options.</p>
      </div>
      <div class="card">
        <div class="step-number">3</div>
        <h3>Eat</h3>
        <p class="muted">Get the address and contact number, then go enjoy your meal.</p>
      </div>
    </div>
  </section>
</template>