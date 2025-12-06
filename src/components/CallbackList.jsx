import { useState, useEffect } from 'react'
import { getTCharts, exportToGoogleSheets } from '../utils/storage'
import './CallbackList.css'

function CallbackList() {
  const [tcharts, setTcharts] = useState([])
  const [filterStore, setFilterStore] = useState('')
  const [filterRep, setFilterRep] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTChart, setSelectedTChart] = useState(null)

  useEffect(() => {
    loadTCharts()
  }, [])

  const loadTCharts = () => {
    const data = getTCharts()
    setTcharts(data)
  }

  // Get unique stores and reps for filters
  const stores = [...new Set(tcharts.map(t => t.store))].sort()
  const reps = [...new Set(tcharts.map(t => t.repName))].sort()

  // Filter tcharts
  const filteredTCharts = tcharts.filter(tchart => {
    const matchesStore = !filterStore || tchart.store === filterStore
    const matchesRep = !filterRep || tchart.repName === filterRep
    const matchesStatus = !filterStatus || tchart.status === filterStatus
    const matchesSearch = !searchTerm ||
      tchart.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tchart.customer.phone.includes(searchTerm)

    return matchesStore && matchesRep && matchesStatus && matchesSearch
  })

  const formatDateTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleExport = () => {
    const sheetData = exportToGoogleSheets(filteredTCharts)
    // For now, we'll show instructions for manual Google Sheets import
    // In production, you'd integrate with Google Sheets API
    const csvContent = sheetData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tchart-callbacks-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const viewDetails = (tchart) => {
    setSelectedTChart(tchart)
  }

  const closeDetails = () => {
    setSelectedTChart(null)
  }

  return (
    <div className="callback-list">
      <div className="list-header">
        <h2>Callback List ({filteredTCharts.length})</h2>
        <button onClick={handleExport} className="btn-export">
          Export to CSV
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search customer name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select value={filterStore} onChange={(e) => setFilterStore(e.target.value)}>
          <option value="">All Stores</option>
          {stores.map(store => (
            <option key={store} value={store}>{store}</option>
          ))}
        </select>

        <select value={filterRep} onChange={(e) => setFilterRep(e.target.value)}>
          <option value="">All Reps</option>
          {reps.map(rep => (
            <option key={rep} value={rep}>{rep}</option>
          ))}
        </select>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="No contact">No contact</option>
          <option value="Appointment set">Appointment set</option>
          <option value="Closed">Closed</option>
        </select>

        {(filterStore || filterRep || filterStatus || searchTerm) && (
          <button
            onClick={() => {
              setFilterStore('')
              setFilterRep('')
              setFilterStatus('')
              setSearchTerm('')
            }}
            className="btn-clear-filters"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* List */}
      <div className="tcharts-list">
        {filteredTCharts.length === 0 ? (
          <div className="empty-state">
            <p>No T-Charts found</p>
            <p className="empty-hint">Create your first T-Chart to get started!</p>
          </div>
        ) : (
          filteredTCharts.map((tchart, index) => (
            <div key={index} className="tchart-card" onClick={() => viewDetails(tchart)}>
              <div className="tchart-card-header">
                <h3>{tchart.customer.name}</h3>
                <span className={`status-badge ${tchart.status.toLowerCase().replace(' ', '-')}`}>
                  {tchart.status}
                </span>
              </div>
              <div className="tchart-card-details">
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span>{tchart.customer.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Rep:</span>
                  <span>{tchart.repName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Store:</span>
                  <span>{tchart.store}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Created:</span>
                  <span>{formatDateTime(tchart.timestamp)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Type:</span>
                  <span>{tchart.customer.isNew ? 'New Customer' : 'Existing'}</span>
                </div>
                {tchart.appointmentDateTime && (
                  <div className="detail-row appointment">
                    <span className="label">Appointment:</span>
                    <span>{formatDateTime(tchart.appointmentDateTime)}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedTChart && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>T-Chart Details</h2>
              <button onClick={closeDetails} className="close-btn">&times;</button>
            </div>

            <div className="modal-body">
              <section className="detail-section">
                <h3>Customer Info</h3>
                <p><strong>Name:</strong> {selectedTChart.customer.name}</p>
                <p><strong>Phone:</strong> {selectedTChart.customer.phone}</p>
                <p><strong>Type:</strong> {selectedTChart.customer.isNew ? 'New Customer' : 'Existing'}</p>
              </section>

              <section className="detail-section">
                <h3>Rep & Store</h3>
                <p><strong>Rep:</strong> {selectedTChart.repName}</p>
                <p><strong>Store:</strong> {selectedTChart.store}</p>
                <p><strong>Created:</strong> {formatDateTime(selectedTChart.timestamp)}</p>
              </section>

              <section className="detail-section">
                <h3>Current Service</h3>
                <p><strong>Carrier:</strong> {selectedTChart.current.carrier || 'N/A'}</p>
                <p><strong>Voice Lines:</strong> {selectedTChart.current.voiceLines}</p>
                <p><strong>Tablet Lines:</strong> {selectedTChart.current.tabletLines}</p>
                <p><strong>Watch Lines:</strong> {selectedTChart.current.watchLines}</p>
                <p><strong>Wireless Bill:</strong> ${selectedTChart.current.wirelessBill}</p>
                <p><strong>Home Internet:</strong> ${selectedTChart.current.homeInternet}</p>
                <p className="total"><strong>Total:</strong> ${selectedTChart.current.total.toFixed(2)}/mo</p>
              </section>

              <section className="detail-section">
                <h3>Proposed T-Mobile Plan</h3>
                <p><strong>Plan:</strong> {selectedTChart.proposed.plan}</p>
                <p><strong>Voice Lines:</strong> {selectedTChart.proposed.voiceLines}</p>
                <p><strong>AutoPay:</strong> {selectedTChart.proposed.autopay ? 'Yes' : 'No'}</p>
                <p><strong>Insider Code:</strong> {selectedTChart.proposed.insider ? 'Yes' : 'No'}</p>
                <p><strong>Work Perks:</strong> {selectedTChart.proposed.workPerks ? 'Yes' : 'No'}</p>
                <p><strong>Free Lines:</strong> {selectedTChart.proposed.freeLines}</p>
                <p><strong>Home Internet:</strong> {selectedTChart.proposed.homeInternet ? 'Included' : 'No'}</p>
                <p><strong>Wireless:</strong> ${selectedTChart.proposed.wirelessPrice.toFixed(2)}/mo</p>
                {selectedTChart.proposed.homeInternet && (
                  <p><strong>Home Internet:</strong> ${selectedTChart.proposed.homeInternetPrice.toFixed(2)}/mo</p>
                )}
                <p className="total"><strong>Total:</strong> ${selectedTChart.proposed.total.toFixed(2)}/mo</p>
              </section>

              <section className="detail-section savings-section">
                <h3>Comparison</h3>
                <p className={selectedTChart.savings >= 0 ? 'savings' : 'additional-cost'}>
                  <strong>{selectedTChart.savings >= 0 ? 'Monthly Savings:' : 'Additional Cost:'}</strong> ${Math.abs(selectedTChart.savings).toFixed(2)}/mo
                </p>
              </section>

              <section className="detail-section">
                <h3>Status & Follow-up</h3>
                <p><strong>Status:</strong> <span className={`status-badge ${selectedTChart.status.toLowerCase().replace(' ', '-')}`}>{selectedTChart.status}</span></p>
                {selectedTChart.appointmentDateTime && (
                  <p><strong>Appointment:</strong> {formatDateTime(selectedTChart.appointmentDateTime)}</p>
                )}
                {selectedTChart.notes && (
                  <>
                    <p><strong>Notes:</strong></p>
                    <p className="notes-text">{selectedTChart.notes}</p>
                  </>
                )}
              </section>
            </div>

            <div className="modal-footer">
              <button onClick={closeDetails} className="btn-primary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CallbackList
