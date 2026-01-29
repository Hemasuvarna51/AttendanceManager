import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Login from "./pages/auth/Login";
import Unauthorized from "./pages/auth/Unauthorized";

import AppShell from "./App";
import { useAuthStore } from "./store/auth.store";

// admin pages
import Dashboard from "./pages/admin/Dashboard";
import Tasks from "./pages/admin/Tasks";
import Reports from "./pages/admin/Reports"; // create placeholder if not yet

// employee pages
import CheckIn from "./pages/employee/CheckIn";
import CheckOut from "./pages/employee/CheckOut"; // create if not yet
import MyAttendance from "./pages/employee/MyAttendance"; // create if not yet
import EnrollFace from "./pages/employee/EnrollFace"; // placeholder ok
import MyTasks from "./pages/employee/MyTasks";

function HomeRedirect() {
  const role = useAuthStore((s) => s.role);
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/employee/checkin" replace />;
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
        path: "employee/enroll-face",
        element: (
          <RoleRoute allow={["employee"]}>
            <EnrollFace />
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
