<script setup>
const props = defineProps({
  filters: { type: Object, required: true },
  cuisines: { type: Array, default: () => [] }
})
const emit = defineEmits(['change'])

function update(key, value) {
  emit('change', { ...props.filters, [key]: value })
}

function updateSort(value) {
  const [sort, order] = value.split(':')
  emit('change', { ...props.filters, sort, order })
}
</script>

<template>
  <div class="toolbar">
    <input
      class="search"
      type="search"
      placeholder="Search by name, cuisine or address"
      :value="filters.q"
      @input="update('q', $event.target.value)"
    />
    <select :value="filters.cuisine" @change="update('cuisine', $event.target.value)">
      <option value="">All cuisines</option>
      <option v-for="c in cuisines" :key="c" :value="c">{{ c }}</option>
    </select>
    <select :value="`${filters.sort}:${filters.order}`" @change="updateSort($event.target.value)">
      <option value="name:asc">Name, A to Z</option>
      <option value="name:desc">Name, Z to A</option>
      <option value="rating:desc">Rating, high to low</option>
      <option value="rating:asc">Rating, low to high</option>
      <option value="createdAt:desc">Newest first</option>
    </select>
  </div>
</template>