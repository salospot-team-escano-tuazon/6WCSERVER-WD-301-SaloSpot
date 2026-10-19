<script setup>
import { ref, onMounted } from 'vue'
import { getRestaurants, getCuisines } from '../services/api'
import RestaurantCard from '../components/RestaurantCard.vue'
import SearchBar from '../components/SearchBar.vue'
import Pagination from '../components/Pagination.vue'

const filters = ref({ q: '', cuisine: '', sort: 'name', order: 'asc' })
const page = ref(1)
const items = ref([])
const total = ref(0)
const totalPages = ref(1)
const cuisines = ref([])
const loading = ref(false)
const error = ref('')

let timer = null

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await getRestaurants({ ...filters.value, page: page.value, limit: 9 })
    items.value = data.items
    total.value = data.total
    totalPages.value = data.totalPages
  } catch {
    error.value = 'Could not load restaurants. Make sure the API is running.'
  } finally {
    loading.value = false
  }
}

function onFilterChange(next) {
  filters.value = next
  page.value = 1
  clearTimeout(timer)
  timer = setTimeout(load, 300)
}

function onPageChange(next) {
  page.value = next
  load()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  cuisines.value = await getCuisines().catch(() => [])
  load()
})
</script>

<template>
  <section>
    <div class="section-head">
      <h1>Restaurants</h1>
      <p>{{ total }} {{ total === 1 ? 'place' : 'places' }} found</p>
    </div>

    <SearchBar :filters="filters" :cuisines="cuisines" @change="onFilterChange" />

    <div v-if="error" class="alert alert-error">{{ error }}</div>
    <p v-else-if="loading" class="empty">Loading restaurants...</p>
    <p v-else-if="!items.length" class="empty">No restaurants match your search.</p>
    <div v-else class="grid">
      <RestaurantCard v-for="r in items" :key="r.restaurant_id" :restaurant="r" />
    </div>

    <Pagination :page="page" :total-pages="totalPages" @change="onPageChange" />
  </section>
</template>