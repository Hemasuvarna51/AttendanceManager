import { useEffect, useState } from "react";

export default function Reports() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const storedLeaves =
      JSON.parse(localStorage.getItem("leaveRequests")) || [];
    setLeaves(storedLeaves);
  }, []);

  const total = leaves.length;
  const approved = leaves.filter(l => l.status === "Approved").length;
  const rejected = leaves.filter(l => l.status === "Rejected").length;
  const pending = leaves.filter(l => l.status === "Pending").length;

  return (
    <div style={{ padding: 20 }}>
      <h2>Reports</h2>

      {/* ===== Summary Cards ===== */}
      <div style={styles.summary}>
        <Card title="Total Requests" value={total} />
        <Card title="Approved" value={approved} color="green" />
        <Card title="Rejected" value={rejected} color="red" />
        <Card title="Pending" value={pending} color="orange" />
      </div>

      {/* ===== Leave Report Table ===== */}
      <h3 style={{ marginTop: 30 }}>Leave Report</h3>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Emp ID</th>
            <th>From</th>
            <th>To</th>
            <th>Type</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="7" align="center">
                No records found
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.name}</td>
                <td>{leave.empId}</td>
                <td>{leave.from}</td>
                <td>{leave.to}</td>
                <td>{leave.type}</td>
                <td>{leave.reason}</td>
                <td>
                  <b
                    style={{
                      color:
                        leave.status === "Approved"
                          ? "green"
                          : leave.status === "Rejected"
                          ? "red"
                          : "orange",
                    }}
                  >
                    {leave.status}
                  </b>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ===== Small Card Component ===== */
function Card({ title, value, color = "#333" }) {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <h4>{title}</h4>
      <h2 style={{ color }}>{value}</h2>
    </div>
  );
}

/* ===== Styles ===== */
const styles = {
  summary: {
    display: "flex",
    gap: 20,
    marginTop: 20,
  },
  card: {
    flex: 1,
    padding: 20,
    background: "#fff",
    borderRadius: 6,
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
};
