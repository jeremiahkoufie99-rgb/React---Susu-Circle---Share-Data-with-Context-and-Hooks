import { useEffect, useMemo, useState } from 'react'
import { getPayments } from '../services/api'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

const money = (amount) => `GH₵ ${Number(amount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const dateLabel = (date) => date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

function Payments() {
  const [payments, setPayments] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getPayments()
      .then((items) => { if (active) setPayments(items) })
      .catch(() => { if (active) setError('Unable to load payments. Check that JSON Server is running on port 5000.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => payments.filter((item) => `${item.member} ${item.transactionId} ${item.status}`.toLowerCase().includes(search.toLowerCase())), [payments, search])
  const total = payments.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const completed = payments.filter((item) => String(item.status).toLowerCase() === 'completed')
  const pending = payments.filter((item) => String(item.status).toLowerCase() === 'pending')

  return (
    <div className="page">
      <PageHeader eyebrow="MONEY OUT" title="Payments" description="Keep an eye on payouts and every transaction sent from your circles." />
      <section className="stats-grid compact-stats">
        <article className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-green"><Icon name="payments" size={20} /></span><span className="stat-card-note">All time</span></div><span className="stat-title">Total payments</span><strong className="stat-value">{money(total)}</strong><span className="stat-detail">Total disbursed</span></article>
        <article className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-blue"><Icon name="check" size={20} /></span><span className="stat-card-note">Successful</span></div><span className="stat-title">Completed payments</span><strong className="stat-value">{completed.length}</strong><span className="stat-detail">{money(completed.reduce((sum, item) => sum + Number(item.amount || 0), 0))} paid out</span></article>
        <article className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-amber"><Icon name="clock" size={20} /></span><span className="stat-card-note">In progress</span></div><span className="stat-title">Pending payments</span><strong className="stat-value">{pending.length}</strong><span className="stat-detail">{money(pending.reduce((sum, item) => sum + Number(item.amount || 0), 0))} awaiting</span></article>
        <article className="stat-card"><div className="stat-card-top"><span className="stat-icon stat-icon-purple"><Icon name="wallet" size={20} /></span><span className="stat-card-note">Payments</span></div><span className="stat-title">Transactions</span><strong className="stat-value">{payments.length}</strong><span className="stat-detail">Recorded in your circle</span></article>
      </section>
      <div className="section-title-row"><div><h2>Payment history</h2><p>Review and reconcile member payouts.</p></div></div>
      <div className="toolbar">
        <label className="search-field"><Icon name="search" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search member, transaction or status..." aria-label="Search payments" /></label>
        <span className="result-count">{filtered.length} transactions</span>
      </div>
      {loading ? <div className="loading-state"><span className="loader" /> Loading payments…</div> : error ? <div className="error-state">{error}</div> : (
        <section className="panel data-panel"><div className="table-scroll"><table>
          <thead><tr><th>Transaction ID</th><th>Member</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>{filtered.length ? filtered.map((item, index) => (
            <tr key={item.id}>
              <td><span className="transaction-id">{item.transactionId || `SUSU${String(item.id).padStart(3, '0')}`}</span></td>
              <td><div className="member-cell"><span className={`avatar avatar-${index % 4}`}>{String(item.member || 'M').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span><strong>{item.member}</strong></div></td>
              <td className="muted-cell">{dateLabel(item.date)}</td><td className="amount-cell">{money(item.amount)}</td><td><StatusBadge status={item.status} /></td>
            </tr>
          )) : <tr><td className="empty-cell" colSpan="5">No payments match your search.</td></tr>}</tbody>
        </table></div><div className="table-footer"><span>Showing <strong>{filtered.length}</strong> of <strong>{payments.length}</strong> payments</span><span className="table-note">Amounts shown in Ghana cedis (GH₵)</span></div></section>
      )}
    </div>
  )
}

export default Payments
