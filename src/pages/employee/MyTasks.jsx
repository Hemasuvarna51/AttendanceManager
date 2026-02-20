import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuthStore } from "../../store/auth.store";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 22px 40px;
  background: #f8fafc;
  min-height: calc(100vh - 60px);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 10px;
    border: 1px solid #ddd;
    input {
      border-bottom: 1px solid #ddd;
      
  }

  th {
    background: #f3f4f6;
  }

  select {
    padding: 6px 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    width: 100%;
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

const safeParse = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export default function EmployeeTasks() {
  const loggedInEmployee = useAuthStore((s) => s.user?.name);

  const [tasks, setTasks] = useState([]);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const load = () => {
      console.log("🔍 MyTasks loading for:", loggedInEmployee);

      if (!loggedInEmployee) {
        setTasks([]);
        setDebugInfo({
          loggedInEmployee: null,
          totalTasks: 0,
          myTasksCount: 0,
        });
        return;
      }

      const stored = safeParse("tasks", []);
      const myTasks = stored.filter(
        (task) =>
          task.assignedTo &&
          task.assignedTo.toLowerCase() === loggedInEmployee.toLowerCase()
      );

      setTasks(myTasks);

      setDebugInfo({
        loggedInEmployee,
        totalTasks: stored.length,
        myTasksCount: myTasks.length,
      });
    };

    load();
    window.addEventListener("storage", load);
    window.addEventListener("tasks_updated", load);

    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("tasks_updated", load);
    };
  }, [loggedInEmployee]);

  const updateStatus = (id, newStatus) => {
    const stored = safeParse("tasks", []);

    const updated = stored.map((task) =>
      task.id === id ? { ...task, status: newStatus } : task
    );

    localStorage.setItem("tasks", JSON.stringify(updated));
    window.dispatchEvent(new Event("tasks_updated")); // ✅ refresh dashboard + this page

    const myUpdated = updated.filter(
      (task) =>
        task.assignedTo &&
        loggedInEmployee &&
        task.assignedTo.toLowerCase() === loggedInEmployee.toLowerCase()
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
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
          </tr>
        </thead>

        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "14px" }}>
                No tasks assigned to you.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id}>
            
                <td>{task.title}</td>
                <td>{task.description}</td>


                <td>
                  <PriorityBadge priority={task.priority}>
                    {task.priority}
                  </PriorityBadge>
                </td>

                <td>
                  <select
                    value={task.status || "Pending"}
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </td>

                <td>{task.dueDate || "--"}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Debug Info */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          fontSize: "12px",
        }}
      >
        <strong>Total</strong>
       
        <p>
          📊 Total tasks: {debugInfo.totalTasks} | Your tasks:{" "}
          {debugInfo.myTasksCount}
        </p>
      </div>
    </Container>
  );
}
