import { useState } from "react";

export default function Attendance() {
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      name: "Ramya",
      from: "2026-02-10",
      to: "2026-02-12",
      type: "Sick",
      reason: "Fever",
      status: "Pending",
    },
    {
      id: 2,
      name: "Suresh",
      from: "2026-02-05",
      to: "2026-02-06",
      type: "Casual",
      reason: "Personal work",
      status: "Pending",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setLeaves((prevLeaves) =>
      prevLeaves.map((leave) =>
        leave.id === id ? { ...leave, status: newStatus } : leave
      )
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employee Leave Requests</h2>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Employee</th>
            <th>From</th>
            <th>To</th>
            <th>Type</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td>{leave.name}</td>
              <td>{leave.from}</td>
              <td>{leave.to}</td>
              <td>{leave.type}</td>
              <td>{leave.reason}</td>
              <td>
                <strong
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
                </strong>
              </td>
              <td>
                {leave.status === "Pending" ? (
                  <>
                    <button
                      style={{ marginRight: "8px" }}
                      onClick={() => updateStatus(leave.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(leave.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
