import React, { useState } from "react";
import styled from "styled-components";

const Hero = styled.div`

    padding: 20px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    h2 {
        margin-bottom: 20px;
    }

    input, select {
        margin: 8px 0;
        padding: 8px;
        width: 200px;
        border: 1px solid #ccc;
        border-radius: 6px;
    }
    button {
        padding: 10px 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        margin-top: 10px;
        &:hover {
            background-color: #45a049;
        }
    }
    
`;

const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
    }
`;

const initialTasks = [
  
  
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
    <Hero>
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
      <Table border="1" cellPadding="10" width="100%">
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
      </Table>
    </Hero>
  );
}
