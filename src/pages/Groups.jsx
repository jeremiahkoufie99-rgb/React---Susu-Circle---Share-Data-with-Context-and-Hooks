function Groups() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Susu Groups</h1>
          <p>Manage and monitor your savings groups.</p>
        </div>

        <button>+ Create Group</button>
      </div>

      <div className="groups-container">

        <div className="group-card">
          <h3>Monthly Savings</h3>
          <p>Contribution: GH₵ 200</p>
          <p>Members: 0</p>
          <span>Active</span>
        </div>

        <div className="group-card">
          <h3>Weekly Savings</h3>
          <p>Contribution: GH₵ 50</p>
          <p>Members: 0</p>
          <span>Active</span>
        </div>

      </div>
    </div>
  )
}

export default Groups
