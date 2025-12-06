import { useState } from 'react'
import './App.css'
import TChartForm from './components/TChartForm'
import CallbackList from './components/CallbackList'

function App() {
  const [currentView, setCurrentView] = useState('form') // 'form' or 'list'

  return (
    <div className="app">
      <header className="app-header">
        <h1>T-Mobile T-Chart</h1>
        <nav className="nav-buttons">
          <button
            className={currentView === 'form' ? 'active' : ''}
            onClick={() => setCurrentView('form')}
          >
            New T-Chart
          </button>
          <button
            className={currentView === 'list' ? 'active' : ''}
            onClick={() => setCurrentView('list')}
          >
            Callback List
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'form' ? <TChartForm /> : <CallbackList />}
      </main>
    </div>
  )
}

export default App
