import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Login from "./pages/auth/Login";
import Unauthorized from "./pages/auth/Unauthorized";

import AppShell from "./App";
import { useAuthStore } from "./store/auth.store";

// admin pages
import Dashboard from "./pages/admin/Dashboard";
import Employee from "./pages/admin/Employee";
import Attendance from "./pages/admin/Attendance";
import Tasks from "./pages/admin/Tasks";
import Reports from "./pages/admin/Reports"; // create placeholder if not yet

// employee pages
import DashBoard from "./pages/employee/DashBoard";
import CheckIn from "./pages/employee/CheckIn";
import CheckOut from "./pages/employee/CheckOut"; // create if not yet
import MyAttendance from "./pages/employee/MyAttendance"; // create if not yet
import LeaveRequest from "./pages/employee/LeaveRequest"; // placeholder ok
import MyTasks from "./pages/employee/MyTasks";


function HomeRedirect() {
  const role = useAuthStore((s) => s.role);
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/employee/dashboard" replace />;
}

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/unauthorized", element: <Unauthorized /> },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      // ✅ default landing after login
      { index: true, element: <HomeRedirect /> },

      {
        path: "employee/dashboard",
        element: (
          <RoleRoute allow={["employee"]}>
            <DashBoard />
          </RoleRoute>
        ),
      },

      // ✅ employee routes
      {
        path: "employee/checkin",
        element: (
          <RoleRoute allow={["employee"]}>
            <CheckIn />
          </RoleRoute>
        ),
      },
      {
        path: "employee/checkout",
        element: (
          <RoleRoute allow={["employee"]}>
            <CheckOut />
          </RoleRoute>
        ),
      },
      {
        path: "employee/leave",
        element: (
          <RoleRoute allow={["employee"]}>
            <LeaveRequest />
          </RoleRoute>
        ),
      },
      {
        path: "employee/my-attendance",
        element: (
          <RoleRoute allow={["employee"]}>
            <MyAttendance />
          </RoleRoute>
        ),
      },
      {
        path: "employee/tasks",
        element: (
          <RoleRoute allow={["employee"]}>
            <MyTasks />
          </RoleRoute>
        ),
      },

      // ✅ admin routes
      {
        path: "admin/dashboard",
        element: (
          <RoleRoute allow={["admin"]}>
            <Dashboard />
          </RoleRoute>
        ),
      },
      {
        path: "admin/tasks",
        element: (
          <RoleRoute allow={["admin"]}>
            <Tasks />
          </RoleRoute>
        ),
      },

      {
        path: "admin/employees",
        element: (
          <RoleRoute allow={["admin"]}>
            <Employee />
          </RoleRoute>
        ),  
      },

      {
       path: "admin/attendance",
        element: (
          <RoleRoute allow={["admin"]}>
            <Attendance />
          </RoleRoute>
        ),  
      },


      {
        path: "admin/reports",
        element: (
          <RoleRoute allow={["admin"]}>
            <Reports />
          </RoleRoute>
        ),
      },

      // ✅ fallback
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
