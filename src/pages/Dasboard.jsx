import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMembers, getGroups, getContributions, getPayments } from '../services/api'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

const money = (amount) => `GH₵ ${Number(amount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const dateLabel = (date) => {
  if (!date) return '—'
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Dashboard() {
  const [data, setData] = useState({ members: [], groups: [], contributions: [], payments: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([getMembers(), getGroups(), getContributions(), getPayments()])
      .then(([members, groups, contributions, payments]) => {
        if (active) setData({ members, groups, contributions, payments })
      })
      .catch(() => {
        if (active) setError('We couldn’t load your dashboard. Check that JSON Server is running on port 5000 and try again.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const totalContributions = data.contributions.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const totalPayments = data.payments.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const recentContributions = useMemo(
    () => [...data.contributions].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 5),
    [data.contributions],
  )
  const chartValues = useMemo(() => {
    const grouped = data.contributions.reduce((result, item) => {
      result[item.date] = (result[item.date] || 0) + Number(item.amount || 0)
      return result
    }, {})
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - index))
      const key = date.toISOString().slice(0, 10)
      return { label: date.toLocaleDateString('en', { weekday: 'short' }), amount: grouped[key] || 0 }
    })
    const max = Math.max(...days.map((day) => day.amount), 1)
    return days.map((day) => ({ ...day, height: day.amount ? Math.max(12, (day.amount / max) * 100) : 5 }))
  }, [data.contributions])

  if (loading) return <div className="loading-state"><span className="loader" /> Loading your dashboard…</div>
  if (error) return <div className="error-state"><strong>Dashboard unavailable</strong><p>{error}</p></div>

  const stats = [
    { title: 'Total members', value: data.members.length.toLocaleString(), detail: 'Across all your circles', icon: 'people', tone: 'green', change: '+12.8%' },
    { title: 'Active groups', value: data.groups.length.toLocaleString(), detail: 'Savings circles running', icon: 'groups', tone: 'blue', change: '+2 this month' },
    { title: 'Total contributions', value: money(totalContributions), detail: 'Collected to date', icon: 'contributions', tone: 'purple', change: '+8.2%' },
    { title: 'Total payments', value: money(totalPayments), detail: 'Successfully disbursed', icon: 'payments', tone: 'amber', change: 'On track' },
  ]

  return (
    <div className="page dashboard-page">
      <PageHeader
        eyebrow="MONDAY, NOVEMBER 23, 2026"
        title="Good morning, Sarah"
        description="Here’s what’s happening across your Susu Circle today."
        action={<button className="button button-primary" type="button"><Icon name="calendar" size={17} /> This month <span className="button-chevron">⌄</span></button>}
      />

      <section className="stats-grid" aria-label="Key metrics">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.title}>
            <div className="stat-card-top">
              <span className={`stat-icon stat-icon-${stat.tone}`}><Icon name={stat.icon} size={20} /></span>
              <span className="stat-change"><Icon name="arrowUp" size={13} />{stat.change}</span>
            </div>
            <span className="stat-title">{stat.title}</span>
            <strong className="stat-value">{stat.value}</strong>
            <span className="stat-detail">{stat.detail}</span>
          </article>
        ))}
      </section>

      <section className="dashboard-panels">
        <article className="panel contribution-chart-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">YOUR SAVINGS AT A GLANCE</span>
              <h2>Contribution activity</h2>
            </div>
            <button type="button" className="select-button">Last 7 days <span>⌄</span></button>
          </div>
          <div className="chart-summary"><strong>{money(totalContributions)}</strong><span><span className="trend-positive">↗ 8.2%</span> vs last month</span></div>
          <div className="bar-chart" aria-label="Contribution amounts over the last seven days">
            {chartValues.map((day) => (
              <div className="chart-column" key={day.label}>
                <div className="chart-bar-track"><span className="chart-bar" style={{ height: `${day.height}%` }} title={money(day.amount)} /></div>
                <span>{day.label}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="panel activity-panel">
          <div className="panel-heading">
            <div><span className="panel-kicker">LIVE UPDATES</span><h2>Recent activity</h2></div>
            <span className="live-indicator"><i /> Live</span>
          </div>
          <div className="activity-list">
            {[
              ...recentContributions.slice(0, 3).map((item) => ({ key: `c-${item.id}`, title: 'Contribution received', text: `${item.member} added ${money(item.amount)}`, date: dateLabel(item.date), icon: 'contributions', tone: 'green' })),
              ...data.payments.slice(0, 2).map((item) => ({ key: `p-${item.id}`, title: 'Payment processed', text: `${money(item.amount)} sent to ${item.member}`, date: dateLabel(item.date), icon: 'payments', tone: 'blue' })),
            ].slice(0, 4).map((item) => (
              <div className="activity-item" key={item.key}>
                <span className={`activity-icon activity-icon-${item.tone}`}><Icon name={item.icon} size={16} /></span>
                <div className="activity-copy"><strong>{item.title}</strong><span>{item.text}</span></div>
                <time>{item.date}</time>
              </div>
            ))}
            {!recentContributions.length && !data.payments.length && <p className="empty-inline">New contributions and payments will show up here.</p>}
          </div>
          <Link className="text-link" to="/contributions">View all activity <span>→</span></Link>
        </article>
      </section>

      <section className="panel table-panel">
        <div className="panel-heading table-panel-heading">
          <div><span className="panel-kicker">LATEST TRANSACTIONS</span><h2>Recent contributions</h2></div>
          <Link className="text-link" to="/contributions">View all <span>→</span></Link>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Member</th><th>Group</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {recentContributions.length ? recentContributions.map((item, index) => (
                <tr key={item.id}>
                  <td><div className="member-cell"><span className={`avatar avatar-${index % 4}`}>{String(item.member || 'M').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span><strong>{item.member}</strong></div></td>
                  <td className="muted-cell">{item.group}</td>
                  <td className="muted-cell">{dateLabel(item.date)}</td>
                  <td className="amount-cell">{money(item.amount)}</td>
                  <td><StatusBadge status={item.status} /></td>
                </tr>
              )) : <tr><td className="empty-cell" colSpan="5">No contributions to show yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
