<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  restaurant: { type: Object, default: null },
  saving: { type: Boolean, default: false },
  error: { type: String, default: '' }
})
const emit = defineEmits(['save', 'cancel'])

const blank = () => ({ name: '', cuisine: '', address: '', rating: 0, contact: '' })
const form = reactive(blank())
const localError = ref('')

// Reset the form each time the modal opens.
watch(
  () => props.show,
  (open) => {
    if (!open) return
    localError.value = ''
    const r = props.restaurant
    Object.assign(
      form,
      blank(),
      r
        ? {
            name: r.name,
            cuisine: r.cuisine,
            address: r.address,
            rating: r.rating,
            contact: r.contact || ''
          }
        : {}
    )
  },
  { immediate: true }
)

function submit() {
  localError.value = ''
  const name = String(form.name || '').trim()
  const cuisine = String(form.cuisine || '').trim()
  const address = String(form.address || '').trim()
  const contact = String(form.contact || '').trim()
  const rating = Number(form.rating)

  if (!name || !cuisine || !address) {
    localError.value = 'Name, cuisine, and address are required.'
    return
  }
  if (Number.isNaN(rating) || rating < 0 || rating > 5) {
    localError.value = 'Rating must be a number from 0 to 5.'
    return
  }

  emit('save', { name, cuisine, address, rating, contact })
}
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click.self="$emit('cancel')">
    <div class="modal" role="dialog" aria-modal="true">
      <h2>{{ restaurant ? 'Edit restaurant' : 'Add restaurant' }}</h2>
      <p v-if="restaurant" class="muted">ID: {{ restaurant.restaurant_id }}</p>

      <div v-if="localError || error" class="alert alert-error">{{ localError || error }}</div>

      <div class="field">
        <label for="f-name">Name</label>
        <input id="f-name" v-model="form.name" type="text" />
      </div>
      <div class="field">
        <label for="f-cuisine">Cuisine</label>
        <input id="f-cuisine" v-model="form.cuisine" type="text" />
      </div>
      <div class="field">
        <label for="f-address">Address</label>
        <input id="f-address" v-model="form.address" type="text" />
      </div>
      <div class="field-row">
        <div class="field">
          <label for="f-rating">Rating (0 to 5)</label>
          <input id="f-rating" v-model="form.rating" type="number" min="0" max="5" step="0.1" />
        </div>
        <div class="field">
          <label for="f-contact">Contact</label>
          <input id="f-contact" v-model="form.contact" type="text" />
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn btn-outline" :disabled="saving" @click="$emit('cancel')">Cancel</button>
        <button class="btn btn-primary" :disabled="saving" @click="submit">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>