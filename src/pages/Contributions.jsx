function Contributions() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Contributions</h1>
          <p>Track and manage member contributions.</p>
        </div>

        <button>+ Add Contribution</button>
      </div>

      <div className="contributions-summary">

        <div className="stat-card">
          <h3>Total Contributions</h3>
          <h2>GH₵ 0.00</h2>
        </div>

        <div className="stat-card">
          <h3>Today's Contributions</h3>
          <h2>GH₵ 0.00</h2>
        </div>

        <div className="stat-card">
          <h3>Pending Contributions</h3>
          <h2>0</h2>
        </div>

      </div>

      <div className="contributions-table">
        <h2>Contribution History</h2>

        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Group</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="5">No contributions yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Contributions
