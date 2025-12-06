import { useState } from 'react'
import { TMOBILE_PLANS, HOME_INTERNET, calculatePrice, calculateHomeInternet } from '../data/plans'
import { saveTChart } from '../utils/storage'
import './TChartForm.css'

function TChartForm() {
  const stores = Array.from({ length: 9 }, (_, i) => `Store ${i + 1}`)

  // Form state
  const [repName, setRepName] = useState('')
  const [store, setStore] = useState('')

  // Customer info
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [isNewCustomer, setIsNewCustomer] = useState(true)

  // Current service details
  const [currentCarrier, setCurrentCarrier] = useState('')
  const [currentVoiceLines, setCurrentVoiceLines] = useState(0)
  const [currentTabletLines, setCurrentTabletLines] = useState(0)
  const [currentWatchLines, setCurrentWatchLines] = useState(0)
  const [currentWirelessBill, setCurrentWirelessBill] = useState(0)
  const [currentHomeInternet, setCurrentHomeInternet] = useState(0)

  // Proposed plan details
  const [selectedPlan, setSelectedPlan] = useState('')
  const [proposedVoiceLines, setProposedVoiceLines] = useState(1)
  const [hasAutopay, setHasAutopay] = useState(false)
  const [hasInsider, setHasInsider] = useState(false)
  const [hasWorkPerks, setHasWorkPerks] = useState(false)
  const [freeLines, setFreeLines] = useState(0)
  const [includeHomeInternet, setIncludeHomeInternet] = useState(false)

  // Status & notes
  const [status, setStatus] = useState('No contact')
  const [appointmentDateTime, setAppointmentDateTime] = useState('')
  const [notes, setNotes] = useState('')

  // Calculate proposed pricing
  const proposedWirelessPrice = selectedPlan
    ? calculatePrice(selectedPlan, proposedVoiceLines, {
        autopay: hasAutopay,
        insider: hasInsider,
        workPerks: hasWorkPerks,
        freeLines: freeLines
      })
    : 0

  const proposedHomeInternetPrice = includeHomeInternet
    ? calculateHomeInternet(hasAutopay, true)
    : 0

  const totalProposed = proposedWirelessPrice + proposedHomeInternetPrice
  const totalCurrent = parseFloat(currentWirelessBill || 0) + parseFloat(currentHomeInternet || 0)
  const savings = totalCurrent - totalProposed

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!repName || !store || !customerName || !customerPhone) {
      alert('Please fill in rep name, store, customer name, and phone number')
      return
    }

    const tchartData = {
      timestamp: new Date().toISOString(),
      repName,
      store,
      customer: {
        name: customerName,
        phone: customerPhone,
        isNew: isNewCustomer
      },
      current: {
        carrier: currentCarrier,
        voiceLines: currentVoiceLines,
        tabletLines: currentTabletLines,
        watchLines: currentWatchLines,
        wirelessBill: currentWirelessBill,
        homeInternet: currentHomeInternet,
        total: totalCurrent
      },
      proposed: {
        plan: selectedPlan,
        voiceLines: proposedVoiceLines,
        autopay: hasAutopay,
        insider: hasInsider,
        workPerks: hasWorkPerks,
        freeLines: freeLines,
        homeInternet: includeHomeInternet,
        wirelessPrice: proposedWirelessPrice,
        homeInternetPrice: proposedHomeInternetPrice,
        total: totalProposed
      },
      savings: savings,
      status: status,
      appointmentDateTime: appointmentDateTime,
      notes: notes
    }

    saveTChart(tchartData)
    alert('T-Chart saved successfully!')

    // Reset form
    resetForm()
  }

  const resetForm = () => {
    setCustomerName('')
    setCustomerPhone('')
    setIsNewCustomer(true)
    setCurrentCarrier('')
    setCurrentVoiceLines(0)
    setCurrentTabletLines(0)
    setCurrentWatchLines(0)
    setCurrentWirelessBill(0)
    setCurrentHomeInternet(0)
    setSelectedPlan('')
    setProposedVoiceLines(1)
    setHasAutopay(false)
    setHasInsider(false)
    setHasWorkPerks(false)
    setFreeLines(0)
    setIncludeHomeInternet(false)
    setStatus('No contact')
    setAppointmentDateTime('')
    setNotes('')
  }

  return (
    <form className="tchart-form" onSubmit={handleSubmit}>
      {/* Rep & Store Info */}
      <section className="form-section">
        <h2>Rep Information</h2>
        <div className="form-group">
          <label>Rep Name *</label>
          <input
            type="text"
            value={repName}
            onChange={(e) => setRepName(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <label>Store *</label>
          <select value={store} onChange={(e) => setStore(e.target.value)} required>
            <option value="">Select Store</option>
            {stores.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Customer Info */}
      <section className="form-section">
        <h2>Customer Information</h2>
        <div className="form-group">
          <label>Customer Name *</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            placeholder="Customer name"
          />
        </div>
        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
            placeholder="(555) 123-4567"
          />
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={isNewCustomer}
              onChange={(e) => setIsNewCustomer(e.target.checked)}
            />
            New Customer
          </label>
        </div>
      </section>

      {/* Current Service - LEFT SIDE OF T-CHART */}
      <section className="form-section current-section">
        <h2>Current Service</h2>
        <div className="form-group">
          <label>Current Carrier</label>
          <input
            type="text"
            value={currentCarrier}
            onChange={(e) => setCurrentCarrier(e.target.value)}
            placeholder="e.g., Verizon, AT&T"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Voice Lines</label>
            <input
              type="number"
              min="0"
              value={currentVoiceLines}
              onChange={(e) => setCurrentVoiceLines(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="form-group">
            <label>Tablet Lines</label>
            <input
              type="number"
              min="0"
              value={currentTabletLines}
              onChange={(e) => setCurrentTabletLines(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="form-group">
            <label>Watch Lines</label>
            <input
              type="number"
              min="0"
              value={currentWatchLines}
              onChange={(e) => setCurrentWatchLines(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Wireless Bill ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={currentWirelessBill}
              onChange={(e) => setCurrentWirelessBill(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
          <div className="form-group">
            <label>Home Internet ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={currentHomeInternet}
              onChange={(e) => setCurrentHomeInternet(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="total-display">
          <strong>Current Total: ${totalCurrent.toFixed(2)}/mo</strong>
        </div>
      </section>

      {/* Proposed Plan - RIGHT SIDE OF T-CHART */}
      <section className="form-section proposed-section">
        <h2>Proposed T-Mobile Plan</h2>
        <div className="form-group">
          <label>Select Plan</label>
          <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
            <option value="">Choose a plan...</option>
            {Object.keys(TMOBILE_PLANS).map((planName) => (
              <option key={planName} value={planName}>{planName}</option>
            ))}
          </select>
        </div>

        {selectedPlan && (
          <>
            <div className="plan-benefits">
              <h3>Plan Benefits:</h3>
              <ul>
                {TMOBILE_PLANS[selectedPlan].benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className="form-group">
              <label>Number of Voice Lines</label>
              <select
                value={proposedVoiceLines}
                onChange={(e) => setProposedVoiceLines(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>{num} line{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div className="discounts-section">
              <h3>Discounts & Promotions</h3>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={hasAutopay}
                    onChange={(e) => setHasAutopay(e.target.checked)}
                  />
                  AutoPay Discount
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={hasInsider}
                    onChange={(e) => setHasInsider(e.target.checked)}
                  />
                  Insider Code (20% off)
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={hasWorkPerks}
                    onChange={(e) => setHasWorkPerks(e.target.checked)}
                  />
                  Work Perks
                </label>
              </div>
              <div className="form-group">
                <label>Free Lines</label>
                <input
                  type="number"
                  min="0"
                  max={proposedVoiceLines - 1}
                  value={freeLines}
                  onChange={(e) => setFreeLines(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={includeHomeInternet}
                  onChange={(e) => setIncludeHomeInternet(e.target.checked)}
                />
                Include Home Internet
              </label>
            </div>

            {includeHomeInternet && (
              <div className="home-internet-info">
                <h4>Home Internet Benefits:</h4>
                <ul>
                  {HOME_INTERNET.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
                <p className="price-highlight">
                  ${proposedHomeInternetPrice}/mo
                  {hasAutopay && proposedVoiceLines > 0 && ' (bundled discount applied)'}
                </p>
              </div>
            )}

            <div className="pricing-breakdown">
              <div className="price-line">
                <span>Wireless Plan:</span>
                <span>${proposedWirelessPrice.toFixed(2)}/mo</span>
              </div>
              {includeHomeInternet && (
                <div className="price-line">
                  <span>Home Internet:</span>
                  <span>${proposedHomeInternetPrice.toFixed(2)}/mo</span>
                </div>
              )}
              <div className="price-line total">
                <strong>Proposed Total:</strong>
                <strong>${totalProposed.toFixed(2)}/mo</strong>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Comparison */}
      {selectedPlan && (
        <section className="form-section comparison-section">
          <h2>Side-by-Side Comparison</h2>
          <div className="comparison-grid">
            <div className="comparison-item">
              <span>Current Total:</span>
              <span className="current-price">${totalCurrent.toFixed(2)}/mo</span>
            </div>
            <div className="comparison-item">
              <span>Proposed Total:</span>
              <span className="proposed-price">${totalProposed.toFixed(2)}/mo</span>
            </div>
            <div className="comparison-item savings-row">
              <span>{savings >= 0 ? 'Monthly Savings:' : 'Additional Cost:'}</span>
              <span className={savings >= 0 ? 'savings' : 'additional-cost'}>
                ${Math.abs(savings).toFixed(2)}/mo
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Status & Notes */}
      <section className="form-section">
        <h2>Status & Follow-up</h2>
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="No contact">No contact</option>
            <option value="Appointment set">Appointment set</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {status === 'Appointment set' && (
          <div className="form-group">
            <label>Appointment Date & Time</label>
            <input
              type="datetime-local"
              value={appointmentDateTime}
              onChange={(e) => setAppointmentDateTime(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes about the customer or conversation..."
          />
        </div>
      </section>

      <div className="form-actions">
        <button type="submit" className="btn-primary">Save T-Chart</button>
        <button type="button" className="btn-secondary" onClick={resetForm}>Clear Form</button>
      </div>
    </form>
  )
}

export default TChartForm
