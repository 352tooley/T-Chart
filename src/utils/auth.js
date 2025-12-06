// Manager password utilities - Store-specific

const STORE_PASSWORDS_KEY = 'store_manager_passwords'
const DEFAULT_PASSWORD = 'manager123'

// Get all store passwords
function getAllStorePasswords() {
  const data = localStorage.getItem(STORE_PASSWORDS_KEY)
  if (!data) return {}

  try {
    return JSON.parse(data)
  } catch (error) {
    console.error('Error parsing store passwords:', error)
    return {}
  }
}

// Get password for a specific store
export function getStorePassword(store) {
  const passwords = getAllStorePasswords()
  return passwords[store] || DEFAULT_PASSWORD
}

// Set password for a specific store
export function setStorePassword(store, newPassword) {
  const passwords = getAllStorePasswords()
  passwords[store] = newPassword
  localStorage.setItem(STORE_PASSWORDS_KEY, JSON.stringify(passwords))
}

// Validate password for a specific store
export function validateStorePassword(store, inputPassword) {
  return inputPassword === getStorePassword(store)
}

// Session management - store which store manager is authenticated for
const SESSION_STORE_KEY = 'manager_authenticated_store'

export function setManagerAuthenticated(store) {
  sessionStorage.setItem(SESSION_STORE_KEY, store)
}

export function getAuthenticatedStore() {
  return sessionStorage.getItem(SESSION_STORE_KEY)
}

export function isManagerAuthenticated(store) {
  return sessionStorage.getItem(SESSION_STORE_KEY) === store
}

export function logoutManager() {
  sessionStorage.removeItem(SESSION_STORE_KEY)
}
