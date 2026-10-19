<script setup>
import { ref, watch, onMounted } from 'vue'
import {
  loginRequest,
  getAdminRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  errorMessage
} from '../services/api'
import { isLoggedIn, username, sessionExpired, setSession, clearSession } from '../services/auth'
import Pagination from '../components/Pagination.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import RestaurantFormModal from '../components/RestaurantFormModal.vue'

/* ---------- Login ---------- */
const loginForm = ref({ username: '', password: '' })
const loggingIn = ref(false)
const loginError = ref('')

async function doLogin() {
  loginError.value = ''
  if (!loginForm.value.username.trim() || !loginForm.value.password) {
    loginError.value = 'Enter your username and password.'
    return
  }
  loggingIn.value = true
  try {
    const data = await loginRequest(loginForm.value.username, loginForm.value.password)
    setSession(data.token, data.user.username)
    loginForm.value = { username: '', password: '' }
  } catch (err) {
    loginError.value = errorMessage(err, 'Could not log in. Is the API running?')
  } finally {
    loggingIn.value = false
  }
}

function logout() {
  clearSession()
  items.value = []
  notice.value = ''
  error.value = ''
}

/* ---------- Dashboard ---------- */
const q = ref('')
const page = ref(1)
const items = ref([])
const total = ref(0)
const totalPages = ref(1)
const loading = ref(false)
const error = ref('')
const notice = ref('')

// Add/edit modal state
const formOpen = ref(false)
const editing = ref(null)
const saving = ref(false)
const formError = ref('')

// Delete confirm modal state
const deleteTarget = ref(null)
const deleting = ref(false)

let timer = null

async function load() {
  if (!isLoggedIn.value) return
  loading.value = true
  error.value = ''
  try {
    const data = await getAdminRestaurants({
      q: q.value,
      page: page.value,
      limit: 10,
      sort: 'createdAt',
      order: 'desc'
    })
    items.value = data.items
    total.value = data.total
    totalPages.value = data.totalPages
  } catch (err) {
    if (isLoggedIn.value) {
      error.value = errorMessage(err, 'Could not load restaurants. Make sure the API is running.')
    }
  } finally {
    loading.value = false
  }
}

function onSearch() {
  page.value = 1
  clearTimeout(timer)
  timer = setTimeout(load, 300)
}

function onPageChange(next) {
  page.value = next
  load()
}

function openAdd() {
  editing.value = null
  formError.value = ''
  formOpen.value = true
}

function openEdit(restaurant) {
  editing.value = restaurant
  formError.value = ''
  formOpen.value = true
}

async function saveForm(data) {
  saving.value = true
  formError.value = ''
  try {
    if (editing.value) {
      await updateRestaurant(editing.value.restaurant_id, data)
      notice.value = 'Restaurant updated.'
    } else {
      const created = await createRestaurant(data)
      q.value = ''
      page.value = 1
      notice.value = `${created.name} was added (ID ${created.restaurant_id}).`
    }
    formOpen.value = false
    await load()
  } catch (err) {
    formError.value = errorMessage(err, 'Could not save the restaurant.')
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  deleting.value = true
  try {
    await deleteRestaurant(deleteTarget.value.restaurant_id)
    notice.value = `${deleteTarget.value.name} was deleted.`
    deleteTarget.value = null
    await load()
  } catch (err) {
    error.value = errorMessage(err, 'Could not delete the restaurant.')
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

// Load the list right after logging in.
watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) load()
  else {
    formOpen.value = false
    deleteTarget.value = null
  }
})

onMounted(load)
</script>

<template>
  <section>
    <!-- Login screen -->
    <div v-if="!isLoggedIn" class="card form-card">
      <h1>Admin login</h1>
      <p class="muted">Only administrators can add, edit, or delete restaurants.</p>

      <div v-if="sessionExpired" class="alert alert-warn">
        Your session expired. Please log in again.
      </div>
      <div v-if="loginError" class="alert alert-error">{{ loginError }}</div>

      <form @submit.prevent="doLogin">
        <div class="field">
          <label for="l-user">Username</label>
          <input
            id="l-user"
            v-model="loginForm.username"
            type="text"
            autocomplete="username"
          />
        </div>
        <div class="field">
          <label for="l-pass">Password</label>
          <input
            id="l-pass"
            v-model="loginForm.password"
            type="password"
            autocomplete="current-password"
          />
        </div>
        <button class="btn btn-primary" type="submit" :disabled="loggingIn">
          {{ loggingIn ? 'Logging in...' : 'Log in' }}
        </button>
      </form>
    </div>

    <!-- Dashboard -->
    <template v-else>
      <div class="admin-head">
        <div>
          <h1>Admin</h1>
          <p class="muted">
            Logged in as {{ username }} &middot;
            {{ total }} {{ total === 1 ? 'restaurant' : 'restaurants' }} in the directory
          </p>
        </div>
        <div class="row-actions">
          <button class="btn btn-primary" @click="openAdd">Add restaurant</button>
          <button class="btn btn-outline" @click="logout">Log out</button>
        </div>
      </div>

      <div v-if="notice" class="alert alert-success">{{ notice }}</div>
      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <div class="toolbar">
        <input
          v-model="q"
          class="search"
          type="search"
          placeholder="Search by name, cuisine or address"
          @input="onSearch"
        />
      </div>

      <p v-if="loading" class="empty">Loading...</p>
      <p v-else-if="!items.length" class="empty">No restaurants found.</p>
      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Cuisine</th>
              <th>Address</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in items" :key="r.restaurant_id">
              <td>{{ r.restaurant_id }}</td>
              <td>{{ r.name }}</td>
              <td>{{ r.cuisine }}</td>
              <td>{{ r.address }}</td>
              <td>{{ Number(r.rating).toFixed(1) }}</td>
              <td>
                <div class="row-actions">
                  <button class="btn btn-outline btn-sm" @click="openEdit(r)">Edit</button>
                  <button class="btn btn-danger btn-sm" @click="deleteTarget = r">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination :page="page" :total-pages="totalPages" @change="onPageChange" />

      <RestaurantFormModal
        :show="formOpen"
        :restaurant="editing"
        :saving="saving"
        :error="formError"
        @save="saveForm"
        @cancel="formOpen = false"
      />

      <ConfirmModal
        :show="!!deleteTarget"
        title="Delete restaurant?"
        :message="deleteTarget ? `${deleteTarget.name} will be permanently removed.` : ''"
        confirm-text="Delete"
        danger
        :busy="deleting"
        @confirm="confirmDelete"
        @cancel="deleteTarget = null"
      />
    </template>
  </section>
</template>