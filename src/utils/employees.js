// Employee management utilities for local storage

const EMPLOYEES_STORAGE_KEY = 'tmobile_employees'

// Get all employees for a specific store
export function getEmployees(store) {
  const allEmployees = getAllEmployees()
  return allEmployees[store] || []
}

// Get all employees across all stores
export function getAllEmployees() {
  const data = localStorage.getItem(EMPLOYEES_STORAGE_KEY)
  if (!data) return {}

  try {
    return JSON.parse(data)
  } catch (error) {
    console.error('Error parsing employee data:', error)
    return {}
  }
}

// Add an employee to a store
export function addEmployee(store, employeeName) {
  const allEmployees = getAllEmployees()

  if (!allEmployees[store]) {
    allEmployees[store] = []
  }

  // Check if employee already exists (case-insensitive)
  const exists = allEmployees[store].some(
    emp => emp.toLowerCase() === employeeName.toLowerCase()
  )

  if (!exists && employeeName.trim()) {
    allEmployees[store].push(employeeName.trim())
    allEmployees[store].sort() // Keep alphabetical
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(allEmployees))
    return true
  }

  return false
}

// Remove an employee from a store
export function removeEmployee(store, employeeName) {
  const allEmployees = getAllEmployees()

  if (allEmployees[store]) {
    allEmployees[store] = allEmployees[store].filter(
      emp => emp !== employeeName
    )
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(allEmployees))
    return true
  }

  return false
}

// Check if an employee exists in a store
export function employeeExists(store, employeeName) {
  const employees = getEmployees(store)
  return employees.some(
    emp => emp.toLowerCase() === employeeName.toLowerCase()
  )
}
