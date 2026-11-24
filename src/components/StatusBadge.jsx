function StatusBadge({ status }) {
  const tone = String(status || '').toLowerCase()

  return (
    <span className={`status-badge status-${tone}`}>
      <span className="status-dot" />
      {status || 'Unknown'}
    </span>
  )
}

export default StatusBadge
