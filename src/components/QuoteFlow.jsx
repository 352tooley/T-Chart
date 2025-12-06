import { useState } from 'react'
import { logQuoteActivity } from '../utils/notifications'

function QuoteFlow({ store, employee, onExit }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [quoteData, setQuoteData] = useState({
    store: store,
    employee: employee,
    customerType: '', // 'new' or 'existing'
    customerName: '',
    customerPhone: ''
  })

  const handleCustomerType = (type) => {
    const typeLabel = type === 'new' ? 'New Customer' : 'Existing Customer'

    // Log this activity for management
    logQuoteActivity({
      store: store,
      employee: employee,
      customerType: typeLabel,
      timestamp: new Date().toISOString()
    })

    setQuoteData({ ...quoteData, customerType: type })
    setCurrentPage(2)
  }

  const handleBack = () => {
    if (currentPage === 1) {
      onExit()
    } else {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="quote-flow">
      {/* Page 1: Customer Type Selection */}
      {currentPage === 1 && (
        <div className="start-page">
          <div className="page-content">
            <h2>Customer Type</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
              Is this a new or existing customer?
            </p>

            <div className="action-buttons">
              <button
                className="large-button primary"
                onClick={() => handleCustomerType('new')}
              >
                New Customer
              </button>

              <button
                className="large-button secondary"
                onClick={() => handleCustomerType('existing')}
              >
                Existing Customer
              </button>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button onClick={handleBack} className="link-button">
                ← Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page 2: Coming soon... */}
      {currentPage === 2 && (
        <div className="start-page">
          <div className="page-content">
            <h2>Customer Info</h2>
            <p>Working on: {quoteData.customerType === 'new' ? 'New' : 'Existing'} Customer</p>
            <p>More pages coming soon...</p>
            <button className="link-button" onClick={handleBack}>
              ← Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuoteFlow
