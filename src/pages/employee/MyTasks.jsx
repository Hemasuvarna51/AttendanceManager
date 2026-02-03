import React, { useState } from "react";
import styled from "styled-components";
const Taskcard = styled.div`
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Task = styled.div`
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 10px 0;
  }

  select {
    margin-top: 10px;
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }


`;
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
    <Taskcard>
      <h2>My Tasks</h2>

      {tasks.map((task) => (
        <Task
          key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>
            <strong>Due:</strong> {task.dueDate}
          </p>

          <select
            value={task.status}
            onChange={(e) => updateStatus(task.id, e.target.value)}
          >
            <option >Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </Task>
      ))}
    </Taskcard>
  );
}
