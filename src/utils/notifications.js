// Activity logging for management notifications

const ACTIVITY_LOG_KEY = 'tmobile_quote_activity'

// Log when a rep starts a quote
export function logQuoteActivity(activity) {
  const log = getActivityLog()
  log.push({
    ...activity,
    id: Date.now() + Math.random(), // unique ID
  })

  // Keep only last 500 activities to prevent storage issues
  const trimmedLog = log.slice(-500)
  localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(trimmedLog))
}

// Get all activity logs
export function getActivityLog() {
  const data = localStorage.getItem(ACTIVITY_LOG_KEY)
  if (!data) return []

  try {
    return JSON.parse(data)
  } catch (error) {
    console.error('Error parsing activity log:', error)
    return []
  }
}

// Get activity for a specific store
export function getStoreActivity(store) {
  const log = getActivityLog()
  return log.filter(activity => activity.store === store)
}

// Get activity for a specific employee
export function getEmployeeActivity(employee) {
  const log = getActivityLog()
  return log.filter(activity => activity.employee === employee)
}

// Get today's activity
export function getTodayActivity() {
  const log = getActivityLog()
  const today = new Date().toDateString()

  return log.filter(activity => {
    const activityDate = new Date(activity.timestamp).toDateString()
    return activityDate === today
  })
}

// Clear old activity logs (optional - can be called by managers)
export function clearActivityLog() {
  localStorage.removeItem(ACTIVITY_LOG_KEY)
}
