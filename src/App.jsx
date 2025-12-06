import { useState } from 'react'
import './App.css'
import QuoteFlow from './components/QuoteFlow'
import CallbackList from './components/CallbackList'

function App() {
  const [currentView, setCurrentView] = useState('start') // 'start', 'quote', or 'list'
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

  const handleBackToStart = () => {
    setCurrentView('start')
    setSelectedStore('')
    setSelectedEmployee('')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>T-Mobile T-Chart</h1>
      </header>

      <main className="app-main">
        {currentView === 'start' && (
          <StartPage
            onStartQuote={handleStartQuote}
            onViewCallbacks={handleViewCallbacks}
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
      </main>
    </div>
  )
}

function StartPage({ onStartQuote, onViewCallbacks }) {
  const stores = Array.from({ length: 9 }, (_, i) => `Store ${i + 1}`)
  const [store, setStore] = useState('')
  const [employee, setEmployee] = useState('')

  const canProceed = store && employee

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
            onChange={(e) => setStore(e.target.value)}
            className="large-select"
          >
            <option value="">Choose store...</option>
            {stores.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Your Name</label>
          <input
            type="text"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            placeholder="Enter your name"
            className="large-input"
          />
        </div>

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
      </div>
    </div>
  )
}

export default App
