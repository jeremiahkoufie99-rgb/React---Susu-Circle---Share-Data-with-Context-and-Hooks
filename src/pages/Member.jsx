import { useEffect, useMemo, useState } from 'react'
import { createMember, getGroups, getMembers } from '../services/api'
import Icon from '../components/Icon'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

function MemberDialog({ groups, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', group: groups[0]?.name || '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const member = await createMember({ ...form, status: 'Active' })
      onCreated(member)
      onClose()
    } catch {
      setError('Could not add this member. Please check that JSON Server is available and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="member-modal" role="dialog" aria-modal="true" aria-labelledby="add-member-title">
        <div className="modal-heading"><div><span className="page-eyebrow">MEMBER DIRECTORY</span><h2 id="add-member-title">Add a member</h2><p>Invite someone into your savings circle.</p></div><button className="modal-close" type="button" onClick={onClose} aria-label="Close dialog">×</button></div>
        <form onSubmit={submit}>
          <label>Full name<input name="name" value={form.name} onChange={update} placeholder="e.g. Ama Mensah" required /></label>
          <label>Email address<input name="email" type="email" value={form.email} onChange={update} placeholder="ama@example.com" required /></label>
          <label>Phone number<input name="phone" type="tel" value={form.phone} onChange={update} placeholder="+233 20 000 0000" required /></label>
          <label>Savings group<select name="group" value={form.group} onChange={update} required><option value="" disabled>Select a group</option>{groups.map((group) => <option key={group.id} value={group.name}>{group.name}</option>)}</select></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions"><button className="button button-secondary" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Adding member…' : 'Add member'}</button></div>
        </form>
      </section>
    </div>
  )
}

function Members() {
  const [members, setMembers] = useState([])
  const [groups, setGroups] = useState([])
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([getMembers(), getGroups()])
      .then(([memberData, groupData]) => {
        if (active) {
          setMembers(memberData)
          setGroups(groupData)
        }
      })
      .catch(() => { if (active) setError('Unable to load members. Check that JSON Server is running on port 5000.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filteredMembers = useMemo(() => members.filter((member) => (
    `${member.name} ${member.email} ${member.phone} ${member.group}`.toLowerCase().includes(search.toLowerCase())
  )), [members, search])

  return (
    <div className="page">
      <PageHeader
        eyebrow="YOUR COMMUNITY"
        title="Members"
        description="Get to know everyone who makes your savings circles stronger."
        action={<button className="button button-primary" type="button" onClick={() => setDialogOpen(true)}><Icon name="plus" size={17} /> Add member</button>}
      />
      <div className="members-overview">
        <div className="member-overview-copy"><span className="summary-icon summary-icon-green"><Icon name="people" size={19} /></span><span><strong>{members.length} members</strong><small>Growing together, one circle at a time</small></span></div>
        <span className="active-member-count"><i /> {members.filter((member) => String(member.status).toLowerCase() === 'active').length} active</span>
      </div>
      <div className="toolbar">
        <label className="search-field"><Icon name="search" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email or group..." aria-label="Search members" /></label>
        <span className="result-count">{filteredMembers.length} members</span>
      </div>
      {loading ? <div className="loading-state"><span className="loader" /> Loading members…</div> : error ? <div className="error-state">{error}</div> : (
        <section className="panel data-panel">
          <div className="table-scroll">
            <table>
              <thead><tr><th>Member</th><th>Phone</th><th>Savings group</th><th>Joined</th><th>Status</th><th aria-label="Actions" /></tr></thead>
              <tbody>
                {filteredMembers.length ? filteredMembers.map((member, index) => (
                  <tr key={member.id}>
                    <td><div className="member-cell"><span className={`avatar avatar-${index % 4}`}>{String(member.name || 'M').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span><div className="member-name-email"><strong>{member.name}</strong><span>{member.email}</span></div></div></td>
                    <td className="muted-cell">{member.phone || '—'}</td>
                    <td><span className="group-pill">{member.group || 'Unassigned'}</span></td>
                    <td className="muted-cell">—</td>
                    <td><StatusBadge status={member.status} /></td>
                    <td><button className="more-button" type="button" aria-label={`More options for ${member.name}`}>···</button></td>
                  </tr>
                )) : <tr><td className="empty-cell" colSpan="6">No members match your search.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="table-footer"><span>Showing <strong>{filteredMembers.length}</strong> of <strong>{members.length}</strong> members</span><div className="pagination"><button type="button" disabled aria-label="Previous page">‹</button><button type="button" className="current-page">1</button><button type="button" disabled aria-label="Next page">›</button></div></div>
        </section>
      )}
      {dialogOpen && <MemberDialog groups={groups} onClose={() => setDialogOpen(false)} onCreated={(member) => setMembers((current) => [...current, member])} />}
    </div>
  )
}

export default Members
