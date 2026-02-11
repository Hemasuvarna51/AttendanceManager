import { useState } from "react";

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({
    title: "",
    employee: "",
    date: "",
    time: "",
    link: "",
    agenda: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.employee || !form.date || !form.time) {
      alert("Please fill all required fields");
      return;
    }

    setMeetings([...meetings, form]);

    setForm({
      title: "",
      employee: "",
      date: "",
      time: "",
      link: "",
      agenda: "",
    });
  };

  const deleteMeeting = (index) => {
    const updated = meetings.filter((_, i) => i !== index);
    setMeetings(updated);
  };

  return (
    <div style={container}>
      <h2 style={heading}>📅 Schedule Meeting</h2>

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          style={input}
          placeholder="Meeting Title *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          style={input}
          placeholder="Employee Name *"
          value={form.employee}
          onChange={(e) => setForm({ ...form, employee: e.target.value })}
        />

        <input
          style={input}
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          style={input}
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />

        <input
          style={input}
          placeholder="Meeting Link"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />

        <textarea
          style={textarea}
          placeholder="Agenda"
          value={form.agenda}
          onChange={(e) => setForm({ ...form, agenda: e.target.value })}
        />

        <button style={button} type="submit">
          Schedule Meeting
        </button>
      </form>

      <h3 style={{ marginTop: "40px" }}>Upcoming Meetings</h3>

      {meetings.length === 0 && (
        <p style={{ color: "#888" }}>No meetings scheduled yet.</p>
      )}

      {meetings.map((m, index) => (
        <div key={index} style={card}>
          <div>
            <h4>{m.title}</h4>
            <p><strong>Employee:</strong> {m.employee}</p>
            <p><strong>Date:</strong> {m.date}</p>
            <p><strong>Time:</strong> {m.time}</p>
            <p><strong>Agenda:</strong> {m.agenda}</p>
            {m.link && (
              <a href={m.link} target="_blank" rel="noreferrer">
                🔗 Join Meeting
              </a>
            )}
          </div>

          <button style={deleteBtn} onClick={() => deleteMeeting(index)}>
            ❌
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------- Styles ---------- */

const container = {
  padding: "30px",
  background: "#f6f7fb",
  minHeight: "100vh",
};

const heading = {
  marginBottom: "20px",
};

const formStyle = {
  display: "grid",
  gap: "12px",
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  maxWidth: "500px",
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
};

const textarea = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  minHeight: "80px",
};

const button = {
  padding: "10px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const card = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  marginTop: "15px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const deleteBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
};
