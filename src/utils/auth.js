// Manager password utilities

const MANAGER_PASSWORD_KEY = 'manager_password'
const DEFAULT_PASSWORD = 'manager123' // Can be changed by managers

// Check if password is set, if not use default
export function getManagerPassword() {
  const password = localStorage.getItem(MANAGER_PASSWORD_KEY)
  return password || DEFAULT_PASSWORD
}

// Set a new manager password
export function setManagerPassword(newPassword) {
  localStorage.setItem(MANAGER_PASSWORD_KEY, newPassword)
}

// Validate password
export function validateManagerPassword(inputPassword) {
  return inputPassword === getManagerPassword()
}

// Check if manager is currently authenticated (session-based)
const SESSION_KEY = 'manager_authenticated'

export function setManagerAuthenticated() {
  sessionStorage.setItem(SESSION_KEY, 'true')
}

export function isManagerAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === 'true'
}

export function logoutManager() {
  sessionStorage.removeItem(SESSION_KEY)
}
