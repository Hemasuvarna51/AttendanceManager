import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useAuthStore } from "../../store/auth.store";

/* ===================== LAYOUT ===================== */

const Page = styled.div`
  padding: 26px 26px 40px;
  background: #f4f6fb;
  min-height: calc(100vh - 60px);
`;

const Shell = styled.div`
  max-width: 1180px;
  margin: 0 auto;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
`;

const Heading = styled.div`
  h1 {
    margin: 0;
    font-size: 26px;
    letter-spacing: -0.4px;
    color: #0f172a;
  }

  p {
    margin: 6px 0 0;
    font-size: 14px;
    color: #64748b;
  }
`;

const PrimaryBtn = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(37, 99, 235, 0.2);

  &:hover {
    transform: translateY(-1px);
  }
`;

/* ===================== STATS ===================== */

const StatsRow = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 12px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: #fff;
  border: 1px solid #e6e8ee;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 10px 22px rgba(2, 6, 23, 0.05);

  .k {
    font-size: 12px;
    font-weight: 800;
    color: #64748b;
  }

  .v {
    margin-top: 6px;
    font-size: 20px;
    font-weight: 900;
    color: ${({ color }) => color || "#0f172a"};
  }
`;

/* ===================== PANEL ===================== */

const Panel = styled.div`
  margin-top: 16px;
  background: #fff;
  border-radius: 18px;
  border: 1px solid #e6e8ee;
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.06);
  overflow: hidden;
`;

const PanelHead = styled.div`
  padding: 14px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  background: #f1f5f9;
  padding: 6px;
  border-radius: 999px;
`;

const Tab = styled.button`
  border: none;
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  font-weight: 800;
  cursor: pointer;
  background: ${({ active }) => (active ? "#2563eb" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#0f172a")};
`;

const Dots = styled.div`
  color: #94a3b8;
  font-weight: 900;
  letter-spacing: 2px;
`;

/* ===================== EMPTY STATE ===================== */

const EmptyState = styled.div`
  padding: 50px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 60px;
  margin-bottom: 10px;
`;

const EmptyTitle = styled.h3`
  margin: 0;
  font-size: 20px;
`;

const EmptyText = styled.p`
  margin-top: 6px;
  font-size: 14px;
  color: #64748b;
`;

/* ===================== HELPERS ===================== */

const safeParse = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

/* ===================== COMPONENT ===================== */

export default function EmployeeTasks() {
  const loggedInEmployee = useAuthStore((s) => s.user?.name);
  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    const load = () => {
      if (!loggedInEmployee) return setTasks([]);

      const stored = safeParse("tasks", []);
      const myTasks = stored.filter(
        (task) =>
          task.assignedTo &&
          task.assignedTo.toLowerCase() === loggedInEmployee.toLowerCase()
      );

      setTasks(myTasks);
    };

    load();
    window.addEventListener("storage", load);
    window.addEventListener("tasks_updated", load);

    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("tasks_updated", load);
    };
  }, [loggedInEmployee]);

  /* ===== Stats ===== */
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      completed: tasks.filter((t) => t.status === "Completed").length,
      overdue: tasks.filter(
        (t) =>
          t.dueDate &&
          new Date(t.dueDate) < new Date() &&
          t.status !== "Completed"
      ).length,
    };
  }, [tasks]);

  const filteredTasks =
    tab === "All" ? tasks : tasks.filter((t) => t.status === tab);

  return (
    <Page>
      <Shell>
        <TopBar>
          <Heading>
            <h1>Task Management</h1>
            <p>Organize, prioritize, and manage your tasks efficiently.</p>
          </Heading>

          <PrimaryBtn>+ New Task</PrimaryBtn>
        </TopBar>

        <StatsRow>
          <StatCard>
            <div className="k">Total Tasks</div>
            <div className="v">{stats.total}</div>
          </StatCard>

          <StatCard color="#16a34a">
            <div className="k">In Progress</div>
            <div className="v">{stats.inProgress}</div>
          </StatCard>

          <StatCard color="#2563eb">
            <div className="k">Completed</div>
            <div className="v">{stats.completed}</div>
          </StatCard>

          <StatCard color="#ef4444">
            <div className="k">Overdue</div>
            <div className="v">{stats.overdue}</div>
          </StatCard>
        </StatsRow>

        <Panel>
          <PanelHead>
            <Tabs>
              <Tab active={tab === "All"} onClick={() => setTab("All")}>
                All
              </Tab>
              <Tab
                active={tab === "Pending"}
                onClick={() => setTab("Pending")}
              >
                Pending
              </Tab>
              <Tab
                active={tab === "In Progress"}
                onClick={() => setTab("In Progress")}
              >
                In Progress
              </Tab>
              <Tab
                active={tab === "Completed"}
                onClick={() => setTab("Completed")}
              >
                Completed
              </Tab>
            </Tabs>

            <Dots>•••</Dots>
          </PanelHead>

          {filteredTasks.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📋</EmptyIcon>
              <EmptyTitle>No Tasks Assigned</EmptyTitle>
              <EmptyText>
                You currently have no tasks assigned to you.
              </EmptyText>
            </EmptyState>
          ) : (
            <EmptyState>
              {/* You can replace this with full table if needed */}
              <EmptyTitle>{filteredTasks.length} Tasks Found</EmptyTitle>
            </EmptyState>
          )}
        </Panel>
      </Shell>
    </Page>
  );
}