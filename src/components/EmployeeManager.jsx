import { useState } from 'react'
import { getEmployees, addEmployee, removeEmployee, getAllEmployees } from '../utils/employees'
import './EmployeeManager.css'

function EmployeeManager({ onBack }) {
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

  const [selectedStore, setSelectedStore] = useState('')
  const [employees, setEmployees] = useState([])
  const [newEmployeeName, setNewEmployeeName] = useState('')

  const handleStoreChange = (store) => {
    setSelectedStore(store)
    if (store) {
      setEmployees(getEmployees(store))
    } else {
      setEmployees([])
    }
  }

  const handleAddEmployee = () => {
    if (newEmployeeName.trim() && selectedStore) {
      const success = addEmployee(selectedStore, newEmployeeName.trim())
      if (success) {
        setEmployees(getEmployees(selectedStore))
        setNewEmployeeName('')
      } else {
        alert('This employee already exists!')
      }
    }
  }

  const handleRemoveEmployee = (employeeName) => {
    if (window.confirm(`Remove ${employeeName} from ${selectedStore}?`)) {
      removeEmployee(selectedStore, employeeName)
      setEmployees(getEmployees(selectedStore))
    }
  }

  return (
    <div className="employee-manager">
      <div className="page-content">
        <h2>Manage Employees</h2>

        <div className="form-field">
          <label>Select Store</label>
          <select
            value={selectedStore}
            onChange={(e) => handleStoreChange(e.target.value)}
            className="large-select"
          >
            <option value="">Choose store...</option>
            {stores.map((store) => (
              <option key={store} value={store}>{store}</option>
            ))}
          </select>
        </div>

        {selectedStore && (
          <>
            <div className="add-employee-section">
              <h3>Add New Employee</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  placeholder="Employee name"
                  className="large-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddEmployee()}
                />
                <button
                  onClick={handleAddEmployee}
                  className="btn-primary"
                  style={{ minWidth: '100px' }}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="employee-list-section">
              <h3>Current Employees ({employees.length})</h3>
              {employees.length === 0 ? (
                <p className="empty-message">No employees added yet. Add your first employee above.</p>
              ) : (
                <ul className="employee-list">
                  {employees.map((emp) => (
                    <li key={emp} className="employee-item">
                      <span className="employee-name">{emp}</span>
                      <button
                        onClick={() => handleRemoveEmployee(emp)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        <div style={{ marginTop: '2rem' }}>
          <button onClick={onBack} className="large-button secondary">
            ← Back to Start
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmployeeManager
