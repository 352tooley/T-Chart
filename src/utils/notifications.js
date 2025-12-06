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

// Get this week's activity (Monday to Sunday)
export function getThisWeekActivity() {
  const log = getActivityLog()
  const now = new Date()

  // Get Monday of this week
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is Sunday
  const monday = new Date(now.setDate(diff))
  monday.setHours(0, 0, 0, 0)

  return log.filter(activity => {
    const activityDate = new Date(activity.timestamp)
    return activityDate >= monday
  })
}

// Get this month's activity (1st to today)
export function getThisMonthActivity() {
  const log = getActivityLog()
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  firstDay.setHours(0, 0, 0, 0)

  return log.filter(activity => {
    const activityDate = new Date(activity.timestamp)
    return activityDate >= firstDay
  })
}

// Get activity for a specific store and time period
export function getStoreActivityByPeriod(store, period) {
  let activities

  switch(period) {
    case 'today':
      activities = getTodayActivity()
      break
    case 'week':
      activities = getThisWeekActivity()
      break
    case 'month':
      activities = getThisMonthActivity()
      break
    default:
      activities = getActivityLog()
  }

  return activities.filter(activity => activity.store === store)
}

// Get activity for a specific employee and store
export function getEmployeeStoreActivity(store, employee) {
  const log = getActivityLog()
  return log.filter(activity =>
    activity.store === store && activity.employee === employee
  )
}

// Clear old activity logs (optional - can be called by managers)
export function clearActivityLog() {
  localStorage.removeItem(ACTIVITY_LOG_KEY)
}
