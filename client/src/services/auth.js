import { ref, computed } from 'vue'

const TOKEN_KEY = 'salospot_token'
const USER_KEY = 'salospot_user'

// sessionStorage clears when the tab closes. Reads and writes are wrapped
// in try/catch in case storage is unavailable.
function read(key) {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    if (value === null) sessionStorage.removeItem(key)
    else sessionStorage.setItem(key, value)
  } catch {
    // ignore storage errors
  }
}

export const token = ref(read(TOKEN_KEY))
export const username = ref(read(USER_KEY))
export const sessionExpired = ref(false)
export const isLoggedIn = computed(() => !!token.value)

export function setSession(newToken, name) {
  token.value = newToken
  username.value = name
  sessionExpired.value = false
  write(TOKEN_KEY, newToken)
  write(USER_KEY, name)
}

export function clearSession(expired = false) {
  token.value = null
  username.value = null
  sessionExpired.value = expired
  write(TOKEN_KEY, null)
  write(USER_KEY, null)
}