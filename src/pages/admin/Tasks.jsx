import React, { useState } from "react";

const initialTasks = [
  {
    id: 1,
    title: "Design Login Page",
    description: "Create UI for login",
    assignedTo: "Ram",
    priority: "High",
    status: "Pending",
    dueDate: "2026-02-05",
  },
  {
    id: 2,
    title: "API Integration",
    description: "Integrate task APIs",
    assignedTo: "Sita",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-02-10",
  },
];

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Low",
    dueDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    if (!form.title || !form.assignedTo) return alert("Fill required fields");

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        ...form,
        status: "Pending",
      },
    ]);

    setForm({
      title: "",
      description: "",
      assignedTo: "",
      priority: "Low",
      dueDate: "",
    });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin – Task Manager</h2>

      {/* Create Task */}
      <div style={{ marginBottom: 20 }}>
        <h3>Create Task</h3>
        <input
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
        />
        <br />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <br />
        <input
          name="assignedTo"
          placeholder="Assign to Employee"
          value={form.assignedTo}
          onChange={handleChange}
        />
        <br />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <br />
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />
        <br />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Title</th>
            <th>Assigned To</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.assignedTo}</td>
              <td>{task.priority}</td>
              <td>{task.status}</td>
              <td>{task.dueDate}</td>
              <td>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
