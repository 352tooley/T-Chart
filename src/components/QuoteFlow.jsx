import { useState } from 'react'
import { logQuoteActivity } from '../utils/notifications'

function QuoteFlow({ store, employee, onExit }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [quoteData, setQuoteData] = useState({
    store: store,
    employee: employee,
    customerType: '', // 'new' or 'existing'
    customerName: '',
    customerPhone: '',
    // Current service details
    currentCarrier: '',
    currentCarrierOther: '',
    reasonLeaving: '',
    voiceLines: '',
    watchLines: '',
    tabletLines: '',
    currentWirelessBill: '',
    currentInternetBill: ''
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

  const handleInputChange = (field, value) => {
    setQuoteData({ ...quoteData, [field]: value })
  }

  const handlePage2Next = () => {
    // Validate required fields
    if (!quoteData.currentCarrier || !quoteData.reasonLeaving) {
      alert('Please select current carrier and reason for leaving')
      return
    }
    if (quoteData.currentCarrier === 'Other' && !quoteData.currentCarrierOther) {
      alert('Please specify the carrier name')
      return
    }
    setCurrentPage(3)
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

      {/* Page 2: Current Service Details */}
      {currentPage === 2 && (
        <div className="start-page">
          <div className="page-content">
            <h2>Current Service Details</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
              Tell us about their current service
            </p>

            <div className="form-section">
              {/* Current Carrier */}
              <div className="form-group">
                <label>Current Carrier *</label>
                <select
                  className="form-select"
                  value={quoteData.currentCarrier}
                  onChange={(e) => handleInputChange('currentCarrier', e.target.value)}
                >
                  <option value="">Select carrier...</option>
                  <option value="AT&T">AT&T</option>
                  <option value="Verizon">Verizon</option>
                  <option value="Boost">Boost</option>
                  <option value="Spectrum">Spectrum</option>
                  <option value="MetroPCS">MetroPCS</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Other Carrier Field */}
              {quoteData.currentCarrier === 'Other' && (
                <div className="form-group">
                  <label>Carrier Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter carrier name..."
                    value={quoteData.currentCarrierOther}
                    onChange={(e) => handleInputChange('currentCarrierOther', e.target.value)}
                  />
                </div>
              )}

              {/* Reason for Leaving */}
              <div className="form-group">
                <label>Reason for Leaving Current Carrier *</label>
                <select
                  className="form-select"
                  value={quoteData.reasonLeaving}
                  onChange={(e) => handleInputChange('reasonLeaving', e.target.value)}
                >
                  <option value="">Select reason...</option>
                  <option value="Pricing">Pricing</option>
                  <option value="Phone Issue">Phone Issue</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Poor Signal">Poor Signal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Current Plan Details */}
              <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>
                Current Plan Details
              </h3>

              <div className="form-row triple">
                <div className="form-group">
                  <label>Voice Lines</label>
                  <select
                    className="form-select"
                    value={quoteData.voiceLines}
                    onChange={(e) => handleInputChange('voiceLines', e.target.value)}
                  >
                    <option value="">Select...</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Watch Lines</label>
                  <select
                    className="form-select"
                    value={quoteData.watchLines}
                    onChange={(e) => handleInputChange('watchLines', e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="0">0</option>
                    {[...Array(5)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tablet Lines</label>
                  <select
                    className="form-select"
                    value={quoteData.tabletLines}
                    onChange={(e) => handleInputChange('tabletLines', e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="0">0</option>
                    {[...Array(5)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Bills */}
              <div className="form-row">
                <div className="form-group">
                  <label>Current Wireless Bill</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="$0.00"
                    value={quoteData.currentWirelessBill}
                    onChange={(e) => handleInputChange('currentWirelessBill', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Home Internet Bill</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="$0.00"
                    value={quoteData.currentInternetBill}
                    onChange={(e) => handleInputChange('currentInternetBill', e.target.value)}
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="action-buttons" style={{ marginTop: '2rem' }}>
                <button
                  className="large-button primary"
                  onClick={handlePage2Next}
                >
                  Continue
                </button>
              </div>

              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button onClick={handleBack} className="link-button">
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuoteFlow
