import React, { useState } from "react";

const myTasksData = [
  {
    id: 1,
    title: "Design Login Page",
    description: "Create UI for login",
    status: "Pending",
    dueDate: "2026-02-05",
  },
  {
    id: 2,
    title: "API Integration",
    description: "Integrate APIs",
    status: "In Progress",
    dueDate: "2026-02-10",
  },
];

export default function MyTasks() {
  const [tasks, setTasks] = useState(myTasksData);

  const updateStatus = (id, status) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>My Tasks</h2>

      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 10,
          }}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>
            <strong>Due:</strong> {task.dueDate}
          </p>

          <select
            value={task.status}
            onChange={(e) => updateStatus(task.id, e.target.value)}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      ))}
    </div>
  );
}
