<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: 'Confirm' },
  danger: { type: Boolean, default: false },
  busy: { type: Boolean, default: false }
})
defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click.self="$emit('cancel')">
    <div class="modal" role="dialog" aria-modal="true">
      <h2>{{ title }}</h2>
      <p class="muted">{{ message }}</p>
      <div class="modal-actions">
        <button class="btn btn-outline" :disabled="busy" @click="$emit('cancel')">Cancel</button>
        <button
          class="btn"
          :class="danger ? 'btn-danger' : 'btn-primary'"
          :disabled="busy"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>