import { useState, useEffect } from 'react'
import { validateManagerPassword, isManagerAuthenticated, setManagerAuthenticated, logoutManager, getManagerPassword, setManagerPassword } from '../utils/auth'
import { getActivityLog, getTodayActivity } from '../utils/notifications'
import './ManagerDashboard.css'

function ManagerDashboard({ onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPasswordError, setShowPasswordError] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [activities, setActivities] = useState([])
  const [filter, setFilter] = useState('today') // 'today' or 'all'

  useEffect(() => {
    if (isManagerAuthenticated()) {
      setIsAuthenticated(true)
      loadActivities()
    }
  }, [])

  const loadActivities = () => {
    const allActivities = filter === 'today' ? getTodayActivity() : getActivityLog()
    setActivities(allActivities.reverse()) // Most recent first
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadActivities()
    }
  }, [filter, isAuthenticated])

  const handleLogin = (e) => {
    e.preventDefault()
    if (validateManagerPassword(passwordInput)) {
      setManagerAuthenticated()
      setIsAuthenticated(true)
      setShowPasswordError(false)
      setPasswordInput('')
      loadActivities()
    } else {
      setShowPasswordError(true)
    }
  }

  const handleLogout = () => {
    logoutManager()
    setIsAuthenticated(false)
    setPasswordInput('')
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
    setManagerPassword(newPassword)
    setShowChangePassword(false)
    setNewPassword('')
    setConfirmPassword('')
    alert('Password changed successfully!')
  }

  // Calculate stats
  const stats = {
    total: activities.length,
    newCustomers: activities.filter(a => a.customerType === 'New Customer').length,
    existingCustomers: activities.filter(a => a.customerType === 'Existing Customer').length,
    byStore: {},
    byEmployee: {},
    last30Min: activities.filter(a => {
      const activityTime = new Date(a.timestamp)
      const now = new Date()
      const diffMinutes = (now - activityTime) / (1000 * 60)
      return diffMinutes <= 30
    }).length
  }

  activities.forEach(activity => {
    // Count by store
    stats.byStore[activity.store] = (stats.byStore[activity.store] || 0) + 1
    // Count by employee
    stats.byEmployee[activity.employee] = (stats.byEmployee[activity.employee] || 0) + 1
  })

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

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="start-page">
        <div className="page-content">
          <h2>Manager Dashboard</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
            Enter manager password to continue
          </p>

          <form onSubmit={handleLogin}>
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
              />
              {showPasswordError && (
                <p style={{ color: '#ff6b6b', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  Incorrect password
                </p>
              )}
            </div>

            <button type="submit" className="large-button primary">
              Login
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button onClick={onBack} className="link-button">
              ← Back
            </button>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px', fontSize: '0.85rem', color: '#666' }}>
            <strong>Default password:</strong> manager123
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
          <h2>Manager Dashboard</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Logout
            </button>
            <button onClick={onBack} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              ← Back
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Quotes {filter === 'today' ? 'Today' : 'All Time'}</div>
          </div>

          <div className="stat-card success">
            <div className="stat-number">{stats.newCustomers}</div>
            <div className="stat-label">New Customers</div>
          </div>

          <div className="stat-card info">
            <div className="stat-number">{stats.existingCustomers}</div>
            <div className="stat-label">Existing Customers</div>
          </div>

          <div className="stat-card warning">
            <div className="stat-number">{stats.last30Min}</div>
            <div className="stat-label">Last 30 Minutes</div>
          </div>
        </div>

        {/* Filter */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button
            onClick={() => setFilter('today')}
            className={filter === 'today' ? 'filter-btn active' : 'filter-btn'}
          >
            Today
          </button>
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
          >
            All Time
          </button>
        </div>

        {/* By Store */}
        {Object.keys(stats.byStore).length > 0 && (
          <div className="breakdown-section">
            <h3>By Store</h3>
            <div className="breakdown-list">
              {Object.entries(stats.byStore)
                .sort((a, b) => b[1] - a[1])
                .map(([store, count]) => (
                  <div key={store} className="breakdown-item">
                    <span className="breakdown-label">{store}</span>
                    <span className="breakdown-count">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* By Employee */}
        {Object.keys(stats.byEmployee).length > 0 && (
          <div className="breakdown-section">
            <h3>By Employee</h3>
            <div className="breakdown-list">
              {Object.entries(stats.byEmployee)
                .sort((a, b) => b[1] - a[1])
                .map(([employee, count]) => (
                  <div key={employee} className="breakdown-item">
                    <span className="breakdown-label">{employee}</span>
                    <span className="breakdown-count">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="activity-section">
          <h3>Recent Activity</h3>
          {activities.length === 0 ? (
            <p className="empty-message">No activity yet</p>
          ) : (
            <div className="activity-list">
              {activities.slice(0, 20).map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-main">
                    <span className="activity-employee">{activity.employee}</span>
                    <span className="activity-store">@ {activity.store}</span>
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
              Change Password
            </button>
          ) : (
            <div className="change-password-form">
              <h4>Change Manager Password</h4>
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
