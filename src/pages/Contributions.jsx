import { useEffect, useMemo, useState } from 'react'
import { getContributions } from '../services/api'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

const money = (amount) => `GH₵ ${Number(amount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const dateLabel = (date) => date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

function Contributions() {
  const [contributions, setContributions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getContributions()
      .then((items) => { if (active) setContributions(items) })
      .catch(() => { if (active) setError('Unable to load contributions. Check that JSON Server is running on port 5000.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => contributions.filter((item) => `${item.member} ${item.group} ${item.status}`.toLowerCase().includes(search.toLowerCase())), [contributions, search])
  const total = contributions.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const completed = contributions.filter((item) => String(item.status).toLowerCase() === 'completed')
  const pending = contributions.filter((item) => String(item.status).toLowerCase() === 'pending')
  const today = new Date().toISOString().slice(0, 10)
  const todayTotal = contributions.filter((item) => item.date === today).reduce((sum, item) => sum + Number(item.amount || 0), 0)

  return (
    <div className="page">
      <PageHeader eyebrow="MONEY IN" title="Contributions" description="Every deposit adds momentum. Track activity across your savings circles." />
      <section className="stats-grid compact-stats">
        <article className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-green"><Icon name="contributions" size={20} /></span><span className="stat-card-note">All time</span></div><span className="stat-title">Total contributions</span><strong className="stat-value">{money(total)}</strong><span className="stat-detail">Across all your groups</span></article>
        <article className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-blue"><Icon name="calendar" size={20} /></span><span className="stat-card-note">Today</span></div><span className="stat-title">Today’s contributions</span><strong className="stat-value">{money(todayTotal)}</strong><span className="stat-detail">Collected today</span></article>
        <article className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-amber"><Icon name="clock" size={20} /></span><span className="stat-card-note">Needs attention</span></div><span className="stat-title">Pending contributions</span><strong className="stat-value">{pending.length}</strong><span className="stat-detail">{money(pending.reduce((sum, item) => sum + Number(item.amount || 0), 0))} outstanding</span></article>
        <article className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-purple"><Icon name="check" size={20} /></span><span className="stat-card-note">Successfully collected</span></div><span className="stat-title">Completed</span><strong className="stat-value">{completed.length}</strong><span className="stat-detail">Verified contributions</span></article>
      </section>
      <div className="section-title-row"><div><h2>Contribution history</h2><p>A complete record of deposits from your members.</p></div></div>
      <div className="toolbar">
        <label className="search-field"><Icon name="search" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search member, group or status..." aria-label="Search contributions" /></label>
        <span className="result-count">{filtered.length} transactions</span>
      </div>
      {loading ? <div className="loading-state"><span className="loader" /> Loading contributions…</div> : error ? <div className="error-state">{error}</div> : (
        <section className="panel data-panel"><div className="table-scroll"><table>
          <thead><tr><th>Member</th><th>Group</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>{filtered.length ? filtered.map((item, index) => (
            <tr key={item.id}>
              <td><div className="member-cell"><span className={`avatar avatar-${index % 4}`}>{String(item.member || 'M').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span><strong>{item.member}</strong></div></td>
              <td><span className="group-pill">{item.group || '—'}</span></td><td className="muted-cell">{dateLabel(item.date)}</td><td className="amount-cell">{money(item.amount)}</td><td><StatusBadge status={item.status} /></td>
            </tr>
          )) : <tr><td className="empty-cell" colSpan="5">No contributions match your search.</td></tr>}</tbody>
        </table></div><div className="table-footer"><span>Showing <strong>{filtered.length}</strong> of <strong>{contributions.length}</strong> contributions</span><span className="table-note">Amounts shown in Ghana cedis (GH₵)</span></div></section>
      )}
    </div>
  )
}

export default Contributions
