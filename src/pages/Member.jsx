import { useEffect, useState } from 'react'
import { getMembers } from '../services/api'

function Members() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMembers()
      .then(setMembers)
      .catch(() => setError('Unable to load members.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Members</h1>
          <p>View and manage your Susu Circle members.</p>
        </div>
      </div>

      {loading ? (
        <p>Loading members...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="members-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Group</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.length ? (
                members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{member.group}</td>
                    <td>{member.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Members
