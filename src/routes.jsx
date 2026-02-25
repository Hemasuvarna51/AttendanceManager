// src/routes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Login from "./pages/auth/Login";
import Unauthorized from "./pages/auth/Unauthorized";

import AdminShell from "./layout/AdminShell";
import EmployeeShell from "./layout/EmployeeShell";

import { useAuthStore } from "./store/auth.store";

// ✅ import your pages
import Dashboard from "./pages/admin/Dashboard";
import Tasks from "./pages/admin/Tasks";
import Employee from "./pages/admin/Employee";
import LeaveApproval from "./pages/admin/LeaveApproval";
import Payroll from "./pages/admin/Payroll";
import RunPayroll from "./pages/admin/payroll/RunPayroll";
import Meetings from "./pages/admin/Meetings";
import Projects from "./pages/admin/Projects";
import Reports from "./pages/admin/Reports";

import DashBoard from "./pages/employee/DashBoard";
import CheckIn from "./pages/employee/CheckIn";
import CheckOut from "./pages/employee/CheckOut";
import LeaveRequest from "./pages/employee/LeaveRequest";
import MyAttendance from "./pages/employee/MyAttendance";
import MyTasks from "./pages/employee/MyTasks";
import MyProfile from "./pages/employee/MyProfile";
import MyMeetings from "./pages/employee/MyMeetings";

function HomeRedirect() {
  const role = useAuthStore((s) => s.role);
  return role === "admin" ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/employee/dashboard" replace />
  );
}

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/unauthorized", element: <Unauthorized /> },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomeRedirect />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <RoleRoute allow={["admin"]}>
          <AdminShell />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "tasks", element: <Tasks /> },
      { path: "employees", element: <Employee /> },
      { path: "leave-approval", element: <LeaveApproval /> },
      { path: "payroll", element: <Payroll /> },
      { path: "payroll/run", element: <RunPayroll /> },
      { path: "meetings", element: <Meetings /> },
      { path: "projects", element: <Projects /> },
      { path: "reports", element: <Reports /> },
      { path: "*", element: <Navigate to="/admin/dashboard" replace /> },
    ],
  },

  {
    path: "/employee",
    element: (
      <ProtectedRoute>
        <RoleRoute allow={["employee"]}>
          <EmployeeShell />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <DashBoard /> },
      { path: "checkin", element: <CheckIn /> },
      { path: "checkout", element: <CheckOut /> },
      { path: "leave", element: <LeaveRequest /> },
      { path: "my-attendance", element: <MyAttendance /> },
      { path: "tasks", element: <MyTasks /> },
      { path: "my-profile", element: <MyProfile /> },
      { path: "my-meetings", element: <MyMeetings /> },
      { path: "*", element: <Navigate to="/employee/dashboard" replace /> },
    ],
  },
]);