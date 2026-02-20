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

const TableWrap = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th,
  td {
    padding: 12px 14px;
    border-bottom: 1px solid #eef2f7;
    text-align: left;
    vertical-align: top;
    font-size: 14px;
  }

  th {
    background: #f3f4f6;
    font-weight: 700;
    color: #111827;
    border-bottom: 2px solid #e5e7eb;
    
  }

  td {
    color: #1f2937;
    
  }

  tr:last-child td {
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
  }

  /* Make long text not destroy layout */
  td:nth-child(1),
  td:nth-child(2) {
    word-break: break-word;
    white-space: normal;
  }

  select {
    width: 100%;
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background: #fff;
    outline: none;
  }

  select:focus {
    border-color: #94a3b8;
  }
`;

const PriorityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  background: ${({ priority }) =>
    priority === "High"
      ? "#ef4444"
      : priority === "Medium"
      ? "#f59e0b"
      : "#10b981"};
`;

const DebugBox = styled.div`
  margin-top: 16px;
  padding: 12px 14px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 12px;
  color: #334155;
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
