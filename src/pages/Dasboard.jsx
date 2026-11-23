import { useEffect, useState } from 'react'
import {
  getMembers,
  getGroups,
  getContributions,
  getPayments
} from '../services/api'

function Dashboard() {
  const [members, setMembers] = useState([])
  const [groups, setGroups] = useState([])
  const [contributions, setContributions] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [membersData, groupsData, contributionsData, paymentsData] =
          await Promise.all([
            getMembers(),
            getGroups(),
            getContributions(),
            getPayments()
          ])

        setMembers(membersData)
        setGroups(groupsData)
        setContributions(contributionsData)
        setPayments(paymentsData)
      } catch (err) {
        setError('Unable to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const totalContributions = contributions.reduce(
    (total, item) => total + Number(item.amount || 0), 0
  )

  const totalPayments = payments.reduce(
    (total, item) => total + Number(item.amount || 0), 0
  )

  if (loading) return <p>Loading dashboard...</p>

  if (error) return <p>{error}</p>

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back to Susu Circle!</p>
        </div>
      </div>

      <div className="stats-container">

        <div className="stat-card">
          <h3>Total Members</h3>
          <h2>{members.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Groups</h3>
          <h2>{groups.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Contributions</h3>
          <h2>GH₵ {totalContributions.toFixed(2)}</h2>
        </div>

        <div className="stat-card">
          <h3>Total Payments</h3>
          <h2>GH₵ {totalPayments.toFixed(2)}</h2>
        </div>

      </div>

      <div className="recent-activity">
        <h2>Recent Contributions</h2>

        {contributions.map(item => (
          <p key={item.id}>
            {item.member} — GH₵ {item.amount} — {item.date}
          </p>
        ))}
      </div>
    </div>
  )
}

export default Dashboard