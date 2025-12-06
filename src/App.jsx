import { useState } from 'react'
import './App.css'
import QuoteFlow from './components/QuoteFlow'
import CallbackList from './components/CallbackList'
import EmployeeManager from './components/EmployeeManager'
import ManagerDashboard from './components/ManagerDashboard'
import { getEmployees, addEmployee } from './utils/employees'

function App() {
  const [currentView, setCurrentView] = useState('start') // 'start', 'quote', 'list', 'manage', or 'dashboard'
  const [selectedStore, setSelectedStore] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')

  const handleStartQuote = (store, employee) => {
    setSelectedStore(store)
    setSelectedEmployee(employee)
    setCurrentView('quote')
  }

  const handleViewCallbacks = (store, employee) => {
    setSelectedStore(store)
    setSelectedEmployee(employee)
    setCurrentView('list')
  }

  const handleManageEmployees = () => {
    setCurrentView('manage')
  }

  const handleManagerDashboard = () => {
    setCurrentView('dashboard')
  }

  const handleBackToStart = () => {
    setCurrentView('start')
    setSelectedStore('')
    setSelectedEmployee('')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Quote Tool</h1>
      </header>

      <main className="app-main">
        {currentView === 'start' && (
          <StartPage
            onStartQuote={handleStartQuote}
            onViewCallbacks={handleViewCallbacks}
            onManageEmployees={handleManageEmployees}
            onManagerDashboard={handleManagerDashboard}
          />
        )}

        {currentView === 'quote' && (
          <QuoteFlow
            store={selectedStore}
            employee={selectedEmployee}
            onExit={handleBackToStart}
          />
        )}

        {currentView === 'list' && (
          <CallbackList
            onBack={handleBackToStart}
            defaultStore={selectedStore}
            defaultRep={selectedEmployee}
          />
        )}

        {currentView === 'manage' && (
          <EmployeeManager onBack={handleBackToStart} />
        )}

        {currentView === 'dashboard' && (
          <ManagerDashboard onBack={handleBackToStart} />
        )}
      </main>
    </div>
  )
}

function StartPage({ onStartQuote, onViewCallbacks, onManageEmployees, onManagerDashboard }) {
  const stores = [
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

  const [store, setStore] = useState('')
  const [employee, setEmployee] = useState('')
  const [employees, setEmployees] = useState([])
  const [showAddNew, setShowAddNew] = useState(false)
  const [newEmployeeName, setNewEmployeeName] = useState('')

  const canProceed = store && employee

  const handleStoreChange = (selectedStore) => {
    setStore(selectedStore)
    setEmployee('')
    setShowAddNew(false)
    setNewEmployeeName('')

    if (selectedStore) {
      const storeEmployees = getEmployees(selectedStore)
      setEmployees(storeEmployees)
    } else {
      setEmployees([])
    }
  }

  const handleEmployeeChange = (value) => {
    if (value === '__ADD_NEW__') {
      setShowAddNew(true)
      setEmployee('')
    } else {
      setShowAddNew(false)
      setEmployee(value)
    }
  }

  const handleAddNewEmployee = () => {
    if (newEmployeeName.trim() && store) {
      const success = addEmployee(store, newEmployeeName.trim())
      if (success) {
        setEmployee(newEmployeeName.trim())
        setEmployees(getEmployees(store))
        setShowAddNew(false)
        setNewEmployeeName('')
      } else {
        alert('This employee already exists!')
      }
    }
  }

  const handleCancelAddNew = () => {
    setShowAddNew(false)
    setNewEmployeeName('')
  }

  const handleNewQuote = () => {
    if (canProceed) {
      onStartQuote(store, employee)
    }
  }

  const handleCallbackList = () => {
    if (canProceed) {
      onViewCallbacks(store, employee)
    }
  }

  return (
    <div className="start-page">
      <div className="page-content">
        <h2>Welcome</h2>

        <div className="form-field">
          <label>Select Your Store</label>
          <select
            value={store}
            onChange={(e) => handleStoreChange(e.target.value)}
            className="large-select"
          >
            <option value="">Choose store...</option>
            {stores.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {store && !showAddNew && (
          <div className="form-field">
            <label>Select Your Name</label>
            <select
              value={employee}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              className="large-select"
            >
              <option value="">Choose your name...</option>
              {employees.map((emp) => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
              <option value="__ADD_NEW__">+ Add New Employee</option>
            </select>
          </div>
        )}

        {showAddNew && (
          <div className="form-field">
            <label>Enter New Employee Name</label>
            <input
              type="text"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              placeholder="Employee name"
              className="large-input"
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={handleAddNewEmployee}
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              >
                Add
              </button>
              <button
                onClick={handleCancelAddNew}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button
            className="large-button primary"
            onClick={handleNewQuote}
            disabled={!canProceed}
          >
            New Quote
          </button>

          <button
            className="large-button secondary"
            onClick={handleCallbackList}
            disabled={!canProceed}
          >
            Callback List
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={onManageEmployees}
            className="link-button"
          >
            Manage Employees
          </button>
          <button
            onClick={onManagerDashboard}
            className="link-button"
          >
            Manager Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
