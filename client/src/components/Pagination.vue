<script setup>
defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})
defineEmits(['change'])
</script>

<template>
  <div v-if="totalPages > 1" class="pagination">
    <button class="btn btn-outline btn-sm" :disabled="page <= 1" @click="$emit('change', page - 1)">
      Previous
    </button>
    <span class="muted">Page {{ page }} of {{ totalPages }}</span>
    <button class="btn btn-outline btn-sm" :disabled="page >= totalPages" @click="$emit('change', page + 1)">
      Next
    </button>
  </div>
</template>