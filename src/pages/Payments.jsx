function Payments() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Payments</h1>
          <p>Monitor payments and member payouts.</p>
        </div>

        <button>+ Record Payment</button>
      </div>

      <div className="payments-summary">

        <div className="stat-card">
          <h3>Total Payments</h3>
          <h2>GH₵ 0.00</h2>
        </div>

        <div className="stat-card">
          <h3>Completed Payments</h3>
          <h2>0</h2>
        </div>

        <div className="stat-card">
          <h3>Pending Payments</h3>
          <h2>0</h2>
        </div>

      </div>

      <div className="payments-table">
        <h2>Payment History</h2>

        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="5">No payment records yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Payments


