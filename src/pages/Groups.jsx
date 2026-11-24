import { useEffect, useMemo, useState } from 'react'
import { getGroups } from '../services/api'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

const money = (amount) => `GH₵ ${Number(amount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function Groups() {
  const [groups, setGroups] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getGroups()
      .then((items) => { if (active) setGroups(items) })
      .catch(() => { if (active) setError('Unable to load groups. Check that JSON Server is running on port 5000.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filteredGroups = useMemo(() => groups.filter((group) => {
    const matchesSearch = `${group.name} ${group.status}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (statusFilter === 'All statuses' || String(group.status).toLowerCase() === statusFilter.toLowerCase())
  }), [groups, search, statusFilter])

  return (
    <div className="page">
      <PageHeader
        eyebrow="CIRCLE MANAGEMENT"
        title="Savings groups"
        description="A clear view of every circle, its members and contribution rhythm."
        action={null}
      />
      <div className="summary-strip">
        <div><span className="summary-icon summary-icon-green"><Icon name="groups" size={19} /></span><span><strong>{groups.length}</strong><small>Total groups</small></span></div>
        <div><span className="summary-icon summary-icon-purple"><Icon name="people" size={19} /></span><span><strong>{groups.reduce((sum, group) => sum + Number(group.members || 0), 0)}</strong><small>Group memberships</small></span></div>
        <div><span className="summary-icon summary-icon-amber"><Icon name="wallet" size={19} /></span><span><strong>{money(groups.reduce((sum, group) => sum + Number(group.contribution || 0), 0))}</strong><small>Contribution cycle value</small></span></div>
      </div>
      <div className="toolbar">
        <label className="search-field"><Icon name="search" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search groups..." aria-label="Search groups" /></label>
        <label className="filter-field"><Icon name="filter" size={17} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status"><option>All statuses</option><option>Active</option><option>Inactive</option></select></label>
        <span className="result-count">{filteredGroups.length} groups</span>
      </div>
      {loading ? <div className="loading-state"><span className="loader" /> Loading groups…</div> : error ? <div className="error-state">{error}</div> : (
        <div className="groups-grid">
          {filteredGroups.map((group, index) => (
            <article className="group-card" key={group.id}>
              <div className="group-card-top">
                <span className={`group-avatar group-avatar-${index % 4}`}><Icon name="groups" size={21} /></span>
                <StatusBadge status={group.status} />
              </div>
              <h2>{group.name}</h2>
              <p className="group-cycle">{index % 2 === 0 ? 'Monthly savings circle' : 'Weekly savings circle'}</p>
              <div className="group-metrics">
                <div><span>Contribution</span><strong>{money(group.contribution)}</strong></div>
                <div><span>Members</span><strong>{Number(group.members || 0)} <small>members</small></strong></div>
              </div>
              <div className="group-card-bottom">
                <span><span className="group-progress"><i style={{ width: `${Math.min(Number(group.members || 0) * 15, 100)}%` }} /></span> Circle health</span>
                <button className="more-button" type="button" aria-label={`More options for ${group.name}`}>···</button>
              </div>
            </article>
          ))}
          {!filteredGroups.length && <div className="empty-panel"><span className="empty-icon"><Icon name="groups" size={22} /></span><strong>No groups found</strong><p>Try a different search or status filter.</p></div>}
        </div>
      )}
    </div>
  )
}

export default Groups
