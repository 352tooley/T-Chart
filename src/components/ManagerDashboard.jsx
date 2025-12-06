import { useState, useEffect } from 'react'
import {
  validateStorePassword,
  isManagerAuthenticated,
  setManagerAuthenticated,
  logoutManager,
  getAuthenticatedStore,
  setStorePassword
} from '../utils/auth'
import { getStoreActivityByPeriod, getEmployeeStoreActivity, getMultiStoreActivityByPeriod } from '../utils/notifications'
import { getEmployees } from '../utils/employees'
import './ManagerDashboard.css'

function ManagerDashboard({ onBack }) {
  const individualStores = [
    'Rufe Snow',
    'Golden Triangle',
    'Clifford',
    '28th St',
    'Chisholm Trail',
    'Weatherford',
    'Cleburne',
    'Stephenville',
    'Granbury'
  ]

  const stores = ['DFW West', ...individualStores]

  const [selectedStore, setSelectedStore] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPasswordError, setShowPasswordError] = useState(false)
  const [timePeriod, setTimePeriod] = useState('today') // 'today', 'week', 'month'
  const [activities, setActivities] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null) // null = show all, or specific employee name
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // For DFW West - multi-store comparison
  const [selectedStoresFilter, setSelectedStoresFilter] = useState(individualStores) // All stores selected by default

  useEffect(() => {
    const authStore = getAuthenticatedStore()
    if (authStore) {
      setSelectedStore(authStore)
      setIsAuthenticated(true)
      loadActivities(authStore, timePeriod)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && selectedStore) {
      loadActivities(selectedStore, timePeriod, selectedEmployee, selectedStoresFilter)
    }
  }, [timePeriod, selectedEmployee, isAuthenticated, selectedStore, selectedStoresFilter])

  const loadActivities = (store, period, employee = null, storesFilter = []) => {
    let storeActivities

    // If DFW West, get activities from multiple stores
    if (store === 'DFW West') {
      storeActivities = getMultiStoreActivityByPeriod(storesFilter, period)
    } else {
      // Individual store
      storeActivities = getStoreActivityByPeriod(store, period)
    }

    // Filter by specific employee if selected
    if (employee) {
      storeActivities = storeActivities.filter(a => a.employee === employee)
    }

    setActivities(storeActivities.reverse()) // Most recent first
  }

  const handleStoreFilterToggle = (storeName) => {
    setSelectedStoresFilter(prev => {
      if (prev.includes(storeName)) {
        // Remove store if already selected
        return prev.filter(s => s !== storeName)
      } else {
        // Add store if not selected
        return [...prev, storeName]
      }
    })
  }

  const handleSelectAllStores = () => {
    setSelectedStoresFilter(individualStores)
  }

  const handleDeselectAllStores = () => {
    setSelectedStoresFilter([])
  }

  const handleStoreSelect = (store) => {
    setSelectedStore(store)
    setPasswordInput('')
    setShowPasswordError(false)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (validateStorePassword(selectedStore, passwordInput)) {
      setManagerAuthenticated(selectedStore)
      setIsAuthenticated(true)
      setShowPasswordError(false)
      setPasswordInput('')
      loadActivities(selectedStore, timePeriod)
    } else {
      setShowPasswordError(true)
    }
  }

  const handleLogout = () => {
    logoutManager()
    setIsAuthenticated(false)
    setSelectedStore('')
    setPasswordInput('')
    setSelectedEmployee(null)
  }

  const handleChangePassword = () => {
    if (newPassword.length < 4) {
      alert('Password must be at least 4 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    setStorePassword(selectedStore, newPassword)
    setShowChangePassword(false)
    setNewPassword('')
    setConfirmPassword('')
    alert('Password changed successfully!')
  }

  // Calculate stats
  const storeEmployees = getEmployees(selectedStore)
  const isDFWWest = selectedStore === 'DFW West'

  const stats = {
    total: activities.length,
    newCustomers: activities.filter(a => a.customerType === 'New Customer').length,
    existingCustomers: activities.filter(a => a.customerType === 'Existing Customer').length,
    byEmployee: {},
    byStore: {} // For DFW West view
  }

  // Count by employee
  activities.forEach(activity => {
    if (!stats.byEmployee[activity.employee]) {
      stats.byEmployee[activity.employee] = {
        total: 0,
        new: 0,
        existing: 0,
        store: activity.store // Track which store the employee is from
      }
    }
    stats.byEmployee[activity.employee].total++
    if (activity.customerType === 'New Customer') {
      stats.byEmployee[activity.employee].new++
    } else {
      stats.byEmployee[activity.employee].existing++
    }
  })

  // Count by store (for DFW West)
  if (isDFWWest) {
    activities.forEach(activity => {
      if (!stats.byStore[activity.store]) {
        stats.byStore[activity.store] = {
          total: 0,
          new: 0,
          existing: 0
        }
      }
      stats.byStore[activity.store].total++
      if (activity.customerType === 'New Customer') {
        stats.byStore[activity.store].new++
      } else {
        stats.byStore[activity.store].existing++
      }
    })
  }

  const getPeriodLabel = () => {
    switch(timePeriod) {
      case 'today': return 'Today'
      case 'week': return 'This Week'
      case 'month': return 'This Month'
      default: return ''
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes === 1) return '1 minute ago'
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours === 1) return '1 hour ago'
    if (diffHours < 24) return `${diffHours} hours ago`

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Login screen - Store selection + password
  if (!isAuthenticated) {
    return (
      <div className="start-page">
        <div className="page-content">
          <h2>Manager Dashboard</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
            Select your store and enter password
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-field">
              <label>Select Store</label>
              <select
                value={selectedStore}
                onChange={(e) => handleStoreSelect(e.target.value)}
                className="large-select"
                required
              >
                <option value="">Choose your store...</option>
                {stores.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {selectedStore && (
              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value)
                    setShowPasswordError(false)
                  }}
                  className="large-input"
                  placeholder="Enter password"
                  autoFocus
                  required
                />
                {showPasswordError && (
                  <p style={{ color: '#ff6b6b', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    Incorrect password
                  </p>
                )}
              </div>
            )}

            <button type="submit" className="large-button primary" disabled={!selectedStore}>
              Login
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button onClick={onBack} className="link-button">
              ← Back
            </button>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px', fontSize: '0.85rem', color: '#666' }}>
            <strong>Default password for all stores:</strong> manager123
            <br />
            You can change this after logging in.
          </div>
        </div>
      </div>
    )
  }

  // Dashboard screen
  return (
    <div className="manager-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h2>{selectedStore}</h2>
            <p className="store-subtitle">Manager Dashboard</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Logout
            </button>
            <button onClick={onBack} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              ← Back
            </button>
          </div>
        </div>

        {/* Time Period Filter */}
        <div className="period-filter">
          <button
            onClick={() => setTimePeriod('today')}
            className={timePeriod === 'today' ? 'filter-btn active' : 'filter-btn'}
          >
            Today
          </button>
          <button
            onClick={() => setTimePeriod('week')}
            className={timePeriod === 'week' ? 'filter-btn active' : 'filter-btn'}
          >
            This Week
          </button>
          <button
            onClick={() => setTimePeriod('month')}
            className={timePeriod === 'month' ? 'filter-btn active' : 'filter-btn'}
          >
            This Month
          </button>
        </div>

        {/* DFW West - Store Filter */}
        {isDFWWest && (
          <div className="store-filter-section">
            <h3>Select Stores to Compare</h3>
            <div className="store-filter-actions">
              <button onClick={handleSelectAllStores} className="link-button">Select All</button>
              <button onClick={handleDeselectAllStores} className="link-button">Deselect All</button>
            </div>
            <div className="store-filter-grid">
              {individualStores.map(store => (
                <label key={store} className="store-filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedStoresFilter.includes(store)}
                    onChange={() => handleStoreFilterToggle(store)}
                  />
                  <span>{store}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Store Totals - Always visible */}
        <div className="store-totals-section">
          <h3>Store Totals - {getPeriodLabel()}</h3>
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Quotes</div>
            </div>

            <div className="stat-card success">
              <div className="stat-number">{stats.newCustomers}</div>
              <div className="stat-label">New Customers</div>
            </div>

            <div className="stat-card info">
              <div className="stat-number">{stats.existingCustomers}</div>
              <div className="stat-label">Existing Customers</div>
            </div>
          </div>
        </div>

        {/* Store Breakdown - DFW West Only */}
        {isDFWWest && Object.keys(stats.byStore).length > 0 && (
          <div className="breakdown-section">
            <h3>Store Comparison - {getPeriodLabel()}</h3>
            <div className="employee-breakdown-list">
              {Object.entries(stats.byStore)
                .sort((a, b) => b[1].total - a[1].total)
                .map(([storeName, storeStats]) => (
                  <div key={storeName} className="employee-card">
                    <div className="employee-card-header">
                      <span className="employee-name">{storeName}</span>
                      <span className="employee-total">{storeStats.total} quotes</span>
                    </div>
                    <div className="employee-card-stats">
                      <span className="stat-pill new">{storeStats.new} New</span>
                      <span className="stat-pill existing">{storeStats.existing} Existing</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Employee Breakdown */}
        {Object.keys(stats.byEmployee).length > 0 && (
          <div className="breakdown-section">
            <h3>Team Performance - {getPeriodLabel()}</h3>
            <div className="employee-breakdown-list">
              {Object.entries(stats.byEmployee)
                .sort((a, b) => b[1].total - a[1].total)
                .map(([employee, empStats]) => (
                  <div
                    key={employee}
                    className={`employee-card ${selectedEmployee === employee ? 'selected' : ''}`}
                    onClick={() => setSelectedEmployee(selectedEmployee === employee ? null : employee)}
                  >
                    <div className="employee-card-header">
                      <span className="employee-name">
                        {employee}
                        {isDFWWest && empStats.store && (
                          <span className="employee-store-tag"> @ {empStats.store}</span>
                        )}
                      </span>
                      <span className="employee-total">{empStats.total} quotes</span>
                    </div>
                    <div className="employee-card-stats">
                      <span className="stat-pill new">{empStats.new} New</span>
                      <span className="stat-pill existing">{empStats.existing} Existing</span>
                    </div>
                    {selectedEmployee === employee && (
                      <div className="employee-selected-indicator">
                        Click again to show all employees
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Show message if viewing specific employee */}
        {selectedEmployee && (
          <div className="viewing-employee-banner">
            <strong>Viewing: {selectedEmployee}</strong>
            <button onClick={() => setSelectedEmployee(null)} className="link-button">
              View All Employees
            </button>
          </div>
        )}

        {/* Recent Activity */}
        <div className="activity-section">
          <h3>
            Recent Activity - {getPeriodLabel()}
            {selectedEmployee && ` (${selectedEmployee})`}
          </h3>
          {activities.length === 0 ? (
            <p className="empty-message">
              No activity {selectedEmployee ? `for ${selectedEmployee} ` : ''}during this period
            </p>
          ) : (
            <div className="activity-list">
              {activities.slice(0, 50).map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-main">
                    <span className="activity-employee">{activity.employee}</span>
                    <span className={`activity-type ${activity.customerType === 'New Customer' ? 'new' : 'existing'}`}>
                      {activity.customerType}
                    </span>
                  </div>
                  <div className="activity-time">{formatTime(activity.timestamp)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="settings-section">
          {!showChangePassword ? (
            <button
              onClick={() => setShowChangePassword(true)}
              className="link-button"
            >
              Change Password for {selectedStore}
            </button>
          ) : (
            <div className="change-password-form">
              <h4>Change Manager Password for {selectedStore}</h4>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="large-input"
                style={{ marginBottom: '0.5rem' }}
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="large-input"
                style={{ marginBottom: '1rem' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleChangePassword} className="btn-primary">
                  Save Password
                </button>
                <button
                  onClick={() => {
                    setShowChangePassword(false)
                    setNewPassword('')
                    setConfirmPassword('')
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboard
