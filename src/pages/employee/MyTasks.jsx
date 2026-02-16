import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuthStore } from "../../store/auth.store";

const Container = styled.div`
  padding: 30px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 10px;
    border: 1px solid #ddd;
  }

  th {
    background: #f3f4f6;
  }
`;

const PriorityBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: white;
  background: ${({ priority }) =>
    priority === "High"
      ? "#ef4444"
      : priority === "Medium"
      ? "#f59e0b"
      : "#10b981"};
`;

export default function EmployeeTasks() {

  // Get logged-in employee info from auth store
  const loggedInEmployee = useAuthStore((s) => s.user?.name);

  const [tasks, setTasks] = useState([]);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    console.log("🔍 MyTasks useEffect running with employee:", loggedInEmployee);
    
    if (!loggedInEmployee) {
      console.warn("⚠️ No logged-in employee found!");
      setTasks([]);
      return;
    }

    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    console.log("📦 All tasks in storage:", stored);

    // Filter tasks assigned to the current employee (case-insensitive comparison)
    const myTasks = stored.filter((task) => {
      const matches = task.assignedTo && task.assignedTo.toLowerCase() === loggedInEmployee.toLowerCase();
      console.log(`  Task "${task.title}" assigned to "${task.assignedTo}" - Matches: ${matches}`);
      return matches;
    });

    console.log("✅ Filtered tasks for employee:", myTasks);
    
    setDebugInfo({
      loggedInEmployee,
      totalTasks: stored.length,
      myTasksCount: myTasks.length
    });

    setTasks(myTasks);
  }, [loggedInEmployee]);

  const updateStatus = (id, newStatus) => {
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];

    const updated = stored.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    );

    localStorage.setItem("tasks", JSON.stringify(updated));

    // Use case-insensitive comparison for filtering
    const myUpdated = updated.filter(
      task => task.assignedTo && task.assignedTo.toLowerCase() === loggedInEmployee?.toLowerCase()
    );

    setTasks(myUpdated);
  };

  return (
    <Container>
      <h2>My Tasks</h2>

      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>

              <td>
                <PriorityBadge priority={task.priority}>
                  {task.priority}
                </PriorityBadge>
              </td>

              <td>
                <select
                  value={task.status}
                  onChange={(e) =>
                    updateStatus(task.id, e.target.value)
                  }
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </td>

              <td>{task.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Debug Info */}
      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px", fontSize: "12px" }}>
        <strong>Debug Info:</strong>
        <p>👤 Logged-in Employee: <code>{debugInfo.loggedInEmployee || "Not logged in"}</code></p>
        <p>📊 Total tasks: {debugInfo.totalTasks} | Your tasks: {debugInfo.myTasksCount}</p>
      </div>
    </Container>
  );
}
