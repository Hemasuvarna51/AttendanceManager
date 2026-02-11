import { useState } from "react";

function Payroll() {
    const [records, setRecords] = useState([]);
    const [form, setForm] = useState({
        employee: "",
        basicSalary: "",
        bonus: "",
        deductions: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.employee || !form.basicSalary) {
            alert("Employee Name and Basic Salary are required");
            return;
        }

        const netSalary =
            Number(form.basicSalary) +
            Number(form.bonus || 0) -
            Number(form.deductions || 0);

        const newRecord = {
            ...form,
            netSalary,
            id: Date.now(),
        };

        setRecords([...records, newRecord]);

        setForm({
            employee: "",
            basicSalary: "",
            bonus: "",
            deductions: "",
        });
    };

    const deleteRecord = (id) => {
        setRecords(records.filter((rec) => rec.id !== id));
    };

    const totalPayroll = records.reduce(
        (sum, rec) => sum + rec.netSalary,
        0
    );
    const totalEmployees = records.length;

    const highestSalary =
        records.length > 0
            ? Math.max(...records.map((r) => r.netSalary))
            : 0;


    return (
        <div style={container}>
            <h2 style={heading}>💰 Payroll Management</h2>

            {/* Summary Section */}
            <div style={mainSummaryCard}>
                <h3>Total Payroll This Month</h3>
                <h1>₹ {totalPayroll.toLocaleString()}</h1>
            </div>
            <div style={summaryWrapper}>
                <div style={smallCard}>
                    <h4>Total Payroll</h4>
                    <h2>₹ {totalPayroll.toLocaleString()}</h2>
                </div>

                <div style={smallCard}>
                    <h4>Total Employees Paid</h4>
                    <h2>{totalEmployees}</h2>
                </div>

                <div style={smallCard}>
                    <h4>Highest Salary</h4>
                    <h2>₹ {highestSalary.toLocaleString()}</h2>
                </div>
            </div>



            {/* Form Section */}
            <div style={formCard}>
                <h3>Add Payroll Record</h3>
                <form onSubmit={handleSubmit} style={formGrid}>
                    <input
                        placeholder="Employee Name"
                        value={form.employee}
                        onChange={(e) => setForm({ ...form, employee: e.target.value })}
                        style={input}
                    />

                    <input
                        type="number"
                        placeholder="Basic Salary"
                        value={form.basicSalary}
                        onChange={(e) =>
                            setForm({ ...form, basicSalary: e.target.value })
                        }
                        style={input}
                    />

                    <input
                        type="number"
                        placeholder="Bonus"
                        value={form.bonus}
                        onChange={(e) => setForm({ ...form, bonus: e.target.value })}
                        style={input}
                    />

                    <input
                        type="number"
                        placeholder="Deductions"
                        value={form.deductions}
                        onChange={(e) =>
                            setForm({ ...form, deductions: e.target.value })
                        }
                        style={input}
                    />

                    <button type="submit" style={button}>
                        Add Record
                    </button>
                </form>
            </div>

            {/* Table Section */}
            <div style={tableCard}>
                <h3>Payroll Records</h3>

                {records.length === 0 ? (
                    <p style={{ color: "#777" }}>No payroll records available.</p>
                ) : (
                    <table style={table}>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Basic</th>
                                <th>Bonus</th>
                                <th>Deductions</th>
                                <th>Net Salary</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((rec) => (
                                <tr key={rec.id}>
                                    <td>{rec.employee}</td>
                                    <td>₹ {rec.basicSalary}</td>
                                    <td>₹ {rec.bonus || 0}</td>
                                    <td>₹ {rec.deductions || 0}</td>
                                    <td style={{ fontWeight: "bold", color: "#16a34a" }}>
                                        ₹ {rec.netSalary}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => deleteRecord(rec.id)}
                                            style={deleteBtn}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Payroll;

/* ------------------ STYLES ------------------ */

const container = {
    padding: "20px",
    background: "#f4f6fb",
    minHeight: "100vh",
    maxWidth: "1100px",
    margin: "0 auto",
};

const heading = {
    marginBottom: "15px",
};

const mainSummaryCard = {
    background: "#4f46e5",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    maxWidth: "300px",   // 👈 control width
};


const formCard = {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    maxWidth: "500px",
};

const formGrid = {
    display: "grid",
    gap: "8px",
    marginTop: "8px",
};

const input = {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "14px",
};

const button = {
    padding: "8px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
};

const tableCard = {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    maxWidth: "500px",
};

const table = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
};

const deleteBtn = {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "4px 8px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
};

const summaryWrapper = {
  display: "flex",
  gap: "20px",
  marginBottom: "30px",
  flexWrap: "wrap",   // makes it responsive
};

const smallCard = {
  background: "#4f46e5",
  color: "#fff",
  padding: "15px",
  borderRadius: "10px",
  width: "250px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  maxWidth: "10%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
