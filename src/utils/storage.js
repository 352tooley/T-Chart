// Local storage utilities for T-Chart data

const STORAGE_KEY = 'tmobile_tcharts'

// Save a new T-Chart to local storage
export function saveTChart(tchartData) {
  const existing = getTCharts()
  existing.push(tchartData)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}

// Get all T-Charts from local storage
export function getTCharts() {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []

  try {
    return JSON.parse(data)
  } catch (error) {
    console.error('Error parsing T-Chart data:', error)
    return []
  }
}

// Export T-Charts to Google Sheets format (CSV)
export function exportToGoogleSheets(tcharts) {
  // Headers for Google Sheets
  const headers = [
    'Store',
    'Rep Name',
    'Date Created',
    'Time Created',
    'Customer Name',
    'Phone Number',
    'New/Existing',
    'Status',
    'Appointment Date/Time',
    'Current Carrier',
    'Current Voice Lines',
    'Current Tablet Lines',
    'Current Watch Lines',
    'Current Wireless Bill',
    'Current Home Internet',
    'Current Total',
    'Proposed Plan',
    'Proposed Voice Lines',
    'AutoPay',
    'Insider Code',
    'Work Perks',
    'Free Lines',
    'Proposed Home Internet',
    'Proposed Wireless Price',
    'Proposed Home Internet Price',
    'Proposed Total',
    'Savings',
    'Notes'
  ]

  // Convert tcharts to rows
  const rows = tcharts.map(tchart => {
    const date = new Date(tchart.timestamp)
    const dateStr = date.toLocaleDateString('en-US')
    const timeStr = date.toLocaleTimeString('en-US')

    const appointmentStr = tchart.appointmentDateTime
      ? new Date(tchart.appointmentDateTime).toLocaleString('en-US')
      : ''

    return [
      tchart.store,
      tchart.repName,
      dateStr,
      timeStr,
      tchart.customer.name,
      tchart.customer.phone,
      tchart.customer.isNew ? 'New' : 'Existing',
      tchart.status,
      appointmentStr,
      tchart.current.carrier || '',
      tchart.current.voiceLines,
      tchart.current.tabletLines,
      tchart.current.watchLines,
      tchart.current.wirelessBill,
      tchart.current.homeInternet,
      tchart.current.total.toFixed(2),
      tchart.proposed.plan,
      tchart.proposed.voiceLines,
      tchart.proposed.autopay ? 'Yes' : 'No',
      tchart.proposed.insider ? 'Yes' : 'No',
      tchart.proposed.workPerks ? 'Yes' : 'No',
      tchart.proposed.freeLines,
      tchart.proposed.homeInternet ? 'Yes' : 'No',
      tchart.proposed.wirelessPrice.toFixed(2),
      tchart.proposed.homeInternetPrice.toFixed(2),
      tchart.proposed.total.toFixed(2),
      tchart.savings.toFixed(2),
      tchart.notes ? `"${tchart.notes.replace(/"/g, '""')}"` : ''
    ]
  })

  return [headers, ...rows]
}

// Clear all T-Charts (for testing/reset)
export function clearAllTCharts() {
  localStorage.removeItem(STORAGE_KEY)
}

// Get T-Charts for a specific rep
export function getTChartsByRep(repName) {
  const all = getTCharts()
  return all.filter(tchart => tchart.repName === repName)
}

// Get T-Charts for a specific store
export function getTChartsByStore(store) {
  const all = getTCharts()
  return all.filter(tchart => tchart.store === store)
}
