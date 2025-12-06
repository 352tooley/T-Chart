function QuoteFlow({ store, employee, onExit }) {
  return (
    <div className="page-content" style={{ margin: '2rem auto' }}>
      <h2>Quote Flow</h2>
      <p>Working on: {store} - {employee}</p>
      <p>More pages coming soon...</p>
      <button className="large-button secondary" onClick={onExit}>
        Back to Start
      </button>
    </div>
  )
}

export default QuoteFlow
